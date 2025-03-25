/**
 * Script to find a valid match ID from the database
 * 
 * This script queries the Match table to find a valid match ID that can be used
 * for testing the match-points API.
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

console.log('Connecting to Supabase at:', supabaseUrl);
const supabase = createClient(supabaseUrl, supabaseKey);

async function findValidMatchId() {
  try {
    console.log('Querying the Match table...');
    const { data: matches, error } = await supabase
      .from('Match')
      .select('id, homeTeamId, awayTeamId, date, status')
      .order('date', { ascending: false })
      .limit(5);

    if (error) {
      console.error('Error querying matches:', error);
      return null;
    }

    if (!matches || matches.length === 0) {
      console.log('No matches found in the database');
      return null;
    }

    console.log('Found matches:');
    matches.forEach((match, index) => {
      console.log(`${index + 1}. Match ID: ${match.id}`);
      console.log(`   Home Team ID: ${match.homeTeamId}`);
      console.log(`   Away Team ID: ${match.awayTeamId}`);
      console.log(`   Date: ${match.date}`);
      console.log(`   Status: ${match.status}`);
      console.log('---');
    });

    return matches[0].id; // Return the most recent match ID
  } catch (error) {
    console.error('Unexpected error:', error);
    return null;
  }
}

// Execute the function
findValidMatchId()
  .then(matchId => {
    if (matchId) {
      console.log('\nValid Match ID for testing:', matchId);
      console.log('\nRun the test script with this ID:');
      console.log(`node test-local-match-points.js http://localhost:3007 ${matchId}`);
    } else {
      console.log('Could not find a valid match ID');
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
