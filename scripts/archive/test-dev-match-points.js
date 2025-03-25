#!/usr/bin/env node

/**
 * This script tests the MatchPoints table in the development environment
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

async function testMatchPointsTable() {
  console.log('Testing MatchPoints table in development environment...');
  console.log('Supabase URL:', supabaseUrl);
  
  try {
    // First, get a valid matchId from the Match table
    console.log('\nFetching a valid matchId from the Match table...');
    const { data: matchData, error: matchError } = await supabase
      .from('Match')
      .select('id, homeTeamId')
      .limit(1);
    
    if (matchError) {
      console.error('❌ Error fetching match data:', matchError);
      return false;
    }
    
    if (!matchData || matchData.length === 0) {
      console.error('❌ No matches found in the database');
      console.log('Creating a test match is not possible without the run_sql function');
      return false;
    }
    
    const validMatchId = matchData[0].id;
    const validTeamId = matchData[0].homeTeamId || 'test-team-id';
    
    console.log('✅ Found valid matchId:', validMatchId);
    console.log('✅ Using teamId:', validTeamId);
    
    // Try to insert a test record using the valid matchId
    console.log('\nAttempting to insert a test record to verify table structure...');
    
    const testRecord = {
      matchId: validMatchId,
      teamId: validTeamId,
      hole: 999,
      homePoints: 1,
      awayPoints: 0,
      points: 1
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('MatchPoints')
      .insert(testRecord)
      .select();
    
    if (insertError) {
      console.error('❌ Error inserting test record:', insertError);
      
      if (insertError.code === '42P01') {
        console.error('The MatchPoints table does not exist');
      } else if (insertError.code === '42703') {
        console.error('The table exists but is missing required columns');
      } else {
        console.error('Unexpected error with code:', insertError.code);
      }
      
      return false;
    }
    
    console.log('✅ Successfully inserted test record:', insertData);
    console.log('✅ MatchPoints table exists and has the correct structure');
    
    // Clean up the test record
    console.log('\nCleaning up test record...');
    const { error: deleteError } = await supabase
      .from('MatchPoints')
      .delete()
      .eq('hole', 999)
      .eq('matchId', validMatchId);
    
    if (deleteError) {
      console.error('❌ Error deleting test record:', deleteError);
    } else {
      console.log('✅ Successfully deleted test record');
    }
    
    return true;
  } catch (error) {
    console.error('Unexpected error:', error);
    return false;
  }
}

// Run the function
testMatchPointsTable()
  .then(success => {
    if (success) {
      console.log('\n✅ All MatchPoints table tests passed successfully!');
      process.exit(0);
    } else {
      console.error('\n❌ MatchPoints table tests failed');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('Unexpected error:', error);
    process.exit(1);
  });
