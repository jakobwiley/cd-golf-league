#!/usr/bin/env node
/**
 * This script ensures the MatchPoints table exists in the Supabase database
 * It is designed to be run during deployment and will never drop the table
 * It is idempotent and can be run multiple times safely
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

console.log(`Ensuring MatchPoints table exists in ${supabaseUrl}...`);
console.log('Environment:', process.env.NODE_ENV || 'development');

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function ensureMatchPointsTable() {
  try {
    // First, check if the table exists by trying to select from it
    const { data, error } = await supabase
      .from('MatchPoints')
      .select('id')
      .limit(1);
    
    if (error) {
      if (error.code === 'PGRST116' || error.message.includes('does not exist')) {
        // Table doesn't exist, create it
        console.log('MatchPoints table does not exist, creating it...');
        
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
        
        // Execute the SQL directly
        const { error: sqlError } = await supabase.rpc('exec_sql', { sql: createTableSql });
        
        if (sqlError) {
          console.error('Error creating MatchPoints table:', sqlError);
          
          // Try an alternative approach using PostgreSQL functions
          console.log('Trying alternative approach...');
          
          const { error: rpcError } = await supabase.rpc('create_match_points_table');
          
          if (rpcError) {
            console.error('Error creating MatchPoints table with RPC:', rpcError);
            return false;
          }
        }
        
        console.log('✅ MatchPoints table created successfully');
        return true;
      } else {
        console.error('Error checking MatchPoints table:', error);
        return false;
      }
    } else {
      console.log('✅ MatchPoints table already exists');
      return true;
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    return false;
  }
}

// Run the function
ensureMatchPointsTable()
  .then(success => {
    if (success) {
      console.log('MatchPoints table check/creation completed successfully');
    } else {
      console.error('Failed to ensure MatchPoints table exists');
      // Don't exit with error code to allow deployment to continue
    }
  })
  .catch(err => {
    console.error('Error running script:', err);
    // Don't exit with error code to allow deployment to continue
  });
