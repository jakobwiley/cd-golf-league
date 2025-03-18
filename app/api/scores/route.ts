import { NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'
import { z } from 'zod'
import { SocketEvents } from '../../../lib/socket'

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
  score: z.number(),
  putts: z.number().optional(),
  fairway: z.boolean().optional()
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
      .from('Score')
      .select('*')
      .eq('matchId', matchId)
      .order('hole', { ascending: true })
      .order('playerId', { ascending: true })

    if (error) {
      console.error('Error fetching scores:', error)
      return NextResponse.json({ error: 'Failed to fetch scores' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching scores:', error)
    return NextResponse.json({ error: 'Failed to fetch scores' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = batchScoreSchema.parse(body)

    // Process each score
    const results = await Promise.all(
      validatedData.scores.map(async (score) => {
        // Insert the score
        const { data, error } = await supabase
          .from('Score')
          .insert({
            matchId: score.matchId,
            playerId: score.playerId,
            hole: score.hole,
            score: score.score,
            putts: score.putts,
            fairway: score.fairway,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          })
          .select()
          .single()

        if (error) {
          throw error
        }

        return data
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
      throw matchError
    }

    if (match && match.status === 'SCHEDULED') {
      const { error: updateError } = await supabase
        .from('Match')
        .update({ status: 'IN_PROGRESS' })
        .eq('id', validatedData.scores[0].matchId)

      if (updateError) {
        throw updateError
      }
    }

    // Check if all players have scores for all 9 holes
    const { data: scores, error: scoresError } = await supabase
      .from('Score')
      .select('*')
      .eq('matchId', validatedData.scores[0].matchId)

    if (scoresError) {
      throw scoresError
    }

    const { data: players, error: playersError } = await supabase
      .from('Player')
      .select('*')
      .in('teamId', [match.homeTeamId, match.awayTeamId])

    if (playersError) {
      throw playersError
    }

    // If all players have scores for all 9 holes, update match status to COMPLETED
    if (players && scores && players.length > 0 && scores.length === players.length * 9) {
      const { error: updateError } = await supabase
        .from('Match')
        .update({ status: 'COMPLETED' })
        .eq('id', validatedData.scores[0].matchId)

      if (updateError) {
        throw updateError
      }
    }

    // Emit Socket.IO events for real-time updates
    await emitScoreUpdated(validatedData.scores[0].matchId)

    // If the match status changed to COMPLETED, also update standings
    if (players && scores && players.length > 0 && scores.length === players.length * 9) {
      await emitStandingsUpdated()
    }

    return NextResponse.json({ success: true, count: results.length })
  } catch (error) {
    console.error('Error saving scores:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json({ error: 'Failed to save scores' }, { status: 500 })
  }
}