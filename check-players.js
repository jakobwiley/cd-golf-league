// Script to check if specific players exist in the database
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkPlayers() {
  console.log('Checking for players named Jake and Brew...');
  
  const { data: players, error } = await supabase
    .from('Player')
    .select('id, name, teamId')
    .or('name.ilike.%Jake%,name.ilike.%Brew%');
  
  if (error) {
    console.error('Error checking players:', error);
    return;
  }
  
  console.log('Found players:', players);
  
  if (players.length === 0) {
    console.log('No players found with names containing Jake or Brew');
    
    // List all players to help identify the correct ones
    console.log('\nListing all players:');
    const { data: allPlayers, error: allPlayersError } = await supabase
      .from('Player')
      .select('id, name, teamId')
      .order('name');
    
    if (allPlayersError) {
      console.error('Error listing all players:', allPlayersError);
    } else {
      console.log(allPlayers);
    }
  }
  
  // Check the match to see which players should be associated with it
  console.log('\nChecking match details:');
  const matchId = 'd0b585dd-09e4-4171-b133-2f5376bcc59a';
  const { data: match, error: matchError } = await supabase
    .from('Match')
    .select(`
      id,
      homeTeamId,
      awayTeamId,
      homeTeam:homeTeamId (id, name),
      awayTeam:awayTeamId (id, name)
    `)
    .eq('id', matchId)
    .single();
  
  if (matchError) {
    console.error('Error checking match:', matchError);
  } else {
    console.log('Match details:', match);
    
    // Get players from both teams
    const { data: teamPlayers, error: teamPlayersError } = await supabase
      .from('Player')
      .select('id, name, teamId')
      .in('teamId', [match.homeTeamId, match.awayTeamId]);
    
    if (teamPlayersError) {
      console.error('Error getting team players:', teamPlayersError);
    } else {
      console.log('\nPlayers from both teams:');
      console.log(teamPlayers);
    }
  }
}

checkPlayers()
  .catch(err => {
    console.error('Unhandled error:', err);
  })
  .finally(() => {
    console.log('Check completed');
  });
