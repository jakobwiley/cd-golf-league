#!/usr/bin/env node

/**
 * This script tests the match-points API by simulating a request to save match points
 * It uses the development database (gyvaalhcjrwozinpilsw) configured in .env.local
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function testMatchPointsApi() {
  console.log('Testing match-points API with the development database...');
  console.log('Supabase URL:', supabaseUrl);
  
  try {
    // Step 1: Get a valid match from the database
    console.log('\n1. Fetching a valid match from the database...');
    const { data: matchData, error: matchError } = await supabase
      .from('Match')
      .select('id, homeTeamId, awayTeamId')
      .limit(1);
    
    if (matchError) {
      console.error('❌ Error fetching match data:', matchError);
      return false;
    }
    
    if (!matchData || matchData.length === 0) {
      console.error('❌ No matches found in the database');
      return false;
    }
    
    const match = matchData[0];
    console.log('✅ Found valid match:', match);
    
    // Step 2: Create test match points data
    console.log('\n2. Creating test match points data...');
    const matchPointsData = {
      matchId: match.id,
      homePoints: [1, 0, 1, 0, 1, 0, 1, 0, 1],  // 9 holes
      awayPoints: [0, 1, 0, 1, 0, 1, 0, 1, 0],  // 9 holes
      teamId: match.homeTeamId
    };
    
    console.log('Test match points data:', matchPointsData);
    
    // Step 3: Directly insert match points using Supabase client
    console.log('\n3. Inserting match points directly using Supabase client...');
    
    // First, clean up any existing test data
    const { error: deleteError } = await supabase
      .from('MatchPoints')
      .delete()
      .eq('matchId', match.id);
    
    if (deleteError) {
      console.error('❌ Error cleaning up existing data:', deleteError);
      // Continue anyway
    }
    
    // Insert match points for each hole
    const matchPointsRecords = matchPointsData.homePoints.map((homePoints, index) => ({
      matchId: match.id,
      teamId: match.homeTeamId,
      hole: index + 1,
      homePoints: homePoints,
      awayPoints: matchPointsData.awayPoints[index],
      points: homePoints  // Using homePoints as the points value
    }));
    
    const { data: insertData, error: insertError } = await supabase
      .from('MatchPoints')
      .insert(matchPointsRecords)
      .select();
    
    if (insertError) {
      console.error('❌ Error inserting match points:', insertError);
      return false;
    }
    
    console.log(`✅ Successfully inserted ${insertData.length} match points records`);
    
    // Step 4: Retrieve the inserted match points
    console.log('\n4. Retrieving inserted match points...');
    const { data: retrieveData, error: retrieveError } = await supabase
      .from('MatchPoints')
      .select('*')
      .eq('matchId', match.id)
      .order('hole', { ascending: true });
    
    if (retrieveError) {
      console.error('❌ Error retrieving match points:', retrieveError);
      return false;
    }
    
    console.log(`✅ Successfully retrieved ${retrieveData.length} match points records:`);
    retrieveData.forEach(record => {
      console.log(`  Hole ${record.hole}: Home ${record.homePoints} - Away ${record.awayPoints}`);
    });
    
    // Step 5: Clean up the test data
    console.log('\n5. Cleaning up test data...');
    const { error: finalDeleteError } = await supabase
      .from('MatchPoints')
      .delete()
      .eq('matchId', match.id);
    
    if (finalDeleteError) {
      console.error('❌ Error cleaning up test data:', finalDeleteError);
      return false;
    }
    
    console.log('✅ Successfully cleaned up test data');
    
    return true;
  } catch (error) {
    console.error('Unexpected error:', error);
    return false;
  }
}

// Run the function
testMatchPointsApi()
  .then(success => {
    if (success) {
      console.log('\n✅ Match points API test completed successfully!');
      process.exit(0);
    } else {
      console.error('\n❌ Match points API test failed');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('Unexpected error:', error);
    process.exit(1);
  });
