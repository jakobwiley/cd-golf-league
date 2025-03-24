import { NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'

interface PlayerStanding {
  playerId: string;
  playerName: string;
  totalGrossScore: number;
  totalNetScore: number;
  matchesPlayed: number;
  roundsPlayed: number;
}

// Helper function to process player standings with or without match points
function processPlayerStandings(players: any[], completedMatches: any[], scores: any[], matchPoints: any[]) {
  // Initialize player standings
  const playerStandings: Record<string, any> = {};
  
  players.forEach(player => {
    playerStandings[player.id] = {
      playerId: player.id,
      playerName: player.name,
      handicapIndex: player.handicapIndex || 0,
      totalGrossScore: 0,
      totalNetScore: 0,
      matchesPlayed: 0,
      roundsPlayed: 0,
      averageGrossScore: 0,
      averageNetScore: 0,
      teamId: player.teamId,
      scores: []
    };
  });
  
  // Process player scores
  if (scores && scores.length > 0) {
    // Group scores by player and match
    const playerMatchScores: Record<string, Record<string, { 
      grossScores: number[], 
      holes: number[] 
    }>> = {};

    scores.forEach(score => {
      // Skip if player is not in our primary players list
      if (!playerStandings[score.playerId]) {
        return;
      }

      // Initialize player's match records if needed
      if (!playerMatchScores[score.playerId]) {
        playerMatchScores[score.playerId] = {};
      }

      // Initialize match record for this player if needed
      if (!playerMatchScores[score.playerId][score.matchId]) {
        playerMatchScores[score.playerId][score.matchId] = {
          grossScores: [],
          holes: []
        };
      }

      // Add score to the player's match record
      playerMatchScores[score.playerId][score.matchId].grossScores.push(score.score || 0);
      playerMatchScores[score.playerId][score.matchId].holes.push(score.hole || 0);
    });

    // Get player handicaps
    const playerHandicaps: Record<string, number> = {};
    players.forEach(player => {
      playerHandicaps[player.id] = player.handicapIndex || 0;
    });

    // Calculate totals for each player
    Object.entries(playerMatchScores).forEach(([playerId, matches]) => {
      const playerStanding = playerStandings[playerId];
      if (playerStanding) {
        playerStanding.matchesPlayed = Object.keys(matches).length;
        
        Object.entries(matches).forEach(([matchId, matchData]) => {
          // Only count rounds with at least 9 holes
          if (matchData.grossScores.length >= 9) {
            playerStanding.roundsPlayed++;
            
            // Calculate gross score
            const totalGrossScore = matchData.grossScores.reduce((sum, score) => sum + score, 0);
            playerStanding.totalGrossScore += totalGrossScore;
            
            // Calculate net score based on handicap
            const handicap = playerHandicaps[playerId] || 0;
            const totalNetScore = totalGrossScore - Math.round(handicap * (matchData.grossScores.length / 18));
            playerStanding.totalNetScore += totalNetScore;
          }
        });
      }
    });
  }
  
  // Calculate averages
  Object.values(playerStandings).forEach((player: any) => {
    if (player.roundsPlayed > 0) {
      player.averageGrossScore = player.totalGrossScore / player.roundsPlayed;
      player.averageNetScore = player.totalNetScore / player.roundsPlayed;
    }
  });
  
  // Convert to array and sort by averageNetScore
  const playerStandingsArray = Object.values(playerStandings)
    .filter((player: any) => player.roundsPlayed > 0) // Only include players who have played
    .sort((a: any, b: any) => {
      // Sort by average net score (ascending)
      return a.averageNetScore - b.averageNetScore;
    });
  
  console.log(`Player Standings API: Returning standings for ${playerStandingsArray.length} players`);
  return NextResponse.json(playerStandingsArray);
}

export async function GET() {
  try {
    console.log('Player Standings API: Starting request');
    
    if (!supabase) {
      console.error('Player Standings API: Supabase client not initialized');
      throw new Error('Supabase client not initialized');
    }

    // Get all PRIMARY players first
    console.log('Player Standings API: Fetching primary players');
    const { data: players, error: playersError } = await supabase
      .from('Player')
      .select(`
        id,
        name,
        handicapIndex,
        teamId,
        playerType
      `)
      .eq('playerType', 'PRIMARY')
      .order('name', { ascending: true });

    if (playersError) {
      console.error('Player Standings API: Error fetching players:', playersError);
      return NextResponse.json(
        { error: 'Failed to fetch players from database', details: playersError },
        { status: 500 }
      );
    }

    if (!players || players.length === 0) {
      console.log('Player Standings API: No primary players found');
      return NextResponse.json([]);
    }

    console.log(`Player Standings API: Successfully fetched ${players.length} primary players`);

    // Get all matches to determine which ones are completed
    console.log('Player Standings API: Fetching matches');
    const { data: matches, error: matchesError } = await supabase
      .from('Match')
      .select(`
        id,
        status
      `);

    if (matchesError) {
      console.error('Player Standings API: Error fetching matches:', matchesError);
      return NextResponse.json(
        { error: 'Failed to fetch matches from database', details: matchesError },
        { status: 500 }
      );
    }

    // Filter completed matches using the same criteria as the standings API
    const completedMatches = matches?.filter(match => 
      match.status === 'FINALIZED' || 
      match.status === 'COMPLETED' ||
      match.status?.toLowerCase() === 'finalized' ||
      match.status?.toLowerCase() === 'completed'
    ) || [];
    const completedMatchIds = completedMatches.map(match => match.id);
    console.log(`Player Standings API: Found ${completedMatchIds.length} completed matches`);

    // If no completed matches, return empty array
    if (completedMatchIds.length === 0) {
      console.log('Player Standings API: No completed matches found');
      return NextResponse.json([]);
    }

    // Get match points for all completed matches
    console.log('Player Standings API: Fetching match points');
    try {
      const { data: matchPoints, error: matchPointsError } = await supabase
        .from('MatchPoints')
        .select(`
          id,
          matchId,
          teamId,
          hole,
          homePoints,
          awayPoints,
          createdAt
        `)
        .is('hole', null)
        .in('matchId', completedMatches.map(m => m.id));

      if (matchPointsError) {
        console.error('Player Standings API: Error fetching match points:', matchPointsError);
        // If the table doesn't exist, continue with empty match points
        if (matchPointsError.code === '42P01' || matchPointsError.message.includes('does not exist')) {
          console.warn('MatchPoints table does not exist, continuing with empty match points');
          // Continue with empty match points array
          return processPlayerStandings(players, completedMatches, [], []);
        }
        return NextResponse.json(
          { error: 'Failed to fetch match points from database', details: matchPointsError },
          { status: 500 }
        );
      }

      // Get all match scores
      console.log(`Player Standings API: Fetching scores for ${completedMatchIds.length} completed matches`);
      const { data: scores, error: scoresError } = await supabase
        .from('MatchScore')
        .select(`
          id,
          playerId,
          matchId,
          hole,
          score,
          createdAt
        `)
        .in('matchId', completedMatchIds);

      if (scoresError) {
        console.error('Player Standings API: Error fetching scores:', scoresError);
        return NextResponse.json(
          { error: 'Failed to fetch scores from database', details: scoresError },
          { status: 500 }
        );
      }

      console.log(`Player Standings API: Successfully fetched ${scores?.length || 0} scores`);

      // Calculate standings for each player
      return processPlayerStandings(players || [], completedMatches, scores || [], matchPoints || []);
    } catch (error) {
      console.error('Player Standings API: Error:', error);
      return NextResponse.json(
        { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Player Standings API: Error calculating player standings:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
