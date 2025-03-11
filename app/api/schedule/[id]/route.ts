import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'
import { formatDateForAPI } from '../../../lib/date-utils'

// Central Time Zone
const CT_TIMEZONE = 'America/Chicago'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const data = await request.json()
    
    // Log the incoming date
    console.log('Received date for update:', data.date)
    
    // Update the match with the date as provided
    const match = await prisma.match.update({
      where: { id },
      data: {
        date: data.date,
        weekNumber: data.weekNumber,
        homeTeamId: data.homeTeamId,
        awayTeamId: data.awayTeamId,
        startingHole: data.startingHole,
        status: data.status
      },
      include: {
        homeTeam: true,
        awayTeam: true
      }
    })

    console.log('Updated match with date:', match.date)
    
    return NextResponse.json(match)
  } catch (error) {
    console.error('Error updating match:', error)
    return NextResponse.json(
      { error: 'Failed to update match' },
      { status: 500 }
    )
  }
} 