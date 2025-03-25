require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Development Supabase client
const devSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const devSupabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const devSupabase = createClient(devSupabaseUrl, devSupabaseKey);

async function createMatchPointsTable() {
  console.log('Creating MatchPoints table in development database...');
  
  try {
    // Create the MatchPoints table if it doesn't exist
    const { error } = await devSupabase.rpc('create_match_points_table');
    
    if (error) {
      console.error('Error creating MatchPoints table:', error);
      
      // Try direct SQL approach if RPC fails
      console.log('Attempting to create table using direct SQL...');
      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS public."MatchPoints" (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          "matchId" UUID NOT NULL REFERENCES public."Match"(id),
          "teamId" UUID NOT NULL,
          hole INTEGER,
          "homePoints" NUMERIC DEFAULT 0,
          "awayPoints" NUMERIC DEFAULT 0,
          points NUMERIC NOT NULL DEFAULT 0,
          "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now(),
          "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now()
        );
      `;
      
      const { error: sqlError } = await devSupabase.from('_sql').rpc('execute', { query: createTableSQL });
      
      if (sqlError) {
        console.error('Error creating table with direct SQL:', sqlError);
        return false;
      } else {
        console.log('MatchPoints table created successfully using direct SQL.');
        return true;
      }
    } else {
      console.log('MatchPoints table created successfully using RPC.');
      return true;
    }
  } catch (error) {
    console.error('Unexpected error creating MatchPoints table:', error);
    return false;
  }
}

// Run the function
createMatchPointsTable()
  .then(success => {
    if (success) {
      console.log('MatchPoints table setup completed successfully.');
    } else {
      console.error('Failed to set up MatchPoints table.');
    }
  })
  .catch(err => {
    console.error('Error running script:', err);
  });
