import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

export async function GET() {
  try {
    console.log('Test API: Checking Supabase connection and data...');
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    
    // Test matches query
    const { data: matches, error: matchesError } = await supabase
      .from('Match')
      .select('*');
      
    if (matchesError) {
      console.error('Test API: Supabase matches error:', matchesError);
      return NextResponse.json(
        { error: 'Failed to fetch matches', details: matchesError.message },
        { status: 500 }
      );
    }

    // Test teams query
    const { data: teams, error: teamsError } = await supabase
      .from('Team')
      .select('*');
      
    if (teamsError) {
      console.error('Test API: Supabase teams error:', teamsError);
      return NextResponse.json(
        { error: 'Failed to fetch teams', details: teamsError.message },
        { status: 500 }
      );
    }

    // Test match players query
    const { data: matchPlayers, error: matchPlayersError } = await supabase
      .from('MatchPlayer')
      .select('*');
      
    if (matchPlayersError) {
      console.error('Test API: Supabase match players error:', matchPlayersError);
      return NextResponse.json(
        { error: 'Failed to fetch match players', details: matchPlayersError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Database connection successful',
      matchCount: matches?.length || 0,
      teamCount: teams?.length || 0,
      matchPlayerCount: matchPlayers?.length || 0,
      matches,
      teams,
      matchPlayers
    });
  } catch (error) {
    console.error('Test API: Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred', details: error },
      { status: 500 }
    );
  }
}
