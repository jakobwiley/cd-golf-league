import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';
import { SocketEvents } from '../../../app/utils/websocketConnection';
import { z } from 'zod'
import { randomUUID } from 'crypto'

interface Score {
  id: string
  matchId: string
  playerId: string
  hole: number
  score: number
  putts?: number
  fairway?: boolean
  createdAt: string
  updatedAt: string
}

interface Match {
  id: string
  date: string
  weekNumber: number
  startingHole: number
  status: string
  homeTeamId: string
  awayTeamId: string
  homeTeam: {
    id: string
    name: string
  }
  awayTeam: {
    id: string
    name: string
  }
}

interface Player {
  id: string
  name: string
  handicapIndex: number
  teamId: string
  Team: {
    id: string
    name: string
  }
}

// Validation schema for score
const scoreSchema = z.object({
  matchId: z.string(),
  playerId: z.string(),
  hole: z.number(),
  score: z.number().nullable(),
  putts: z.number().optional().nullable(),
  fairway: z.boolean().optional().nullable()
})

// Validation schema for batch score submission
const batchScoreSchema = z.object({
  scores: z.array(scoreSchema)
})

// Function to emit score updated event
async function emitScoreUpdated(matchId: string) {
  try {
    // Get the Socket.io server instance
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/socket`, {
      method: 'GET',
    })
    
    if (!res.ok) {
      console.error('Failed to get Socket.io server instance')
      return
    }
    
    // Emit the score updated event
    const socketIo = (global as any).socketIo
    if (socketIo) {
      console.log(`Emitting ${SocketEvents.SCORE_UPDATED} event for match ${matchId}`)
      socketIo.emit(SocketEvents.SCORE_UPDATED, { matchId })
    } else {
      console.warn('Socket.io server not initialized')
    }
  } catch (error) {
    console.error('Error emitting score updated event:', error)
  }
}

// Function to emit standings updated event
async function emitStandingsUpdated() {
  try {
    // Get the Socket.io server instance
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/socket`, {
      method: 'GET',
    })
    
    if (!res.ok) {
      console.error('Failed to get Socket.io server instance')
      return
    }
    
    // Emit the standings updated event
    const socketIo = (global as any).socketIo
    if (socketIo) {
      console.log(`Emitting ${SocketEvents.STANDINGS_UPDATED} event`)
      socketIo.emit(SocketEvents.STANDINGS_UPDATED, {})
    } else {
      console.warn('Socket.io server not initialized')
    }
  } catch (error) {
    console.error('Error emitting standings updated event:', error)
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const matchId = searchParams.get('matchId')
    
    if (!matchId) {
      return NextResponse.json({ error: 'Match ID is required' }, { status: 400 })
    }
    
    // Fetch scores for the specified match
    const { data, error } = await supabase
      .from('MatchScore')
      .select('*')
      .eq('matchId', matchId)
      .order('hole', { ascending: true })
      .order('playerId', { ascending: true })

    if (error) {
      console.error('Error fetching scores:', error)
      return NextResponse.json({ error: error.message || 'Failed to fetch scores' }, { status: 500 })
    }

    // If no scores found, return empty array
    if (!data || data.length === 0) {
      return NextResponse.json([])
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching scores:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to fetch scores' 
    }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('Received score data:', JSON.stringify(body))
    
    // Log Supabase connection details (without exposing keys)
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('Supabase Key available:', !!process.env.SUPABASE_SERVICE_ROLE_KEY || !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    
    const validatedData = batchScoreSchema.parse(body)
    console.log('Validated data:', JSON.stringify(validatedData))

    // Verify that the player exists before attempting to save the score
    for (const score of validatedData.scores) {
      console.log(`Verifying player ${score.playerId} exists...`)
      const { data: playerData, error: playerError } = await supabase
        .from('Player')
        .select('id, name')
        .eq('id', score.playerId)
        .single()
      
      if (playerError) {
        console.error(`Error verifying player ${score.playerId}:`, playerError)
        return NextResponse.json({ 
          error: 'Player not found', 
          details: playerError,
          playerId: score.playerId
        }, { status: 400 })
      }
      
      console.log(`Player verified: ${playerData.name} (${playerData.id})`)
    }

    // Process each score
    const results = await Promise.all(
      validatedData.scores.map(async (score) => {
        console.log('Processing score for player:', score.playerId, 'hole:', score.hole)
        
        try {
          // Check if we're clearing a score (null or undefined score value)
          if (score.score === null || score.score === undefined) {
            console.log('Clearing score for player:', score.playerId, 'hole:', score.hole)
            
            // Delete the score record if it exists
            const { error: deleteError } = await supabase
              .from('MatchScore')
              .delete()
              .eq('matchId', score.matchId)
              .eq('playerId', score.playerId)
              .eq('hole', score.hole)
            
            if (deleteError) {
              console.error('Error deleting score:', deleteError)
              throw deleteError
            }
            
            return { deleted: true, matchId: score.matchId, playerId: score.playerId, hole: score.hole }
          }
          
          console.log('Upserting score:', {
            matchId: score.matchId,
            playerId: score.playerId,
            hole: score.hole,
            score: score.score
          })
          
          // Use upsert operation (insert if not exists, update if exists)
          const { data: existingScore, error: existingScoreError } = await supabase
            .from('MatchScore')
            .select('id, createdAt')
            .eq('matchId', score.matchId)
            .eq('playerId', score.playerId)
            .eq('hole', score.hole)
            .maybeSingle()

          if (existingScoreError) {
            console.error('Error checking for existing score:', existingScoreError)
            // Continue with new score creation if we can't find the existing one
          }

          console.log('Upserting score with data:', {
            id: existingScore?.id || randomUUID(),
            matchId: score.matchId,
            playerId: score.playerId,
            hole: score.hole,
            score: score.score
          });

          let result;
          
          if (existingScore) {
            // Update existing record
            console.log('Updating existing score with ID:', existingScore.id);
            result = await supabase
              .from('MatchScore')
              .update({
                score: score.score,
                putts: score.putts,
                fairway: score.fairway,
                updatedAt: new Date().toISOString()
              })
              .eq('id', existingScore.id);
          } else {
            // Insert new record
            console.log('Inserting new score');
            const newId = randomUUID();
            result = await supabase
              .from('MatchScore')
              .insert({
                id: newId,
                matchId: score.matchId,
                playerId: score.playerId,
                hole: score.hole,
                score: score.score,
                putts: score.putts,
                fairway: score.fairway,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              });
          }
          
          if (result.error) {
            console.error('Error saving score:', result.error)
            console.error('Error details:', JSON.stringify(result.error))
            throw result.error
          }

          console.log('Score saved successfully')
          return { success: true, matchId: score.matchId, playerId: score.playerId, hole: score.hole }
        } catch (scoreError) {
          console.error('Error processing individual score:', scoreError)
          throw scoreError
        }
      })
    )

    // Update match status to IN_PROGRESS if it's currently SCHEDULED
    const { data: match, error: matchError } = await supabase
      .from('Match')
      .select(`
        id,
        status,
        homeTeamId,
        awayTeamId
      `)
      .eq('id', validatedData.scores[0].matchId)
      .single()

    if (matchError) {
      console.error('Error fetching match:', matchError)
      throw matchError
    }

    if (match && match.status === 'SCHEDULED') {
      const updateResult = await supabase
        .from('Match')
        .update({ status: 'IN_PROGRESS' })
        .eq('id', validatedData.scores[0].matchId)
      
      if (updateResult.error) {
        console.error('Error updating match status:', updateResult.error)
        throw updateResult.error
      }
    }

    // Check if all players have scores for all 9 holes
    const { data: scores, error: scoresError } = await supabase
      .from('MatchScore')
      .select('*')
      .eq('matchId', validatedData.scores[0].matchId)

    if (scoresError) {
      console.error('Error fetching all scores:', scoresError)
      throw scoresError
    }

    const { data: players, error: playersError } = await supabase
      .from('Player')
      .select('*')
      .in('teamId', [match.homeTeamId, match.awayTeamId])

    if (playersError) {
      console.error('Error fetching players:', playersError)
      throw playersError
    }

    // If all players have scores for all 9 holes, update match status to COMPLETED
    if (players && scores && players.length > 0 && scores.length === players.length * 9) {
      const updateResult = await supabase
        .from('Match')
        .update({ status: 'COMPLETED' })
        .eq('id', validatedData.scores[0].matchId)
      
      if (updateResult.error) {
        console.error('Error updating match status to COMPLETED:', updateResult.error)
        throw updateResult.error
      }
    }

    // Emit Socket.IO events for real-time updates
    await emitScoreUpdated(validatedData.scores[0].matchId)

    // If the match status changed to COMPLETED, also update standings
    if (players && scores && players.length > 0 && scores.length === players.length * 9) {
      await emitStandingsUpdated()
    }

    return NextResponse.json({ success: true, count: results.length, results })
  } catch (error) {
    console.error('Error saving scores:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      )
    }

    // Check if it's a Supabase error
    if (error && typeof error === 'object' && 'code' in error) {
      return NextResponse.json({ 
        error: 'Failed to save scores', 
        details: error,
        message: error.message || 'Database error'
      }, { status: 500 })
    }

    return NextResponse.json({ 
      error: 'Failed to save scores',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}