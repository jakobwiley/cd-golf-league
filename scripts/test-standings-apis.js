// Script to test the standings and player standings APIs
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
// No need to import fetch as it's available globally in newer Node.js versions

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testStandingsAPIs() {
  console.log('Starting API tests...');
  
  try {
    // 1. First, let's verify the match status in the database
    console.log('\n1. Checking match status in the database...');
    const { data: matches, error: matchError } = await supabase
      .from('Match')
      .select('id, status, homeTeamId, awayTeamId, homeTeam:homeTeamId(name), awayTeam:awayTeamId(name)')
      .order('weekNumber', { ascending: true });
    
    if (matchError) {
      throw new Error(`Error fetching matches: ${matchError.message}`);
    }
    
    console.log(`Found ${matches.length} matches in the database`);
    matches.forEach(match => {
      console.log(`- Match: ${match.homeTeam?.name} vs ${match.awayTeam?.name}, Status: ${match.status}`);
    });
    
    // 2. Check if any matches need to be updated to COMPLETED
    console.log('\n2. Checking for matches that need status updates...');
    const matchesToUpdate = matches.filter(match => 
      match.status?.toLowerCase() === 'finalized'
    );
    
    if (matchesToUpdate.length > 0) {
      console.log(`Found ${matchesToUpdate.length} matches with 'FINALIZED' status that need to be updated to 'COMPLETED'`);
      
      // Update these matches
      for (const match of matchesToUpdate) {
        console.log(`Updating match: ${match.homeTeam?.name} vs ${match.awayTeam?.name}`);
        
        const { error: updateError } = await supabase
          .from('Match')
          .update({ status: 'COMPLETED' })
          .eq('id', match.id);
        
        if (updateError) {
          console.error(`Error updating match ${match.id}: ${updateError.message}`);
        } else {
          console.log(`Successfully updated match ${match.id} to COMPLETED status`);
        }
      }
    } else {
      console.log('No matches need status updates');
    }
    
    // 3. Test the standings API
    console.log('\n3. Testing the standings API...');
    const standingsResponse = await fetch('http://localhost:3007/api/standings');
    
    if (!standingsResponse.ok) {
      throw new Error(`Standings API error: ${standingsResponse.status} ${standingsResponse.statusText}`);
    }
    
    const standingsData = await standingsResponse.json();
    console.log(`Standings API returned ${standingsData.length} teams`);
    
    // Log teams with completed matches
    const teamsWithMatches = standingsData.filter(team => team.matchesPlayed > 0);
    console.log(`Teams with completed matches: ${teamsWithMatches.length}`);
    
    teamsWithMatches.forEach(team => {
      console.log(`- ${team.teamName}: ${team.matchesWon}W-${team.matchesLost}L-${team.matchesTied}T, ${team.leaguePoints} points`);
    });
    
    // 4. Test the player standings API
    console.log('\n4. Testing the player standings API...');
    const playerStandingsResponse = await fetch('http://localhost:3007/api/player-standings');
    
    if (!playerStandingsResponse.ok) {
      throw new Error(`Player Standings API error: ${playerStandingsResponse.status} ${playerStandingsResponse.statusText}`);
    }
    
    const playerStandingsData = await playerStandingsResponse.json();
    console.log(`Player Standings API returned ${playerStandingsData.length} players`);
    
    // Find Murph's data
    const murphData = playerStandingsData.find(player => 
      player.playerName.toLowerCase().includes('murph')
    );
    
    if (murphData) {
      console.log('\nMurph\'s player data:');
      console.log(`- Matches played: ${murphData.matchesPlayed}`);
      console.log(`- Rounds played: ${murphData.roundsPlayed}`);
      console.log(`- Total gross score: ${murphData.totalGrossScore}`);
      console.log(`- Total net score: ${murphData.totalNetScore}`);
      console.log(`- Handicap index: ${murphData.handicapIndex}`);
    } else {
      console.log('Murph not found in player standings data');
    }
    
    console.log('\nAPI tests completed successfully');
    
  } catch (error) {
    console.error('Error during API tests:', error);
    process.exit(1);
  }
}

// Run the tests
testStandingsAPIs()
  .then(() => {
    console.log('All tests completed');
    process.exit(0);
  })
  .catch(error => {
    console.error('Test script failed:', error);
    process.exit(1);
  });
