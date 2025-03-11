import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'
import { parseISO } from 'date-fns'
import { zonedTimeToUtc } from 'date-fns-tz'
import { z } from 'zod'
import { formatDateForAPI } from '../../lib/date-utils'

// Central Time Zone
const CT_TIMEZONE = 'America/Chicago'

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
    const data = await request.json()
    
    // Log the incoming date
    console.log('Received date from client:', data.date)
    
    // Create the match with the date as provided
    const match = await prisma.match.create({
      data: {
        date: data.date,
        weekNumber: data.weekNumber,
        homeTeamId: data.homeTeamId,
        awayTeamId: data.awayTeamId,
        startingHole: data.startingHole,
        status: data.status || 'SCHEDULED',
      },
      include: {
        homeTeam: true,
        awayTeam: true
      }
    })

    console.log('Created match with date:', match.date)
    
    return NextResponse.json(match)
  } catch (error) {
    console.error('Error creating match:', error)
    return NextResponse.json(
      { error: 'Failed to create match' },
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

export async function PATCH() {
  try {
    // Update April 14 matches to April 15
    await prisma.match.updateMany({
      where: {
        date: new Date('2024-04-14')
      },
      data: {
        date: new Date('2024-04-15')
      }
    })

    // Update April 21 matches to April 22
    await prisma.match.updateMany({
      where: {
        date: new Date('2024-04-21')
      },
      data: {
        date: new Date('2024-04-22')
      }
    })

    return NextResponse.json({ message: 'Dates updated successfully' })
  } catch (error) {
    console.error('Error updating match dates:', error)
    return NextResponse.json(
      { error: 'Failed to update match dates' },
      { status: 500 }
    )
  }
} 