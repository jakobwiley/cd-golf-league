#!/usr/bin/env node
/**
 * This script checks if the MatchPoints table exists in the Supabase database
 * It runs during the Vercel build process but does NOT recreate the table
 */

const { createClient } = require('@supabase/supabase-js');

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL');
  process.exit(1);
}

if (!supabaseKey) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

console.log(`Checking if MatchPoints table exists in ${supabaseUrl}...`);
console.log('Environment:', process.env.NODE_ENV || 'development');

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkMatchPointsTable() {
  try {
    // Check if the table exists by trying to select from it
    const { data, error } = await supabase
      .from('MatchPoints')
      .select('id')
      .limit(1);
    
    if (error) {
      if (error.code === 'PGRST116') {
        // Table doesn't exist
        console.warn('⚠️ MatchPoints table does not exist!');
        console.warn('Please create the MatchPoints table manually with the following structure:');
        console.warn(`
          id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
          "matchId" TEXT NOT NULL REFERENCES "Match"(id) ON DELETE CASCADE,
          "teamId" TEXT NOT NULL,
          hole INTEGER,
          "homePoints" NUMERIC NOT NULL DEFAULT 0,
          "awayPoints" NUMERIC NOT NULL DEFAULT 0,
          "points" NUMERIC NOT NULL DEFAULT 0,
          "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        `);
      } else {
        console.error('Error checking MatchPoints table:', error);
      }
    } else {
      console.log('✅ MatchPoints table exists');
      
      // Check if the table has all required columns
      try {
        // Try to select all required columns to see if they exist
        const { error: columnsError } = await supabase
          .from('MatchPoints')
          .select('id, matchId, teamId, hole, homePoints, awayPoints, points, createdAt, updatedAt')
          .limit(1);
        
        if (columnsError) {
          console.warn('⚠️ MatchPoints table is missing some required columns:', columnsError.message);
          console.warn('Please ensure all required columns exist in the MatchPoints table.');
        } else {
          console.log('✅ All required columns exist in the MatchPoints table');
        }
      } catch (columnsCheckError) {
        console.error('Error checking columns:', columnsCheckError);
      }
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    // Don't exit with error to allow build to continue
    console.warn('Continuing build despite MatchPoints table check failure');
  }
}

checkMatchPointsTable()
  .then(() => {
    console.log('MatchPoints table check complete');
    // Always exit with success to allow build to continue
    process.exit(0);
  })
  .catch(err => {
    console.error('Script error:', err);
    // Always exit with success to allow build to continue
    console.warn('Continuing build despite script error');
    process.exit(0);
  });
