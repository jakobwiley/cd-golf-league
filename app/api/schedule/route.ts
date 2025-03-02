import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'
import { z } from 'zod'

// Validation schema for schedule data
const scheduleSchema = z.object({
  id: z.string().optional(),
  date: z.string(),
  weekNumber: z.number().int().positive(),
  homeTeamId: z.string(),
  awayTeamId: z.string(),
  startingHole: z.number().int().min(1).max(9).default(1),
  status: z.enum(['SCHEDULED', 'IN_PROGRESS', 'COMPLETED']).default('SCHEDULED')
})

export async function GET() {
  try {
    const matches = await prisma.match.findMany({
      include: {
        homeTeam: true,
        awayTeam: true,
      },
      orderBy: [
        { weekNumber: 'asc' },
        { date: 'asc' }
      ]
    })
    return NextResponse.json(matches)
  } catch (error) {
    console.error('Error fetching schedule:', error)
    return NextResponse.json(
      { error: 'Failed to fetch schedule' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = scheduleSchema.parse(body)

    // Check if teams exist
    const [homeTeam, awayTeam] = await Promise.all([
      prisma.team.findUnique({ where: { id: validatedData.homeTeamId } }),
      prisma.team.findUnique({ where: { id: validatedData.awayTeamId } })
    ])

    if (!homeTeam || !awayTeam) {
      return NextResponse.json(
        { error: 'One or both teams not found' },
        { status: 400 }
      )
    }

    // Check for existing match on same date with same teams
    const existingMatch = await prisma.match.findFirst({
      where: {
        date: new Date(validatedData.date),
        OR: [
          {
            AND: [
              { homeTeamId: validatedData.homeTeamId },
              { awayTeamId: validatedData.awayTeamId }
            ]
          },
          {
            AND: [
              { homeTeamId: validatedData.awayTeamId },
              { awayTeamId: validatedData.homeTeamId }
            ]
          }
        ]
      }
    })

    if (existingMatch && !validatedData.id) {
      return NextResponse.json(
        { error: 'A match between these teams already exists on this date' },
        { status: 400 }
      )
    }

    let match
    if (validatedData.id) {
      // Update existing match
      match = await prisma.match.update({
        where: { id: validatedData.id },
        data: {
          date: new Date(validatedData.date),
          weekNumber: validatedData.weekNumber,
          homeTeamId: validatedData.homeTeamId,
          awayTeamId: validatedData.awayTeamId,
          startingHole: validatedData.startingHole,
          status: validatedData.status
        },
        include: {
          homeTeam: true,
          awayTeam: true
        }
      })
    } else {
      // Create new match
      match = await prisma.match.create({
        data: {
          date: new Date(validatedData.date),
          weekNumber: validatedData.weekNumber,
          homeTeamId: validatedData.homeTeamId,
          awayTeamId: validatedData.awayTeamId,
          startingHole: validatedData.startingHole,
          status: validatedData.status
        },
        include: {
          homeTeam: true,
          awayTeam: true
        }
      })
    }

    return NextResponse.json(match)
  } catch (error) {
    console.error('Error saving schedule:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid schedule data', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to save schedule' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Match ID is required' },
        { status: 400 }
      )
    }

    await prisma.match.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting match:', error)
    return NextResponse.json(
      { error: 'Failed to delete match' },
      { status: 500 }
    )
  }
} 