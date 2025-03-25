#!/usr/bin/env node

/**
 * This script verifies that the MatchPoints table exists in the Supabase database
 * and has the correct structure. It's designed to be run after a deployment to ensure
 * that the table was not deleted during the deployment process.
 * 
 * Usage: node verify-match-points-table.js
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL');
  process.exit(1);
}

if (!supabaseKey) {
  console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

console.log(`Verifying MatchPoints table in database: ${supabaseUrl}`);

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Required columns for the MatchPoints table
const requiredColumns = [
  { name: 'id', type: 'text' },
  { name: 'matchId', type: 'text' },
  { name: 'teamId', type: 'text' },
  { name: 'hole', type: 'integer' },
  { name: 'homePoints', type: 'numeric' },
  { name: 'awayPoints', type: 'numeric' },
  { name: 'points', type: 'numeric' },
  { name: 'createdAt', type: 'timestamp with time zone' },
  { name: 'updatedAt', type: 'timestamp with time zone' }
];

async function verifyMatchPointsTable() {
  let success = true;
  
  try {
    // Step 1: Check if the table exists
    console.log('\n1. Checking if MatchPoints table exists...');
    
    try {
      const { data, error } = await supabase
        .from('MatchPoints')
        .select('*')
        .limit(1);
      
      if (error) {
        if (error.code === '42P01') { // Relation does not exist
          console.error('❌ MatchPoints table does not exist');
          console.log('\nTo create the table, run the SQL script in the Supabase dashboard:');
          console.log('1. Go to https://app.supabase.com/project/<project-id>');
          console.log('2. Navigate to the SQL Editor');
          console.log('3. Copy and paste the contents of create-match-points-table.sql');
          console.log('4. Run the SQL');
          return false;
        } else {
          console.error('❌ Error querying MatchPoints table:', error);
          return false;
        }
      }
      
      console.log('✅ MatchPoints table exists');
    } catch (error) {
      console.error('❌ Error checking table existence:', error);
      return false;
    }
    
    // Step 2: Verify table structure
    console.log('\n2. Verifying MatchPoints table structure...');
    
    // Get table information from Postgres information_schema
    const { data: columns, error: columnsError } = await supabase
      .rpc('get_table_columns', { table_name: 'MatchPoints' });
    
    if (columnsError) {
      // If the RPC function doesn't exist, try a direct query to information_schema
      const { data: infoSchemaColumns, error: infoSchemaError } = await supabase
        .from('information_schema.columns')
        .select('column_name, data_type, is_nullable')
        .eq('table_name', 'MatchPoints')
        .eq('table_schema', 'public');
      
      if (infoSchemaError) {
        console.error('❌ Error getting table structure:', infoSchemaError);
        console.log('Unable to verify table structure. Please check manually.');
        success = false;
      } else if (infoSchemaColumns && infoSchemaColumns.length > 0) {
        // Verify each required column exists
        for (const requiredColumn of requiredColumns) {
          const column = infoSchemaColumns.find(c => 
            c.column_name.toLowerCase() === requiredColumn.name.toLowerCase());
          
          if (!column) {
            console.error(`❌ Missing column: ${requiredColumn.name}`);
            success = false;
          } else {
            console.log(`✅ Column exists: ${requiredColumn.name}`);
          }
        }
      } else {
        console.log('No columns found. Unable to verify table structure.');
        success = false;
      }
    } else if (columns && columns.length > 0) {
      // Verify each required column exists
      for (const requiredColumn of requiredColumns) {
        const column = columns.find(c => 
          c.column_name.toLowerCase() === requiredColumn.name.toLowerCase());
        
        if (!column) {
          console.error(`❌ Missing column: ${requiredColumn.name}`);
          success = false;
        } else {
          console.log(`✅ Column exists: ${requiredColumn.name}`);
        }
      }
    } else {
      console.log('No columns found. Unable to verify table structure.');
      success = false;
    }
    
    // Step 3: Test inserting and retrieving a record
    console.log('\n3. Testing basic CRUD operations...');
    
    // Generate a unique test ID
    const testId = `test-${Date.now()}`;
    const testMatchId = 'c0143847-3724-4aab-a7c1-8ccce93ab92f'; // Use a valid match ID
    
    // Insert a test record
    const { data: insertData, error: insertError } = await supabase
      .from('MatchPoints')
      .insert([
        {
          id: testId,
          matchId: testMatchId,
          teamId: 'test-team',
          hole: 99, // Use a high number unlikely to be used
          homePoints: 0.5,
          awayPoints: 0.5,
          points: 0.5
        }
      ])
      .select();
    
    if (insertError) {
      console.error('❌ Error inserting test record:', insertError);
      success = false;
    } else {
      console.log('✅ Successfully inserted test record');
      
      // Retrieve the test record
      const { data: retrieveData, error: retrieveError } = await supabase
        .from('MatchPoints')
        .select('*')
        .eq('id', testId)
        .single();
      
      if (retrieveError) {
        console.error('❌ Error retrieving test record:', retrieveError);
        success = false;
      } else if (retrieveData) {
        console.log('✅ Successfully retrieved test record');
        
        // Delete the test record
        const { error: deleteError } = await supabase
          .from('MatchPoints')
          .delete()
          .eq('id', testId);
        
        if (deleteError) {
          console.error('❌ Error deleting test record:', deleteError);
          success = false;
        } else {
          console.log('✅ Successfully deleted test record');
        }
      }
    }
    
    // Final result
    if (success) {
      console.log('\n✅ MatchPoints table verification PASSED');
      console.log('The table exists, has the correct structure, and CRUD operations work.');
    } else {
      console.log('\n❌ MatchPoints table verification FAILED');
      console.log('Please check the errors above and fix any issues.');
    }
    
    return success;
  } catch (error) {
    console.error('Unexpected error during verification:', error);
    return false;
  }
}

// Run the verification
verifyMatchPointsTable()
  .then(success => {
    if (success) {
      console.log('\nVerification completed successfully.');
      process.exit(0);
    } else {
      console.log('\nVerification failed. Please fix the issues before deploying to production.');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('Error running verification:', error);
    process.exit(1);
  });
