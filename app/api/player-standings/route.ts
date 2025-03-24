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
      match.status?.toLowerCase() === 'completed' || 
      match.status?.toLowerCase() === 'finalized' ||
      match.status === 'COMPLETED'
    ) || [];
    const completedMatchIds = completedMatches.map(match => match.id);
    console.log(`Player Standings API: Found ${completedMatchIds.length} completed matches`);

    // If no completed matches, return empty array
    if (completedMatchIds.length === 0) {
      console.log('Player Standings API: No completed matches found');
      return NextResponse.json([]);
    }

    // Fetch match points data
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
        // If the table doesn't exist, return standings without match points
        if (matchPointsError.code === '42P01' || matchPointsError.message.includes('does not exist')) {
          console.warn('MatchPoints table does not exist, returning player standings without match points');
          // Return standings without match points
          return NextResponse.json(
            players.map(player => ({
              playerId: player.id,
              playerName: player.name,
              totalGrossScore: 0,
              totalNetScore: 0,
              matchesPlayed: 0,
              roundsPlayed: 0
            }))
          );
        }
        
        return NextResponse.json(
          { error: 'Failed to fetch match points from database', details: matchPointsError },
          { status: 500 }
        );
      }

      console.log(`Player Standings API: Successfully fetched ${matchPoints?.length || 0} match points`);

      // Group match points by matchId to handle multiple records
      const matchPointsByMatchId = {};
      if (matchPoints && matchPoints.length > 0) {
        // Group by matchId
        matchPoints.forEach(mp => {
          if (!matchPointsByMatchId[mp.matchId]) {
            matchPointsByMatchId[mp.matchId] = [];
          }
          matchPointsByMatchId[mp.matchId].push(mp);
        });
        
        // For each match, sort by createdAt and keep only the most recent
        Object.keys(matchPointsByMatchId).forEach(matchId => {
          matchPointsByMatchId[matchId].sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          
          // If the most recent record has 0-0 points, look for the most recent non-zero record
          const mostRecentRecord = matchPointsByMatchId[matchId][0];
          if (mostRecentRecord && mostRecentRecord.homePoints === 0 && mostRecentRecord.awayPoints === 0) {
            const nonZeroRecords = matchPointsByMatchId[matchId].filter(mp => 
              (mp.homePoints > 0 || mp.awayPoints > 0)
            );
            
            if (nonZeroRecords.length > 0) {
              // Replace the most recent record with the most recent non-zero record
              matchPointsByMatchId[matchId][0] = nonZeroRecords[0];
              console.log(`Player Standings API: Found non-zero record for match ${matchId}`);
            }
          }
        });
      }
    } catch (error) {
      console.error('Player Standings API: Error fetching match points:', error);
      return NextResponse.json(
        { error: 'Failed to fetch match points from database', details: error },
        { status: 500 }
      );
    }

    // Get all match scores
    console.log('Player Standings API: Fetching match scores');
    const { data: scores, error: scoresError } = await supabase
      .from('MatchScore')
      .select(`
        id,
        matchId,
        playerId,
        hole,
        score
      `)
      .in('matchId', completedMatchIds)
      .order('matchId', { ascending: true })
      .order('hole', { ascending: true });

    if (scoresError) {
      console.error('Player Standings API: Error fetching scores:', scoresError);
      return NextResponse.json(
        { error: 'Failed to fetch scores from database', details: scoresError },
        { status: 500 }
      );
    }

    console.log(`Player Standings API: Successfully fetched ${scores?.length || 0} scores`);

    // Calculate standings for each player
    const playerStandings: Record<string, PlayerStanding> = {};

    // Initialize standings for all primary players
    players.forEach(player => {
      playerStandings[player.id] = {
        playerId: player.id,
        playerName: player.name,
        totalGrossScore: 0,
        totalNetScore: 0,
        matchesPlayed: 0,
        roundsPlayed: 0
      };
    });

    // Only process scores from completed matches
    const completedScores = scores || [];

    console.log(`Player Standings API: Processing ${completedScores.length} scores from completed matches`);

    // Group scores by player and match
    const playerMatchScores: Record<string, Record<string, { 
      grossScores: number[], 
      holes: number[] 
    }>> = {};

    completedScores.forEach(score => {
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
        
        Object.values(matches).forEach(match => {
          // Only count rounds with at least 9 holes
          if (match.grossScores.length >= 9) {
            playerStanding.roundsPlayed++;
            
            // Calculate gross score
            const totalGrossScore = match.grossScores.reduce((sum, score) => sum + score, 0);
            playerStanding.totalGrossScore += totalGrossScore;
            
            // Calculate net score based on handicap
            // For simplicity, we'll just subtract the player's handicap from their gross score
            // In a real golf league, you might have a more complex calculation
            const handicap = playerHandicaps[playerId] || 0;
            const totalNetScore = totalGrossScore - Math.round(handicap * (match.grossScores.length / 18));
            playerStanding.totalNetScore += totalNetScore;
          }
        });
      }
    });

    // Convert standings object to array and sort by total net score (ascending)
    const standingsArray = Object.values(playerStandings)
      .filter(player => player.roundsPlayed > 0) // Only include players who have played at least one round
      .sort((a, b) => {
        // Sort by total net score (ascending)
        if (a.totalNetScore !== b.totalNetScore) {
          return a.totalNetScore - b.totalNetScore;
        }
        
        // If net scores are tied, sort by total gross score (ascending)
        if (a.totalGrossScore !== b.totalGrossScore) {
          return a.totalGrossScore - b.totalGrossScore;
        }
        
        // If still tied, sort by matches played (descending)
        if (a.matchesPlayed !== b.matchesPlayed) {
          return b.matchesPlayed - a.matchesPlayed;
        }
        
        // If still tied, sort alphabetically by name
        return a.playerName.localeCompare(b.playerName);
      });

    console.log(`Player Standings API: Returning standings for ${standingsArray.length} players`);
    return NextResponse.json(standingsArray);
  } catch (error) {
    console.error('Player Standings API: Error calculating player standings:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
