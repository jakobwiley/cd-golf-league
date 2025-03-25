#!/usr/bin/env node

/**
 * This script tests the match-points API endpoint by making HTTP requests
 */

const axios = require('axios');
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const apiBaseUrl = 'http://localhost:3007';

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function testApiEndpoint() {
  console.log('Testing match-points API endpoint...');
  console.log('API Base URL:', apiBaseUrl);
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
    
    // Step 2: Clean up any existing match points
    console.log('\n2. Cleaning up any existing match points...');
    const { error: deleteError } = await supabase
      .from('MatchPoints')
      .delete()
      .eq('matchId', match.id);
    
    if (deleteError) {
      console.error('❌ Error cleaning up existing data:', deleteError);
      // Continue anyway
    } else {
      console.log('✅ Successfully cleaned up existing data');
    }
    
    // Step 3: Create test match points data
    console.log('\n3. Creating test match points data...');
    const matchPointsData = {
      matchId: match.id,
      totalPoints: {
        home: 5,
        away: 4
      },
      holePoints: {
        "1": { home: 1, away: 0 },
        "2": { home: 0, away: 1 },
        "3": { home: 1, away: 0 },
        "4": { home: 0, away: 1 },
        "5": { home: 1, away: 0 },
        "6": { home: 0, away: 1 },
        "7": { home: 1, away: 0 },
        "8": { home: 0, away: 1 },
        "9": { home: 1, away: 0 }
      }
    };
    
    console.log('Test match points data:', JSON.stringify(matchPointsData, null, 2));
    
    // Step 4: Send POST request to the API endpoint
    console.log('\n4. Sending POST request to the API endpoint...');
    try {
      const response = await axios.post(
        `${apiBaseUrl}/api/match-points`,
        matchPointsData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('✅ API response:', response.status, response.data);
    } catch (apiError) {
      console.error('❌ API error:', apiError.response?.status, apiError.response?.data || apiError.message);
      return false;
    }
    
    // Step 5: Verify the data was saved by making a GET request
    console.log('\n5. Verifying data was saved with GET request...');
    try {
      const getResponse = await axios.get(
        `${apiBaseUrl}/api/match-points?matchId=${match.id}`,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('✅ GET response status:', getResponse.status);
      console.log('✅ Retrieved match points:', getResponse.data.data.length);
      
      // Log the first few records
      const records = getResponse.data.data;
      records.slice(0, 3).forEach(record => {
        console.log(`  ${record.hole === null ? 'Total' : `Hole ${record.hole}`}: Home ${record.homePoints} - Away ${record.awayPoints}`);
      });
      
      if (records.length > 3) {
        console.log(`  ... and ${records.length - 3} more records`);
      }
    } catch (getError) {
      console.error('❌ GET error:', getError.response?.status, getError.response?.data || getError.message);
      return false;
    }
    
    // Step 6: Clean up the test data
    console.log('\n6. Cleaning up test data...');
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
testApiEndpoint()
  .then(success => {
    if (success) {
      console.log('\n✅ API endpoint test completed successfully!');
      process.exit(0);
    } else {
      console.error('\n❌ API endpoint test failed');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('Unexpected error:', error);
    process.exit(1);
  });
