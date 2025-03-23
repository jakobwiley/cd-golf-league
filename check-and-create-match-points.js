require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL');
}

if (!supabaseKey) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAndCreateMatchPointsTable() {
  console.log(`Connecting to Supabase at ${supabaseUrl}`);
  
  try {
    // Check if the table exists
    const { data: tableInfo, error: tableError } = await supabase
      .rpc('check_table_exists', { table_name: 'MatchPoints' });
    
    if (tableError) {
      console.error('Error checking if table exists:', tableError);
      
      // Create the rpc function if it doesn't exist
      const createRpcFunctionSql = `
        CREATE OR REPLACE FUNCTION check_table_exists(table_name text)
        RETURNS boolean
        LANGUAGE plpgsql
        AS $$
        DECLARE
          table_exists boolean;
        BEGIN
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = $1
          ) INTO table_exists;
          
          RETURN table_exists;
        END;
        $$;
      `;
      
      const { error: createRpcError } = await supabase.rpc('run_sql', { query: createRpcFunctionSql });
      
      if (createRpcError) {
        console.error('Error creating RPC function:', createRpcError);
        
        // Alternative approach: direct query to check if table exists
        console.log('Trying alternative approach to check table existence...');
        
        // Create the table directly
        console.log('Creating MatchPoints table...');
        await createMatchPointsTable();
        return;
      }
      
      // Try again after creating the function
      const { data: retryTableInfo, error: retryTableError } = await supabase
        .rpc('check_table_exists', { table_name: 'MatchPoints' });
      
      if (retryTableError) {
        console.error('Error checking if table exists (retry):', retryTableError);
        // Create the table directly
        console.log('Creating MatchPoints table...');
        await createMatchPointsTable();
        return;
      }
      
      if (!retryTableInfo) {
        console.log('Table does not exist, creating it...');
        await createMatchPointsTable();
      } else {
        console.log('Table exists!');
      }
    } else {
      if (!tableInfo) {
        console.log('Table does not exist, creating it...');
        await createMatchPointsTable();
      } else {
        console.log('Table exists!');
      }
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    
    // Create the table as a fallback
    console.log('Creating MatchPoints table as fallback...');
    await createMatchPointsTable();
  }
}

async function createMatchPointsTable() {
  const createTableSql = `
    -- Drop the table if it exists
    DROP TABLE IF EXISTS "MatchPoints";

    -- Create the MatchPoints table with all required columns
    CREATE TABLE "MatchPoints" (
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

    -- Create an index on matchId for better performance
    CREATE INDEX IF NOT EXISTS "idx_match_points_match_id" ON "MatchPoints" ("matchId");

    -- Create an index on teamId for better performance
    CREATE INDEX IF NOT EXISTS "idx_match_points_team_id" ON "MatchPoints" ("teamId");

    -- Create a unique index on matchId and hole to prevent duplicates
    CREATE UNIQUE INDEX IF NOT EXISTS "idx_match_points_match_id_hole" 
    ON "MatchPoints" ("matchId", hole) 
    WHERE hole IS NOT NULL;
  `;

  try {
    // Try to execute the SQL directly
    const { error } = await supabase.rpc('run_sql', { query: createTableSql });
    
    if (error) {
      console.error('Error creating table via RPC:', error);
      
      // Alternative approach: execute each statement separately
      console.log('Trying alternative approach...');
      
      // Drop table if exists
      await supabase.rpc('run_sql', { query: 'DROP TABLE IF EXISTS "MatchPoints"' });
      
      // Create table
      const createTableQuery = `
        CREATE TABLE "MatchPoints" (
          id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
          "matchId" TEXT NOT NULL REFERENCES "Match"(id) ON DELETE CASCADE,
          "teamId" TEXT NOT NULL,
          hole INTEGER,
          "homePoints" NUMERIC NOT NULL DEFAULT 0,
          "awayPoints" NUMERIC NOT NULL DEFAULT 0,
          "points" NUMERIC NOT NULL DEFAULT 0,
          "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `;
      
      const { error: createError } = await supabase.rpc('run_sql', { query: createTableQuery });
      
      if (createError) {
        console.error('Error creating table:', createError);
        return;
      }
      
      // Create indexes
      await supabase.rpc('run_sql', { 
        query: 'CREATE INDEX IF NOT EXISTS "idx_match_points_match_id" ON "MatchPoints" ("matchId")' 
      });
      
      await supabase.rpc('run_sql', { 
        query: 'CREATE INDEX IF NOT EXISTS "idx_match_points_team_id" ON "MatchPoints" ("teamId")' 
      });
      
      await supabase.rpc('run_sql', { 
        query: `CREATE UNIQUE INDEX IF NOT EXISTS "idx_match_points_match_id_hole" 
                ON "MatchPoints" ("matchId", hole) 
                WHERE hole IS NOT NULL` 
      });
      
      console.log('Table created successfully using alternative approach');
    } else {
      console.log('Table created successfully');
    }
  } catch (error) {
    console.error('Unexpected error creating table:', error);
  }
}

checkAndCreateMatchPointsTable()
  .then(() => console.log('Done'))
  .catch(err => console.error('Script error:', err));
