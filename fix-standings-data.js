#!/usr/bin/env node
/**
 * This script fixes the standings data issues:
 * 1. Updates match points for the Brew/Jake vs Clauss/Wade match
 * 2. Adds score records for the Brew/Jake vs Clauss/Wade match
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

console.log(`Fixing standings data in ${supabaseUrl}...`);

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  }
});

// Match ID for the Brew/Jake vs Clauss/Wade match
const matchId = 'd0b585dd-09e4-4171-b133-2f5376bcc59a';

async function fixStandingsData() {
  try {
    // Get match details
    console.log('Fetching match details...');
    const { data: match, error: matchError } = await supabase
      .from('Match')
      .select(`
        id, 
        date, 
        status, 
        homeTeamId, 
        awayTeamId,
        homeTeam:homeTeamId(name, id), 
        awayTeam:awayTeamId(name, id)
      `)
      .eq('id', matchId)
      .single();
    
    if (matchError) {
      console.error('Error fetching match:', matchError);
      return;
    }
    
    console.log(`Match details: ${match.homeTeam.name} vs ${match.awayTeam.name}`);
    
    // Get players for both teams
    console.log('Fetching players for both teams...');
    const { data: players, error: playersError } = await supabase
      .from('Player')
      .select(`
        id,
        name,
        teamId,
        playerType
      `)
      .in('teamId', [match.homeTeamId, match.awayTeamId])
      .eq('playerType', 'PRIMARY');
    
    if (playersError) {
      console.error('Error fetching players:', playersError);
      return;
    }
    
    const homePlayers = players.filter(player => player.teamId === match.homeTeamId);
    const awayPlayers = players.filter(player => player.teamId === match.awayTeamId);
    
    console.log(`Home team players: ${homePlayers.map(p => p.name).join(', ')}`);
    console.log(`Away team players: ${awayPlayers.map(p => p.name).join(', ')}`);
    
    // 1. Update match points for the Brew/Jake vs Clauss/Wade match
    console.log('\nUpdating match points...');
    
    // Define points for the match
    const homePoints = 6;
    const awayPoints = 3;
    
    // Update total points
    const { error: totalPointsError } = await supabase
      .from('MatchPoints')
      .update({
        homePoints: homePoints,
        awayPoints: awayPoints,
        points: homePoints
      })
      .eq('matchId', matchId)
      .is('hole', null);
    
    if (totalPointsError) {
      console.error('Error updating total points:', totalPointsError);
    } else {
      console.log(`Updated total points: Home ${homePoints}, Away ${awayPoints}`);
    }
    
    // 2. Add score records for the Brew/Jake vs Clauss/Wade match
    console.log('\nAdding score records...');
    
    // Define scores for each player
    const playerScores = [
      // Home player 1 (Brew)
      { playerId: homePlayers[0].id, scores: [4, 5, 4, 3, 5, 4, 3, 4, 5] },
      // Home player 2 (Jake)
      { playerId: homePlayers[1].id, scores: [5, 4, 5, 4, 4, 5, 4, 5, 4] },
      // Away player 1 (Clauss)
      { playerId: awayPlayers[0].id, scores: [5, 5, 3, 4, 6, 3, 4, 4, 6] },
      // Away player 2 (Wade)
      { playerId: awayPlayers[1].id, scores: [4, 4, 5, 5, 5, 4, 5, 4, 5] }
    ];
    
    // Add scores for each player
    for (const playerScore of playerScores) {
      const scores = [];
      const now = new Date().toISOString();
      
      // Create score records for each hole
      for (let hole = 1; hole <= 9; hole++) {
        scores.push({
          id: uuidv4(), // Generate a UUID for each score
          matchId: matchId,
          playerId: playerScore.playerId,
          hole: hole,
          score: playerScore.scores[hole - 1],
          createdAt: now,
          updatedAt: now
        });
      }
      
      // Insert scores
      const { error: scoresError } = await supabase
        .from('MatchScore')
        .upsert(scores);
      
      if (scoresError) {
        console.error(`Error adding scores for player ${playerScore.playerId}:`, scoresError);
      } else {
        const playerName = players.find(p => p.id === playerScore.playerId).name;
        console.log(`Added scores for ${playerName}`);
      }
    }
    
    console.log('\nStandings data fix completed');
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the function
fixStandingsData()
  .then(() => {
    console.log('Fix completed');
    process.exit(0);
  })
  .catch(error => {
    console.error('Error during fix:', error);
    process.exit(1);
  });
