#!/usr/bin/env node

/**
 * This script checks if the MatchPoints table exists and has the correct structure
 * in the Supabase database.
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkMatchPointsTable() {
  console.log('Checking MatchPoints table...');
  console.log('Supabase URL:', supabaseUrl);
  
  try {
    // Check if the table exists
    const { data, error } = await supabase
      .from('MatchPoints')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Error querying MatchPoints table:', error);
      return false;
    }
    
    console.log('MatchPoints table exists');
    
    // Check table structure
    const { data: tableInfo, error: tableError } = await supabase
      .rpc('get_table_info', { table_name: 'MatchPoints' })
      .catch(() => {
        // If RPC fails, try a different approach
        return supabase
          .from('MatchPoints')
          .select('id, matchId, teamId, hole, homePoints, awayPoints, points, createdAt, updatedAt')
          .limit(0);
      });
    
    if (tableError) {
      console.error('Error getting table structure:', tableError);
      // Try to get column names from the data
      const columnNames = data && data.length > 0 ? Object.keys(data[0]) : [];
      console.log('Column names from data:', columnNames);
    } else if (tableInfo) {
      console.log('Table structure:', tableInfo);
    }
    
    // Try to insert a test record
    const testMatchId = 'test-match-id';
    const testTeamId = 'test-team-id';
    
    const { data: insertData, error: insertError } = await supabase
      .from('MatchPoints')
      .insert({
        matchId: testMatchId,
        teamId: testTeamId,
        hole: 999, // Use a high number to avoid conflicts
        homePoints: 0,
        awayPoints: 0,
        points: 0
      })
      .select();
    
    if (insertError) {
      console.error('Error inserting test record:', insertError);
      return false;
    }
    
    console.log('Successfully inserted test record:', insertData);
    
    // Delete the test record
    const { error: deleteError } = await supabase
      .from('MatchPoints')
      .delete()
      .eq('hole', 999)
      .eq('matchId', testMatchId);
    
    if (deleteError) {
      console.error('Error deleting test record:', deleteError);
    } else {
      console.log('Successfully deleted test record');
    }
    
    return true;
  } catch (error) {
    console.error('Unexpected error:', error);
    return false;
  }
}

// Run the function
checkMatchPointsTable()
  .then(success => {
    if (success) {
      console.log('MatchPoints table check completed successfully');
      process.exit(0);
    } else {
      console.error('MatchPoints table check failed');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('Unexpected error:', error);
    process.exit(1);
  });
