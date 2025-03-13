import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'
import { z } from 'zod'

const scoreSchema = z.object({
  matchId: z.string(),
  scores: z.array(z.object({
    playerId: z.string(),
    hole: z.number().min(1).max(9),
    score: z.number().min(1).max(12)
  }))
})

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const matchId = searchParams.get('matchId')

  if (!matchId) {
    return NextResponse.json({ error: 'Match ID is required' }, { status: 400 })
  }

  try {
    const scores = await prisma.matchScore.findMany({
      where: { matchId },
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
    const body = await request.json()
    const { matchId, scores } = scoreSchema.parse(body)

    // Delete existing scores for this match
    await prisma.matchScore.deleteMany({
      where: { matchId }
    })

    // Insert new scores
    await prisma.matchScore.createMany({
      data: scores.map(score => ({
        matchId,
        playerId: score.playerId,
        hole: score.hole,
        score: score.score
      }))
    })

    // Calculate and update match points
    await calculateMatchPoints(matchId)

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid score data' }, { status: 400 })
    }
    console.error('Error saving scores:', error)
    return NextResponse.json({ error: 'Failed to save scores' }, { status: 500 })
  }
}

async function calculateMatchPoints(matchId: string) {
  const match = await prisma.match.findUnique({
    where: { id: matchId },
    include: {
      homeTeam: {
        include: { players: true }
      },
      awayTeam: {
        include: { players: true }
      },
      scores: true
    }
  })

  if (!match) return

  // Calculate total scores for each team
  const homeTeamTotal = calculateTeamTotal(match.scores, match.homeTeam.players.map(p => p.id))
  const awayTeamTotal = calculateTeamTotal(match.scores, match.awayTeam.players.map(p => p.id))

  // Determine points (2 points for win, 1 point for tie)
  const homeTeamPoints = homeTeamTotal < awayTeamTotal ? 2 : homeTeamTotal === awayTeamTotal ? 1 : 0
  const awayTeamPoints = awayTeamTotal < homeTeamTotal ? 2 : awayTeamTotal === homeTeamTotal ? 1 : 0

  // Update match points
  await prisma.$transaction([
    prisma.matchPoints.upsert({
      where: {
        matchId_teamId: {
          matchId: match.id,
          teamId: match.homeTeamId
        }
      },
      create: {
        matchId: match.id,
        teamId: match.homeTeamId,
        points: homeTeamPoints
      },
      update: {
        points: homeTeamPoints
      }
    }),
    prisma.matchPoints.upsert({
      where: {
        matchId_teamId: {
          matchId: match.id,
          teamId: match.awayTeamId
        }
      },
      create: {
        matchId: match.id,
        teamId: match.awayTeamId,
        points: awayTeamPoints
      },
      update: {
        points: awayTeamPoints
      }
    })
  ])
}

function calculateTeamTotal(scores: any[], playerIds: string[]) {
  return scores
    .filter(score => playerIds.includes(score.playerId))
    .reduce((total, score) => total + score.score, 0)
} 