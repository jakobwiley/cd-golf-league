#!/usr/bin/env node
/**
 * This script ensures the MatchPoints table exists with the correct structure
 * It should be run as part of the deployment process
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

console.log(`Ensuring MatchPoints table exists in ${supabaseUrl}...`);

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  }
});

async function ensureMatchPointsTable() {
  try {
    // Try to query the MatchPoints table to see if it exists
    console.log('Checking if MatchPoints table exists...');
    const { data, error } = await supabase
      .from('MatchPoints')
      .select('id')
      .limit(1);
    
    if (error && error.code === '42P01') {
      // Table doesn't exist (relation "MatchPoints" does not exist)
      console.log('MatchPoints table does not exist, creating it...');
      
      // Create the MatchPoints table using SQL
      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS public."MatchPoints" (
          id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
          "matchId" TEXT NOT NULL REFERENCES public."Match"(id) ON DELETE CASCADE,
          "teamId" TEXT NOT NULL,
          hole INTEGER,
          "homePoints" NUMERIC DEFAULT 0,
          "awayPoints" NUMERIC DEFAULT 0,
          points NUMERIC NOT NULL DEFAULT 0,
          "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now(),
          "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now()
        );
        
        -- Add indexes
        CREATE INDEX IF NOT EXISTS "matchpoints_matchid_idx" ON public."MatchPoints" ("matchId");
        CREATE INDEX IF NOT EXISTS "matchpoints_teamid_idx" ON public."MatchPoints" ("teamId");
        
        -- Add RLS policies
        ALTER TABLE public."MatchPoints" ENABLE ROW LEVEL SECURITY;
        
        DROP POLICY IF EXISTS "Enable read access for all users" ON public."MatchPoints";
        CREATE POLICY "Enable read access for all users" 
          ON public."MatchPoints" 
          FOR SELECT 
          USING (true);
        
        DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public."MatchPoints";
        CREATE POLICY "Enable insert for authenticated users only" 
          ON public."MatchPoints" 
          FOR INSERT 
          WITH CHECK (auth.role() = 'authenticated');
        
        DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public."MatchPoints";
        CREATE POLICY "Enable update for authenticated users only" 
          ON public."MatchPoints" 
          FOR UPDATE 
          USING (auth.role() = 'authenticated');
      `;
      
      // Execute the SQL using the REST API directly
      const response = await fetch(`${supabaseUrl}/rest/v1/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`,
          'apikey': supabaseKey
        },
        body: JSON.stringify({
          query: createTableSQL
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error creating table:', errorData);
        
        // Try an alternative approach using Supabase functions if available
        console.log('Attempting to create table using alternative approach...');
        
        // Create a migration file
        const fs = require('fs');
        const path = require('path');
        
        const migrationDir = path.join(__dirname, 'supabase', 'migrations');
        if (!fs.existsSync(migrationDir)) {
          fs.mkdirSync(migrationDir, { recursive: true });
        }
        
        const migrationFile = path.join(migrationDir, '20250324_ensure_match_points_table.sql');
        fs.writeFileSync(migrationFile, createTableSQL);
        
        console.log(`Created migration file: ${migrationFile}`);
        console.log('Please run this migration file using the Supabase CLI or dashboard');
      } else {
        console.log('MatchPoints table created successfully');
      }
    } else if (error) {
      console.error('Error checking table:', error);
    } else {
      console.log('MatchPoints table exists');
    }
    
    // Try to verify the table structure by querying a few records
    console.log('Verifying table access...');
    const { data: records, error: recordsError } = await supabase
      .from('MatchPoints')
      .select('*')
      .limit(5);
    
    if (recordsError) {
      console.error('Error querying table:', recordsError);
    } else {
      console.log(`Found ${records.length} records in MatchPoints table`);
      if (records.length > 0) {
        console.log('Sample record:', records[0]);
      }
    }
    
    console.log('MatchPoints table verification completed');
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the function
ensureMatchPointsTable()
  .then(() => {
    console.log('Table check completed');
    process.exit(0);
  })
  .catch(error => {
    console.error('Error during table check:', error);
    process.exit(1);
  });
