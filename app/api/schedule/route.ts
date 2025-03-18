import { NextResponse } from 'next/server'
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
    
    // Get matches first
    const { data: matches, error: matchesError } = await supabase
      .from('Match')
      .select('*')
      .order('weekNumber')
      .order('startingHole');
      
    if (matchesError) {
      console.error('API route: Supabase matches error:', matchesError);
      return NextResponse.json(
        { error: 'Failed to fetch matches', details: matchesError.message },
        { status: 500 }
      );
    }

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

    // Add team data to matches
    const matchesWithTeams = matches.map(match => {
      const homeTeam = teams.find(team => team.id === match.homeTeamId);
      const awayTeam = teams.find(team => team.id === match.awayTeamId);
      return {
        ...match,
        homeTeam,
        awayTeam
      };
    });
    
    console.log(`API route: Found ${teams.length} teams and ${matches.length} matches`);
    
    return NextResponse.json({
      teams,
      matches: matchesWithTeams
    });
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
    
    // Validate input data
    const validatedData = scheduleSchema.parse(data);
    
    // Insert into Supabase
    const { data: match, error } = await supabase
      .from('Match')
      .insert([validatedData])
      .select()
      .single();
      
    if (error) {
      console.error('Error creating match:', error);
      return NextResponse.json(
        { error: 'Failed to create match', details: error.message },
        { status: 500 }
      );
    }

    // Get teams for the new match
    const { data: teams, error: teamsError } = await supabase
      .from('Team')
      .select('*')
      .in('id', [match.homeTeamId, match.awayTeamId]);

    if (teamsError) {
      console.error('Error fetching teams for new match:', teamsError);
      return NextResponse.json(match);
    }

    // Add team data to match
    const homeTeam = teams.find(team => team.id === match.homeTeamId);
    const awayTeam = teams.find(team => team.id === match.awayTeamId);
    const matchWithTeams = {
      ...match,
      homeTeam,
      awayTeam
    };
    
    return NextResponse.json(matchWithTeams);
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
      const { error } = await supabase
        .from('Match')
        .delete()
        .neq('id', ''); // Delete all matches
        
      if (error) {
        console.error('Error clearing matches:', error);
        return NextResponse.json(
          { error: 'Failed to clear matches', details: error.message },
          { status: 500 }
        );
      }
      
      return NextResponse.json({ message: 'All matches cleared' });
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
    
    const { error } = await supabase
      .from('Match')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Error deleting match:', error);
      return NextResponse.json(
        { error: 'Failed to delete match', details: error.message },
        { status: 500 }
      );
    }
    
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
    const { data: april14Matches, error: april14Error } = await supabase
      .from('Match')
      .select('id')
      .gte('date', '2024-04-14T00:00:00Z')
      .lt('date', '2024-04-15T00:00:00Z');
      
    if (april14Error) {
      console.error('Error finding April 14 matches:', april14Error);
      return NextResponse.json(
        { error: 'Failed to find April 14 matches', details: april14Error.message },
        { status: 500 }
      );
    }
    
    for (const match of april14Matches || []) {
      const { error } = await supabase
        .from('Match')
        .update({ date: '2024-04-15T18:00:00Z' })
        .eq('id', match.id);
        
      if (error) {
        console.error('Error updating April 14 match:', error);
      }
    }
    
    // Update matches on April 21 to April 22
    const { data: april21Matches, error: april21Error } = await supabase
      .from('Match')
      .select('id')
      .gte('date', '2024-04-21T00:00:00Z')
      .lt('date', '2024-04-22T00:00:00Z');
      
    if (april21Error) {
      console.error('Error finding April 21 matches:', april21Error);
      return NextResponse.json(
        { error: 'Failed to find April 21 matches', details: april21Error.message },
        { status: 500 }
      );
    }
    
    for (const match of april21Matches || []) {
      const { error } = await supabase
        .from('Match')
        .update({ date: '2024-04-22T18:00:00Z' })
        .eq('id', match.id);
        
      if (error) {
        console.error('Error updating April 21 match:', error);
      }
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