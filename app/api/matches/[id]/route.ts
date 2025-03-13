import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'
import { z } from 'zod'

const matchUpdateSchema = z.object({
  date: z.string().refine(str => !isNaN(Date.parse(str)), {
    message: "Invalid date format"
  }).optional(),
  weekNumber: z.number().int().positive().optional(),
  homeTeamId: z.string().uuid().optional(),
  awayTeamId: z.string().uuid().optional(),
  startingHole: z.number().int().min(1).max(9).optional(),
  status: z.enum(['SCHEDULED', 'IN_PROGRESS', 'COMPLETED']).optional()
})

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const match = await prisma.match.findUnique({
      where: { id: params.id },
      include: {
        homeTeam: true,
        awayTeam: true
      }
    })

    if (!match) {
      return NextResponse.json(
        { error: 'Match not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(match)
  } catch (error) {
    console.error('Error fetching match:', error)
    return NextResponse.json(
      { error: 'Failed to fetch match' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()
    const validatedData = matchUpdateSchema.parse(data)

    // Check if match exists
    const existingMatch = await prisma.match.findUnique({
      where: { id: params.id }
    })

    if (!existingMatch) {
      return NextResponse.json(
        { error: 'Match not found' },
        { status: 404 }
      )
    }

    // If teams are being updated, validate them
    if (validatedData.homeTeamId || validatedData.awayTeamId) {
      const homeTeamId = validatedData.homeTeamId || existingMatch.homeTeamId
      const awayTeamId = validatedData.awayTeamId || existingMatch.awayTeamId

      // Check if teams exist
      const [homeTeam, awayTeam] = await Promise.all([
        prisma.team.findUnique({ where: { id: homeTeamId } }),
        prisma.team.findUnique({ where: { id: awayTeamId } })
      ])

      if (!homeTeam || !awayTeam) {
        return NextResponse.json(
          { error: 'One or both teams not found' },
          { status: 404 }
        )
      }

      // Check if teams are different
      if (homeTeamId === awayTeamId) {
        return NextResponse.json(
          { error: 'Home team and away team must be different' },
          { status: 400 }
        )
      }
    }

    // Update match
    const updatedMatch = await prisma.match.update({
      where: { id: params.id },
      data: {
        ...(validatedData.date && { date: new Date(validatedData.date) }),
        ...(validatedData.weekNumber && { weekNumber: validatedData.weekNumber }),
        ...(validatedData.homeTeamId && { homeTeamId: validatedData.homeTeamId }),
        ...(validatedData.awayTeamId && { awayTeamId: validatedData.awayTeamId }),
        ...(validatedData.startingHole && { startingHole: validatedData.startingHole }),
        ...(validatedData.status && { status: validatedData.status })
      },
      include: {
        homeTeam: true,
        awayTeam: true
      }
    })

    return NextResponse.json(updatedMatch)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating match:', error)
    return NextResponse.json(
      { error: 'Failed to update match' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check if match exists
    const match = await prisma.match.findUnique({
      where: { id: params.id }
    })

    if (!match) {
      return NextResponse.json(
        { error: 'Match not found' },
        { status: 404 }
      )
    }

    // Don't allow deletion of completed matches
    if (match.status === 'COMPLETED') {
      return NextResponse.json(
        { error: 'Cannot delete completed matches' },
        { status: 400 }
      )
    }

    // Delete match
    await prisma.match.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Match deleted successfully' })
  } catch (error) {
    console.error('Error deleting match:', error)
    return NextResponse.json(
      { error: 'Failed to delete match' },
      { status: 500 }
    )
  }
} 