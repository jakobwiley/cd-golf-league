import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'
import { randomUUID } from 'crypto'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Define validation schemas
const totalPointsSchema = z.object({
  home: z.number(),
  away: z.number()
})

const holePointsSchema = z.record(
  z.string(), // hole number as string key
  z.object({
    home: z.number(),
    away: z.number()
  })
)

const batchMatchPointsSchema = z.object({
  matchId: z.string().uuid(),
  totalPoints: totalPointsSchema,
  holePoints: holePointsSchema
})

export async function GET(request: Request) {
  try {
    // Get the match ID from the query params
    const { searchParams } = new URL(request.url)
    const matchId = searchParams.get('matchId')

    if (!matchId) {
      return NextResponse.json({ error: 'Match ID is required' }, { status: 400 })
    }

    // Fetch match points from the database
    const { data, error } = await supabase
      .from('MatchPoints')
      .select('*')
      .eq('matchId', matchId)

    if (error) {
      console.error('Error fetching match points:', error)
      return NextResponse.json({ error: 'Failed to fetch match points' }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('Received match points data:', JSON.stringify(body))
    
    // Log Supabase connection details (without exposing keys)
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('Supabase Key available:', !!process.env.SUPABASE_SERVICE_ROLE_KEY || !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    
    // Validate the incoming data
    const validatedData = batchMatchPointsSchema.parse(body)
    console.log('Validated match points data:', JSON.stringify(validatedData))

    // Get match details to find the teamId
    console.log('Fetching match details to get teamId...')
    const { data: matchData, error: matchError } = await supabase
      .from('Match')
      .select('id, homeTeamId')
      .eq('id', validatedData.matchId)
      .single()

    if (matchError) {
      console.error('Error fetching match details:', matchError)
      return NextResponse.json({ 
        error: 'Failed to fetch match details', 
        details: matchError 
      }, { status: 500 })
    }

    // Use the homeTeamId as the teamId for the MatchPoints record
    const teamId = matchData.homeTeamId
    console.log('Using teamId:', teamId)

    // First, save the total points
    console.log('Saving total match points...')
    const { data: existingTotalPoints, error: existingTotalPointsError } = await supabase
      .from('MatchPoints')
      .select('id')
      .eq('matchId', validatedData.matchId)
      .is('hole', null)
      .single()

    if (existingTotalPointsError && existingTotalPointsError.code !== 'PGRST116') {
      console.error('Error checking for existing total points:', existingTotalPointsError)
      return NextResponse.json({ 
        error: 'Failed to check for existing total points', 
        details: existingTotalPointsError 
      }, { status: 500 })
    }

    console.log('Existing total points record:', existingTotalPoints)

    if (existingTotalPoints) {
      // Update existing total points
      console.log('Updating existing total points record...')
      const { error: updateError } = await supabase
        .from('MatchPoints')
        .update({
          homePoints: validatedData.totalPoints.home,
          awayPoints: validatedData.totalPoints.away,
          points: validatedData.totalPoints.home, // Use homePoints as the points value
          updatedAt: new Date().toISOString()
        })
        .eq('id', existingTotalPoints.id)

      if (updateError) {
        console.error('Error updating total points:', updateError)
        return NextResponse.json({ 
          error: 'Failed to update total match points', 
          details: updateError 
        }, { status: 500 })
      }
      
      console.log('Total points updated successfully')
    } else {
      // Insert new total points
      console.log('Inserting new total points record...')
      const { error: insertError } = await supabase
        .from('MatchPoints')
        .insert({
          id: randomUUID(),
          matchId: validatedData.matchId,
          teamId: teamId, 
          hole: null, // null for total points
          homePoints: validatedData.totalPoints.home,
          awayPoints: validatedData.totalPoints.away,
          points: validatedData.totalPoints.home, // Use homePoints as the points value
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })

      if (insertError) {
        console.error('Error inserting total points:', insertError)
        return NextResponse.json({ 
          error: 'Failed to save total match points', 
          details: insertError 
        }, { status: 500 })
      }
      
      console.log('Total points inserted successfully')
    }

    // Then, save points for each hole
    console.log('Saving hole-by-hole points...')
    for (const [holeStr, points] of Object.entries(validatedData.holePoints)) {
      const hole = parseInt(holeStr)
      console.log(`Processing hole ${hole} with points:`, points)

      // Check if points for this hole already exist
      const { data: existingHolePoints, error: existingHolePointsError } = await supabase
        .from('MatchPoints')
        .select('id')
        .eq('matchId', validatedData.matchId)
        .eq('hole', hole)
        .single()

      if (existingHolePointsError && existingHolePointsError.code !== 'PGRST116') {
        console.error(`Error checking for existing points for hole ${hole}:`, existingHolePointsError)
        continue // Skip this hole but continue with others
      }

      console.log(`Existing points for hole ${hole}:`, existingHolePoints)

      if (existingHolePoints) {
        // Update existing hole points
        console.log(`Updating existing points for hole ${hole}...`)
        const { error: updateError } = await supabase
          .from('MatchPoints')
          .update({
            homePoints: points.home,
            awayPoints: points.away,
            points: points.home, // Use homePoints as the points value
            updatedAt: new Date().toISOString()
          })
          .eq('id', existingHolePoints.id)

        if (updateError) {
          console.error(`Error updating points for hole ${hole}:`, updateError)
          continue // Skip this hole but continue with others
        }
        
        console.log(`Points for hole ${hole} updated successfully`)
      } else {
        // Insert new hole points
        console.log(`Inserting new points for hole ${hole}...`)
        const { error: insertError } = await supabase
          .from('MatchPoints')
          .insert({
            id: randomUUID(),
            matchId: validatedData.matchId,
            teamId: teamId, // Add the required teamId
            hole: hole,
            homePoints: points.home,
            awayPoints: points.away,
            points: points.home, // Use homePoints as the points value
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          })

        if (insertError) {
          console.error(`Error inserting points for hole ${hole}:`, insertError)
          continue // Skip this hole but continue with others
        }
        
        console.log(`Points for hole ${hole} inserted successfully`)
      }
    }

    return NextResponse.json({ 
      message: 'Match points saved successfully'
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ 
      error: 'An unexpected error occurred', 
      details: error 
    }, { status: 500 })
  }
}
