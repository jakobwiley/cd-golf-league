#!/usr/bin/env node
/**
 * This script ensures the MatchPoints table exists in the Supabase database
 * It is designed to be run during deployment and will NEVER attempt to create or drop the table
 * It only checks for the table's existence and logs a warning if it's missing
 * This prevents the table from being accidentally deleted during deployments
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  console.log('Continuing build process without checking MatchPoints table...');
  process.exit(0); // Don't fail the build
}

console.log(`Checking MatchPoints table exists in ${supabaseUrl}...`);
console.log('Environment:', process.env.NODE_ENV || 'development');
console.log('Vercel Environment:', process.env.VERCEL_ENV || 'local');

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  }
});

async function checkMatchPointsTable() {
  try {
    // Check if the table exists by trying to select from it
    console.log('Checking if MatchPoints table exists...');
    const { data, error } = await supabase
      .from('MatchPoints')
      .select('id')
      .limit(1);
    
    if (error) {
      if (error.code === '42P01' || error.message.includes('does not exist')) {
        // Table doesn't exist, log a warning but DO NOT try to create it
        console.log('⚠️ WARNING: MatchPoints table does not exist!');
        console.log('This may cause issues with the match-points API.');
        console.log('Please create the table manually using the Supabase dashboard:');
        console.log('1. Go to https://app.supabase.com/project/<project-id>');
        console.log('2. Navigate to the SQL Editor');
        console.log('3. Copy and paste the contents of create-match-points-table.sql');
        console.log('4. Run the SQL');
        return false;
      } else {
        // Some other error occurred
        console.error('Error checking MatchPoints table:', error);
        return false;
      }
    } else {
      // Table exists
      console.log('✅ MatchPoints table exists!');
      
      // Log the structure of the table for verification
      console.log('Verifying table structure...');
      try {
        const { data: columns, error: columnsError } = await supabase
          .rpc('get_table_columns', { table_name: 'MatchPoints' });
        
        if (columnsError) {
          console.log('Unable to verify table structure:', columnsError);
        } else if (columns && columns.length > 0) {
          console.log('Table has the following columns:');
          columns.forEach(col => {
            console.log(`- ${col.column_name} (${col.data_type})`);
          });
        }
      } catch (structureError) {
        console.log('Unable to verify table structure:', structureError);
      }
      
      return true;
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    return false;
  }
}

// Run the function
checkMatchPointsTable()
  .then(exists => {
    if (exists) {
      console.log('✅ MatchPoints table check completed successfully.');
    } else {
      console.log('⚠️ MatchPoints table check completed with warnings.');
    }
    // Always exit with success to not block the build
    process.exit(0);
  })
  .catch(error => {
    console.error('Error during MatchPoints table check:', error);
    // Always exit with success to not block the build
    process.exit(0);
  });
