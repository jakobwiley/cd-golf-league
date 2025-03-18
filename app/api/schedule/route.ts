import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'
import { parseISO } from 'date-fns'
import { zonedTimeToUtc } from 'date-fns-tz'
import { z } from 'zod'
import { formatDateForAPI } from '../../lib/date-utils'
import { supabase } from '../../../lib/supabase'

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
    console.log('API route: Fetching schedule data from Supabase...');
    
    // Get teams
    const { data: teams, error: teamsError } = await supabase
      .from('Team')
      .select('*')
      .order('name');
      
    if (teamsError) {
      console.error('API route: Supabase teams error:', teamsError);
      return NextResponse.json(
        { error: 'Failed to fetch teams', details: teamsError.message },
        { status: 500 }
      );
    }
    
    // Get matches with team data
    const { data: matches, error: matchesError } = await supabase
      .from('Match')
      .select(`
        *,
        homeTeam:homeTeamId(id, name),
        awayTeam:awayTeamId(id, name)
      `)
      .order('weekNumber')
      .order('startingHole');
      
    if (matchesError) {
      console.error('API route: Supabase matches error:', matchesError);
      return NextResponse.json(
        { error: 'Failed to fetch matches', details: matchesError.message },
        { status: 500 }
      );
    }
    
    console.log(`API route: Found ${teams.length} teams and ${matches.length} matches`);
    
    return NextResponse.json({ teams, matches });
  } catch (error) {
    console.error('API route: Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log('Creating match with date:', data.date);
    
    const match = await prisma.match.create({
      data,
      include: {
        homeTeam: true,
        awayTeam: true
      }
    });
    
    return NextResponse.json(match);
  } catch (error) {
    console.error('Error creating match:', error);
    return NextResponse.json(
      { error: 'Failed to create match' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // If the path ends with /clear, delete all matches
    if (path.endsWith('/clear')) {
      console.log('Clearing all matches');
      const result = await prisma.match.deleteMany({});
      return NextResponse.json({ message: 'All matches cleared', count: result.count });
    }
    
    // Otherwise, handle normal DELETE request for a specific match
    const { searchParams } = url;
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Match ID is required' },
        { status: 400 }
      );
    }
    
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

export async function PATCH(request: Request) {
  try {
    // This is a special endpoint to update match dates for specific dates
    // April 14 -> April 15
    // April 21 -> April 22
    
    // Update matches on April 14 to April 15
    const april14Matches = await prisma.match.findMany({
      where: {
        date: {
          gte: new Date('2024-04-14T00:00:00Z'),
          lt: new Date('2024-04-15T00:00:00Z')
        }
      }
    });
    
    for (const match of april14Matches) {
      await prisma.match.update({
        where: { id: match.id },
        data: { date: new Date('2024-04-15T18:00:00Z') }
      });
    }
    
    // Update matches on April 21 to April 22
    const april21Matches = await prisma.match.findMany({
      where: {
        date: {
          gte: new Date('2024-04-21T00:00:00Z'),
          lt: new Date('2024-04-22T00:00:00Z')
        }
      }
    });
    
    for (const match of april21Matches) {
      await prisma.match.update({
        where: { id: match.id },
        data: { date: new Date('2024-04-22T18:00:00Z') }
      });
    }
    
    return NextResponse.json({ message: 'Match dates updated successfully' });
  } catch (error) {
    console.error('Error updating match dates:', error);
    return NextResponse.json(
      { error: 'Failed to update match dates' },
      { status: 500 }
    );
  }
} 