import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'
import { formatDateForAPI } from '../../../lib/date-utils'

// Central Time Zone
const CT_TIMEZONE = 'America/Chicago'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    const match = await prisma.match.findUnique({
      where: { id },
      include: {
        homeTeam: true,
        awayTeam: true
      }
    });
    
    if (!match) {
      return NextResponse.json(
        { error: 'Match not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(match);
  } catch (error) {
    console.error('Error fetching match:', error);
    return NextResponse.json(
      { error: 'Failed to fetch match' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const data = await request.json();
    
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

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    await prisma.match.delete({
      where: { id }
    });
    
    return NextResponse.json({ message: 'Match deleted successfully' });
  } catch (error) {
    console.error('Error deleting match:', error);
    return NextResponse.json(
      { error: 'Failed to delete match' },
      { status: 500 }
    );
  }
} 