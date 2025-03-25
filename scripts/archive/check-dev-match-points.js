#!/usr/bin/env node

/**
 * This script checks if the MatchPoints table exists in the development Supabase database.
 * Usage: node check-dev-match-points.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Development database URL and key
const supabaseUrl = 'https://gyvaalhcjrwozinpilsw.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseKey) {
  console.error('Missing Supabase key in environment variables');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkMatchPointsTable() {
  console.log('Checking MatchPoints table in development database...');
  console.log('Supabase URL:', supabaseUrl);
  
  try {
    // Check if the table exists
    const { data, error } = await supabase
      .from('MatchPoints')
      .select('*')
      .limit(1);
    
    if (error) {
      if (error.code === '42P01') {
        console.error('❌ MatchPoints table does not exist in the development database');
        console.log('\nTo create the table, run the SQL script in the Supabase dashboard:');
        console.log('1. Go to https://app.supabase.com/project/gyvaalhcjrwozinpilsw');
        console.log('2. Navigate to the SQL Editor');
        console.log('3. Copy and paste the contents of create-match-points-for-dashboard.sql');
        console.log('4. Run the SQL');
      } else {
        console.error('❌ Error querying MatchPoints table:', error);
      }
      return false;
    }
    
    console.log('✅ MatchPoints table exists in the development database');
    
    // Try to insert a test record
    const testId = `test-${Date.now()}`;
    const testMatchId = 'test-match-id';
    const testTeamId = 'test-team-id';
    
    const { data: insertData, error: insertError } = await supabase
      .from('MatchPoints')
      .insert({
        id: testId,
        matchId: testMatchId,
        teamId: testTeamId,
        hole: 999, // Use a high number to avoid conflicts
        homePoints: 0,
        awayPoints: 0,
        points: 0
      })
      .select();
    
    if (insertError) {
      console.error('❌ Error inserting test record:', insertError);
      return false;
    }
    
    console.log('✅ Successfully inserted test record');
    
    // Delete the test record
    const { error: deleteError } = await supabase
      .from('MatchPoints')
      .delete()
      .eq('id', testId);
    
    if (deleteError) {
      console.error('❌ Error deleting test record:', deleteError);
    } else {
      console.log('✅ Successfully deleted test record');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return false;
  }
}

// Run the function
checkMatchPointsTable()
  .then(success => {
    if (success) {
      console.log('\n✅ MatchPoints table check completed successfully');
      process.exit(0);
    } else {
      console.error('\n❌ MatchPoints table check failed');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  });
