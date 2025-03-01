import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import { z } from 'zod'

// Validation schemas
const MatchSchema = z.object({
  homeTeamId: z.string(),
  awayTeamId: z.string(),
  startTime: z.string(),
}).refine(data => data.homeTeamId !== data.awayTeamId, {
  message: "Team cannot play against itself"
})

const ScheduleSchema = z.object({
  date: z.string(),
  weekNumber: z.number(),
  matches: z.array(MatchSchema)
}).refine(async (data) => {
  // Check if any team is playing multiple times in the same week
  const teamIds = data.matches.flatMap(match => [match.homeTeamId, match.awayTeamId])
  const duplicates = teamIds.filter((id, index) => teamIds.indexOf(id) !== index)
  return duplicates.length === 0
}, {
  message: "Teams cannot play multiple times in the same week"
})

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const weekNumber = searchParams.get('weekNumber')

  try {
    const schedule = await prisma.match.findMany({
      where: weekNumber ? { weekNumber: parseInt(weekNumber) } : undefined,
      include: {
        homeTeam: true,
        awayTeam: true,
      },
      orderBy: [
        { weekNumber: 'asc' },
        { startTime: 'asc' },
      ],
    })

    return NextResponse.json(schedule)
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
    
    // Validate request body
    const validatedData = await ScheduleSchema.parseAsync(body)

    // Check for time slot conflicts
    const existingMatches = await prisma.match.findMany({
      where: {
        date: new Date(validatedData.date),
      },
    })

    const timeSlots = new Set(existingMatches.map(match => match.startTime))
    const hasTimeConflict = validatedData.matches.some(match => 
      timeSlots.has(match.startTime)
    )

    if (hasTimeConflict) {
      return NextResponse.json(
        { error: 'Time slot conflicts detected' },
        { status: 400 }
      )
    }

    // Create all matches for the week
    const createdMatches = await prisma.$transaction(
      validatedData.matches.map(match => 
        prisma.match.create({
          data: {
            date: new Date(validatedData.date),
            weekNumber: validatedData.weekNumber,
            startTime: match.startTime,
            homeTeamId: match.homeTeamId,
            awayTeamId: match.awayTeamId,
            status: 'SCHEDULED',
          },
        })
      )
    )

    return NextResponse.json(createdMatches)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating schedule:', error)
    return NextResponse.json(
      { error: 'Failed to create schedule' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    // Validate update data
    const validatedData = await ScheduleSchema.parseAsync(updateData)

    const updatedMatch = await prisma.match.update({
      where: { id },
      data: {
        date: new Date(validatedData.date),
        weekNumber: validatedData.weekNumber,
        ...validatedData.matches[0], // Assuming single match update
      },
    })

    return NextResponse.json(updatedMatch)
  } catch (error) {
    console.error('Error updating schedule:', error)
    return NextResponse.json(
      { error: 'Failed to update schedule' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json(
      { error: 'Match ID is required' },
      { status: 400 }
    )
  }

  try {
    await prisma.match.delete({
      where: { id },
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