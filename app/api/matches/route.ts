import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'
import { z } from 'zod'
import { Prisma } from '@prisma/client'

// Validation schemas
const matchCreateSchema = z.object({
  date: z.string().refine(str => !isNaN(Date.parse(str)), {
    message: "Invalid date format"
  }),
  weekNumber: z.number().int().positive(),
  homeTeamId: z.string(),
  awayTeamId: z.string(),
  startingHole: z.number().int().min(1).max(9),
  status: z.enum(['SCHEDULED', 'IN_PROGRESS', 'COMPLETED']).optional()
})

const matchUpdateSchema = matchCreateSchema.partial().extend({
  id: z.string()
})

export async function GET(request: Request) {
  try {
    console.log('Fetching matches...');
    
    const matches = await prisma.match.findMany({
      include: {
        homeTeam: true,
        awayTeam: true,
      },
      orderBy: [
        { weekNumber: 'asc' },
        { startingHole: 'asc' }
      ]
    });
    
    // Log match statistics
    console.log(`Found ${matches.length} matches`);
    
    // Group matches by week for debugging
    const weekCounts = matches.reduce((acc, match) => {
      acc[match.weekNumber] = (acc[match.weekNumber] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);
    
    console.log('Matches per week:', weekCounts);
    
    // Log unique week numbers
    const uniqueWeeks = Array.from(new Set(matches.map(m => m.weekNumber))).sort((a, b) => a - b);
    console.log('Unique weeks:', uniqueWeeks);
    
    return NextResponse.json(matches)
  } catch (error) {
    console.error('Error fetching matches:', error)
    return NextResponse.json({ error: 'Failed to fetch matches' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    // Validate request data
    const validatedData = matchCreateSchema.parse(data)

    // Check if teams exist
    const [homeTeam, awayTeam] = await Promise.all([
      prisma.team.findUnique({ where: { id: validatedData.homeTeamId } }),
      prisma.team.findUnique({ where: { id: validatedData.awayTeamId } })
    ])

    if (!homeTeam || !awayTeam) {
      return NextResponse.json(
        { error: 'One or both teams not found' },
        { status: 404 }
      )
    }

    // Check if teams are different
    if (validatedData.homeTeamId === validatedData.awayTeamId) {
      return NextResponse.json(
        { error: 'Home team and away team must be different' },
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

    if (existingMatch) {
      return NextResponse.json(
        { error: 'A match between these teams already exists on this date' },
        { status: 400 }
      )
    }

    const match = await prisma.match.create({
      data: {
        date: new Date(validatedData.date),
        weekNumber: validatedData.weekNumber,
        homeTeamId: validatedData.homeTeamId,
        awayTeamId: validatedData.awayTeamId,
        startingHole: validatedData.startingHole,
        status: validatedData.status || 'SCHEDULED'
      },
      include: {
        homeTeam: true,
        awayTeam: true
      }
    })

    return NextResponse.json(match)
  } catch (error) {
    console.error('Error creating match:', error)

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
    
    if (error instanceof Prisma.PrismaClientInitializationError) {
      return NextResponse.json(
        { error: 'Failed to connect to database' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create match' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json()
    
    // Validate request data
    const validatedData = matchUpdateSchema.parse(data)

    // Check if match exists
    const existingMatch = await prisma.match.findUnique({
      where: { id: validatedData.id }
    })

    if (!existingMatch) {
      return NextResponse.json(
        { error: 'Match not found' },
        { status: 404 }
      )
    }

    // If teams are being updated, check if they exist
    if (validatedData.homeTeamId || validatedData.awayTeamId) {
      const [homeTeam, awayTeam] = await Promise.all([
        validatedData.homeTeamId
          ? prisma.team.findUnique({ where: { id: validatedData.homeTeamId } })
          : Promise.resolve(true),
        validatedData.awayTeamId
          ? prisma.team.findUnique({ where: { id: validatedData.awayTeamId } })
          : Promise.resolve(true)
      ])

      if (!homeTeam || !awayTeam) {
        return NextResponse.json(
          { error: 'One or both teams not found' },
          { status: 404 }
        )
      }
    }

    // Update match
    const { id, ...updateData } = validatedData
    const match = await prisma.match.update({
      where: { id },
      data: updateData,
      include: {
        homeTeam: true,
        awayTeam: true
      }
    })

    return NextResponse.json(match)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        { error: 'Database error', code: error.code },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update match' },
      { status: 500 }
    )
  }
} 