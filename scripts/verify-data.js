const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Supabase connection details from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ylhwysupdkmbunaascky.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyTeams() {
  console.log('\n--- Teams ---');
  const { data, error } = await supabase.from('Team').select('*');
  
  if (error) {
    console.error('Error fetching teams:', error.message);
    return;
  }
  
  console.log(`Found ${data.length} teams`);
  data.forEach((team, index) => {
    if (index < 5) { // Show first 5 teams as a sample
      console.log(`  - ${team.id}: ${team.name}`);
    }
  });
  
  if (data.length > 5) {
    console.log(`  ... and ${data.length - 5} more teams`);
  }
}

async function verifyPlayers() {
  console.log('\n--- Players ---');
  const { data, error } = await supabase.from('Player').select('*');
  
  if (error) {
    console.error('Error fetching players:', error.message);
    return;
  }
  
  console.log(`Found ${data.length} players`);
  data.forEach((player, index) => {
    if (index < 5) { // Show first 5 players as a sample
      console.log(`  - ${player.name} (Team: ${player.teamId}, Handicap: ${player.handicapIndex})`);
    }
  });
  
  if (data.length > 5) {
    console.log(`  ... and ${data.length - 5} more players`);
  }
}

async function verifyMatches() {
  console.log('\n--- Matches ---');
  const { data, error } = await supabase.from('Match').select('*');
  
  if (error) {
    console.error('Error fetching matches:', error.message);
    return;
  }
  
  console.log(`Found ${data.length} matches`);
  data.forEach((match, index) => {
    if (index < 5) { // Show first 5 matches as a sample
      console.log(`  - Week ${match.weekNumber}: ${match.homeTeamId} vs ${match.awayTeamId} (Starting Hole: ${match.startingHole}, Status: ${match.status})`);
    }
  });
  
  if (data.length > 5) {
    console.log(`  ... and ${data.length - 5} more matches`);
  }
}

async function main() {
  console.log('Verifying Supabase database content...');
  console.log(`Supabase URL: ${supabaseUrl}`);
  
  if (!supabaseKey) {
    console.error('Error: Supabase key not found in environment variables');
    process.exit(1);
  }
  
  await verifyTeams();
  await verifyPlayers();
  await verifyMatches();
  
  console.log('\nVerification complete!');
  process.exit(0);
}

// Run the main function
main().catch(error => {
  console.error('Error in verification script:', error);
  process.exit(1);
}); 