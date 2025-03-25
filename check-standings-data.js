#!/usr/bin/env node
/**
 * This script checks the data used for the standings page
 * 1. Checks match status for completed matches
 * 2. Checks match points for completed matches
 * 3. Checks match scores for completed matches
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

console.log(`Checking standings data in ${supabaseUrl}...`);

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  }
});

async function checkStandingsData() {
  try {
    // Get all teams
    console.log('Fetching teams...');
    const { data: teams, error: teamsError } = await supabase
      .from('Team')
      .select('id, name');
    
    if (teamsError) {
      console.error('Error fetching teams:', teamsError);
      return;
    }
    
    console.log(`Found ${teams.length} teams:`);
    teams.forEach(team => {
      console.log(`- ${team.name} (${team.id})`);
    });
    
    // Get all matches
    console.log('\nFetching matches...');
    const { data: matches, error: matchesError } = await supabase
      .from('Match')
      .select(`
        id, 
        date, 
        status, 
        homeTeamId, 
        awayTeamId,
        weekNumber,
        homeTeam:homeTeamId(name, id), 
        awayTeam:awayTeamId(name, id)
      `)
      .order('date', { ascending: true });
    
    if (matchesError) {
      console.error('Error fetching matches:', matchesError);
      return;
    }
    
    console.log(`Found ${matches.length} matches`);
    
    // Filter completed matches
    const completedMatches = matches.filter(match => 
      match.status === 'FINALIZED' || 
      match.status === 'COMPLETED' ||
      match.status?.toLowerCase() === 'finalized' ||
      match.status?.toLowerCase() === 'completed'
    );
    
    console.log(`Found ${completedMatches.length} completed matches:`);
    completedMatches.forEach(match => {
      console.log(`- Week ${match.weekNumber}: ${match.homeTeam.name} vs ${match.awayTeam.name} (${match.status})`);
    });
    
    // Get match points for completed matches
    console.log('\nFetching match points for completed matches...');
    const { data: matchPoints, error: matchPointsError } = await supabase
      .from('MatchPoints')
      .select(`
        id,
        matchId,
        teamId,
        hole,
        homePoints,
        awayPoints,
        points
      `)
      .is('hole', null)
      .in('matchId', completedMatches.map(m => m.id));
    
    if (matchPointsError) {
      console.error('Error fetching match points:', matchPointsError);
      return;
    }
    
    console.log(`Found ${matchPoints ? matchPoints.length : 0} total match points records`);
    
    // Check if each completed match has match points
    console.log('\nChecking match points for each completed match:');
    for (const match of completedMatches) {
      const matchPointsForMatch = matchPoints.filter(mp => mp.matchId === match.id);
      console.log(`- ${match.homeTeam.name} vs ${match.awayTeam.name}: ${matchPointsForMatch.length} match points records`);
      
      if (matchPointsForMatch.length > 0) {
        console.log(`  Home points: ${matchPointsForMatch[0].homePoints}, Away points: ${matchPointsForMatch[0].awayPoints}`);
      } else {
        console.log('  No match points found!');
      }
    }
    
    // Get match scores for completed matches
    console.log('\nFetching match scores for completed matches...');
    const { data: matchScores, error: matchScoresError } = await supabase
      .from('MatchScore')
      .select(`
        id,
        matchId,
        playerId,
        hole,
        score
      `)
      .in('matchId', completedMatches.map(m => m.id));
    
    if (matchScoresError) {
      console.error('Error fetching match scores:', matchScoresError);
      return;
    }
    
    console.log(`Found ${matchScores ? matchScores.length : 0} match score records`);
    
    // Check if each completed match has match scores
    console.log('\nChecking match scores for each completed match:');
    for (const match of completedMatches) {
      const scoresForMatch = matchScores.filter(ms => ms.matchId === match.id);
      console.log(`- ${match.homeTeam.name} vs ${match.awayTeam.name}: ${scoresForMatch.length} score records`);
      
      if (scoresForMatch.length === 0) {
        console.log('  No scores found!');
      }
    }
    
    // Get primary players
    console.log('\nFetching primary players...');
    const { data: players, error: playersError } = await supabase
      .from('Player')
      .select(`
        id,
        name,
        handicapIndex,
        teamId,
        playerType
      `)
      .eq('playerType', 'PRIMARY');
    
    if (playersError) {
      console.error('Error fetching players:', playersError);
      return;
    }
    
    console.log(`Found ${players ? players.length : 0} primary players`);
    
    // Check if each player has scores
    console.log('\nChecking scores for each player:');
    for (const player of players) {
      const scoresForPlayer = matchScores.filter(ms => ms.playerId === player.id);
      console.log(`- ${player.name}: ${scoresForPlayer.length} score records`);
    }
    
    console.log('\nStandings data check completed');
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the function
checkStandingsData()
  .then(() => {
    console.log('Check completed');
    process.exit(0);
  })
  .catch(error => {
    console.error('Error during check:', error);
    process.exit(1);
  });
