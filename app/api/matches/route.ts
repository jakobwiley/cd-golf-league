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
    const { searchParams } = new URL(request.url)
    
    // Build filter conditions
    const where: any = {}
    
    // Filter by status
    const status = searchParams.get('status')
    if (status) {
      where.status = status
    }

    // Filter by week
    const week = searchParams.get('week')
    if (week) {
      where.weekNumber = parseInt(week)
    }

    // Filter by team
    const teamId = searchParams.get('teamId')
    if (teamId) {
      where.OR = [
        { homeTeamId: teamId },
        { awayTeamId: teamId }
      ]
    }

    // Filter by date range
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    if (startDate || endDate) {
      where.date = {}
      if (startDate) where.date.gte = new Date(startDate)
      if (endDate) where.date.lte = new Date(endDate)
    }

    const matches = await prisma.match.findMany({
      where,
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
    console.error('Error fetching matches:', error)
    return NextResponse.json(
      { error: 'Failed to fetch matches', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
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