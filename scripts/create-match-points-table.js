#!/usr/bin/env node

/**
 * This script directly creates the MatchPoints table in the Supabase database.
 * It can be used during deployment or manually to ensure the table exists with the correct structure.
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

async function createMatchPointsTable() {
  console.log('Creating or updating MatchPoints table...');
  console.log('Supabase URL:', supabaseUrl);
  
  // SQL to create the MatchPoints table
  const createTableSql = `
    -- Create the MatchPoints table with all required columns if it doesn't exist
    CREATE TABLE IF NOT EXISTS "MatchPoints" (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
      "matchId" TEXT NOT NULL REFERENCES "Match"(id) ON DELETE CASCADE,
      "teamId" TEXT NOT NULL,
      hole INTEGER,
      "homePoints" NUMERIC NOT NULL DEFAULT 0,
      "awayPoints" NUMERIC NOT NULL DEFAULT 0,
      "points" NUMERIC NOT NULL DEFAULT 0,
      "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    -- Create indexes for better performance
    CREATE INDEX IF NOT EXISTS "idx_match_points_match_id" ON "MatchPoints" ("matchId");
    CREATE INDEX IF NOT EXISTS "idx_match_points_team_id" ON "MatchPoints" ("teamId");
    
    -- Create a unique index to prevent duplicate entries for the same match and hole
    CREATE UNIQUE INDEX IF NOT EXISTS "idx_match_points_match_id_hole" 
    ON "MatchPoints" ("matchId", hole) 
    WHERE hole IS NOT NULL;
  `;
  
  try {
    // First, check if we can directly query the table
    console.log('Checking if MatchPoints table exists...');
    try {
      const { data, error } = await supabase
        .from('MatchPoints')
        .select('id')
        .limit(1);
      
      if (error) {
        console.error('Error querying MatchPoints table:', error);
        console.log('Table may not exist, creating it...');
      } else {
        console.log('MatchPoints table exists, ensuring correct structure...');
      }
    } catch (queryError) {
      console.error('Error querying MatchPoints table:', queryError);
      console.log('Table likely does not exist, creating it...');
    }
    
    // Try using RPC to run SQL
    console.log('Creating/updating table via RPC...');
    const { error: createError } = await supabase.rpc('run_sql', { query: createTableSql });
    
    if (createError) {
      console.error('Error using RPC to create table:', createError);
      throw createError;
    }
    
    console.log('Table created or updated successfully via RPC');
    
    // Verify the table exists and has the correct structure
    try {
      const { data, error } = await supabase
        .from('MatchPoints')
        .select('*')
        .limit(1);
      
      if (error) {
        console.error('Error verifying table creation:', error);
        return false;
      }
      
      console.log('MatchPoints table verified to exist');
      return true;
    } catch (verifyError) {
      console.error('Error verifying table creation:', verifyError);
      return false;
    }
  } catch (error) {
    console.error('Failed to create MatchPoints table:', error);
    return false;
  }
}

// Run the function
createMatchPointsTable()
  .then(success => {
    if (success) {
      console.log('MatchPoints table created or updated successfully');
      process.exit(0);
    } else {
      console.error('Failed to create or update MatchPoints table');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('Unexpected error:', error);
    process.exit(1);
  });
