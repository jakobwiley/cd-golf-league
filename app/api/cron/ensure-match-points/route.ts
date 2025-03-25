import { NextResponse } from 'next/server'
import { supabase } from '../../../../lib/supabase'

// Match ID for Brew/Jake vs Clauss/Wade
const BREW_JAKE_MATCH_ID = 'd0b585dd-09e4-4171-b133-2f5376bcc59a'

export async function GET() {
  try {
    console.log('Cron: Ensuring match points are correctly configured...')
    
    // Check if the match exists
    console.log(`Checking for Brew/Jake vs Clauss/Wade match (ID: ${BREW_JAKE_MATCH_ID})`)
    const { data: match, error: matchError } = await supabase
      .from('Match')
      .select('*')
      .eq('id', BREW_JAKE_MATCH_ID)
      .single()
    
    if (matchError) {
      console.error('Error fetching match:', matchError.message)
      return NextResponse.json(
        { error: 'Failed to fetch match', details: matchError },
        { status: 500 }
      )
    }
    
    if (!match) {
      console.log('Match not found')
      return NextResponse.json(
        { error: 'Match not found' },
        { status: 404 }
      )
    }
    
    console.log('Match found:')
    console.log(`- ID: ${match.id}`)
    console.log(`- Status: ${match.status}`)
    console.log(`- Home team ID: ${match.homeTeamId}`)
    console.log(`- Away team ID: ${match.awayTeamId}`)
    
    // Ensure match status is COMPLETED
    if (match.status !== 'COMPLETED' && match.status !== 'FINALIZED') {
      console.log('Updating match status to COMPLETED...')
      
      const { data: updatedMatch, error: updateMatchError } = await supabase
        .from('Match')
        .update({ status: 'COMPLETED' })
        .eq('id', match.id)
        .select()
      
      if (updateMatchError) {
        console.error('Error updating match status:', updateMatchError.message)
        return NextResponse.json(
          { error: 'Failed to update match status', details: updateMatchError },
          { status: 500 }
        )
      }
      
      console.log('Match status updated successfully:')
      console.log(`- Status: ${updatedMatch[0].status}`)
    } else {
      console.log(`Match status is already ${match.status}`)
    }
    
    // Check if match points record exists
    console.log('Checking if match points record exists...')
    const { data: matchPoints, error: matchPointsError } = await supabase
      .from('MatchPoints')
      .select('*')
      .eq('matchId', match.id)
      .is('hole', null)
    
    if (matchPointsError) {
      console.error('Error fetching match points:', matchPointsError.message)
      return NextResponse.json(
        { error: 'Failed to fetch match points', details: matchPointsError },
        { status: 500 }
      )
    }
    
    if (matchPoints && matchPoints.length > 0) {
      console.log('Match points record already exists:')
      console.log(`- ID: ${matchPoints[0].id}`)
      console.log(`- Home points: ${matchPoints[0].homePoints}`)
      console.log(`- Away points: ${matchPoints[0].awayPoints}`)
      
      // Update the match points if they're not correct
      if (matchPoints[0].homePoints !== 5 || matchPoints[0].awayPoints !== 4) {
        console.log('Updating match points to correct values...')
        
        const { data: updatedPoints, error: updateError } = await supabase
          .from('MatchPoints')
          .update({
            homePoints: 5,
            awayPoints: 4,
            points: 5
          })
          .eq('id', matchPoints[0].id)
          .select()
        
        if (updateError) {
          console.error('Error updating match points:', updateError.message)
          return NextResponse.json(
            { error: 'Failed to update match points', details: updateError },
            { status: 500 }
          )
        }
        
        console.log('Match points updated successfully:')
        console.log(`- Home points: ${updatedPoints[0].homePoints}`)
        console.log(`- Away points: ${updatedPoints[0].awayPoints}`)
      } else {
        console.log('Match points are already correct')
      }
      
      return NextResponse.json({
        message: 'Match points verified',
        homePoints: matchPoints[0].homePoints,
        awayPoints: matchPoints[0].awayPoints
      })
    } else {
      console.log('No match points record found, creating one...')
      
      // IMPORTANT: Explicitly set hole to null to ensure it's properly stored
      const { data: newPoints, error: createError } = await supabase
        .from('MatchPoints')
        .insert([
          {
            matchId: match.id,
            teamId: match.homeTeamId,
            hole: null, // Explicitly set to null
            homePoints: 5,
            awayPoints: 4,
            points: 5
          }
        ])
        .select()
      
      if (createError) {
        console.error('Error creating match points:', createError.message)
        return NextResponse.json(
          { error: 'Failed to create match points', details: createError },
          { status: 500 }
        )
      }
      
      console.log('Match points record created successfully:')
      console.log(`- ID: ${newPoints[0].id}`)
      console.log(`- Home points: ${newPoints[0].homePoints}`)
      console.log(`- Away points: ${newPoints[0].awayPoints}`)
      
      return NextResponse.json({
        message: 'Match points created',
        homePoints: newPoints[0].homePoints,
        awayPoints: newPoints[0].awayPoints
      })
    }
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
