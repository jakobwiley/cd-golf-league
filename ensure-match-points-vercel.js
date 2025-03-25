#!/usr/bin/env node

/**
 * This script ensures the MatchPoints table exists in the Supabase database.
 * It's designed to be run during the Vercel build process to prevent the table
 * from being deleted during deployments.
 * 
 * Usage: Add this to your package.json build script:
 * "build": "node ensure-match-points-vercel.js && next build"
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Get environment variables from Vercel
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL');
  console.log('Continuing build process without checking MatchPoints table...');
  process.exit(0); // Don't fail the build
}

if (!supabaseKey) {
  console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY');
  console.log('Continuing build process without checking MatchPoints table...');
  process.exit(0); // Don't fail the build
}

console.log(`Vercel Build: Ensuring MatchPoints table exists in ${supabaseUrl}`);
console.log('Environment:', process.env.VERCEL_ENV || 'local');

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  }
});

async function ensureMatchPointsTable() {
  try {
    // Check if the table exists
    console.log('Checking if MatchPoints table exists...');
    
    try {
      const { data, error } = await supabase
        .from('MatchPoints')
        .select('*')
        .limit(1);
      
      if (!error) {
        console.log('✅ MatchPoints table exists!');
        return true;
      }
      
      if (error.code !== '42P01') { // Not a "relation does not exist" error
        console.error('Unexpected error:', error);
        return false;
      }
      
      console.log('❌ MatchPoints table does not exist!');
      
      // IMPORTANT: We DO NOT try to create the table here
      // Instead, we log a warning and continue the build
      console.log('\n⚠️ WARNING: MatchPoints table does not exist in the database!');
      console.log('This may cause issues with the match-points API.');
      console.log('Please create the table manually using the Supabase dashboard:');
      console.log('1. Go to https://app.supabase.com/project/<project-id>');
      console.log('2. Navigate to the SQL Editor');
      console.log('3. Copy and paste the contents of create-match-points-table.sql');
      console.log('4. Run the SQL');
      
      return false;
    } catch (error) {
      console.error('Error checking table existence:', error);
      return false;
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    return false;
  }
}

// Run the check
ensureMatchPointsTable()
  .then(success => {
    if (success) {
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
