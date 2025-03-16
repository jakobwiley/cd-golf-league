import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'
import { z } from 'zod'
import { Prisma } from '@prisma/client'
import { SocketEvents } from '../../../lib/socket'

// Validation schema for score
const scoreSchema = z.object({
  matchId: z.string(),
  playerId: z.string(),
  hole: z.number().int().min(1).max(9),
  score: z.number().int().min(1).max(12)
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
    
    // Check if matchScore is available in the prisma client
    if (!prisma.matchScore) {
      console.log('Mock matchScore not available, returning empty array');
      return NextResponse.json([]);
    }
    
    // Fetch scores for the specified match
    const scores = await prisma.matchScore.findMany({
      where: {
        matchId
      },
      include: {
        player: true
      },
      orderBy: [
        { playerId: 'asc' },
        { hole: 'asc' }
      ]
    })
    
    return NextResponse.json(scores)
  } catch (error) {
    console.error('Error fetching scores:', error)
    return NextResponse.json({ error: 'Failed to fetch scores' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    // Validate request data
    const validatedData = batchScoreSchema.parse(data)
    
    // Check if matchScore is available in the prisma client
    if (!prisma.matchScore) {
      console.log('Mock matchScore not available, returning success without saving');
      return NextResponse.json({ success: true, count: validatedData.scores.length });
    }
    
    // Process each score
    const results = await Promise.all(
      validatedData.scores.map(async (score) => {
        // Check if a score already exists for this player and hole
        const existingScore = await prisma.matchScore.findUnique({
          where: {
            matchId_playerId_hole: {
              matchId: score.matchId,
              playerId: score.playerId,
              hole: score.hole
            }
          }
        })
        
        if (existingScore) {
          // Update existing score
          return prisma.matchScore.update({
            where: {
              id: existingScore.id
            },
            data: {
              score: score.score
            }
          })
        } else {
          // Create new score
          return prisma.matchScore.create({
            data: {
              matchId: score.matchId,
              playerId: score.playerId,
              hole: score.hole,
              score: score.score
            }
          })
        }
      })
    )
    
    // Update match status to IN_PROGRESS if it's currently SCHEDULED
    const match = await prisma.match.findUnique({
      where: {
        id: validatedData.scores[0].matchId
      }
    })
    
    if (match && match.status === 'SCHEDULED') {
      await prisma.match.update({
        where: {
          id: match.id
        },
        data: {
          status: 'IN_PROGRESS'
        }
      })
    }
    
    let allScores = [];
    let matchPlayers = [];
    
    // Check if all players have scores for all 9 holes
    if (prisma.matchScore) {
      allScores = await prisma.matchScore.findMany({
        where: {
          matchId: validatedData.scores[0].matchId
        }
      })
      
      matchPlayers = await prisma.player.findMany({
        where: {
          OR: [
            { teamId: match?.homeTeamId },
            { teamId: match?.awayTeamId }
          ]
        }
      })
      
      // If all players have scores for all 9 holes, update match status to COMPLETED
      if (matchPlayers.length > 0 && allScores.length === matchPlayers.length * 9) {
        await prisma.match.update({
          where: {
            id: match!.id
          },
          data: {
            status: 'COMPLETED'
          }
        })
      }
    }
    
    // Emit Socket.IO events for real-time updates
    await emitScoreUpdated(validatedData.scores[0].matchId)
    
    // If the match status changed to COMPLETED, also update standings
    if (matchPlayers.length > 0 && allScores.length === matchPlayers.length * 9) {
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
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        { error: 'Database error', code: error.code },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ error: 'Failed to save scores' }, { status: 500 })
  }
} 