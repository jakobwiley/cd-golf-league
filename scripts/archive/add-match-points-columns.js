// Script to add homePoints and awayPoints columns to the Match table
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase URL or service role key in environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function addMatchPointsColumns() {
  try {
    console.log('Adding homePoints and awayPoints columns to Match table...');
    
    // Execute SQL to add columns if they don't exist
    const { error } = await supabase.rpc('add_match_points_columns', {});
    
    if (error) {
      // If the RPC function doesn't exist, create it first and then execute raw SQL
      console.log('Creating RPC function and adding columns directly...');
      
      // Create the function first
      await supabase.rpc('create_rpc_function', {});
      
      // Execute raw SQL to add columns
      const { error: sqlError } = await supabase.from('_sql').select('*').execute(`
        ALTER TABLE "Match" 
        ADD COLUMN IF NOT EXISTS "homePoints" NUMERIC DEFAULT 0,
        ADD COLUMN IF NOT EXISTS "awayPoints" NUMERIC DEFAULT 0;
      `);
      
      if (sqlError) {
        throw sqlError;
      }
    }
    
    console.log('Successfully added homePoints and awayPoints columns to Match table');
  } catch (error) {
    console.error('Error adding columns:', error);
    process.exit(1);
  }
}

// Execute the function
addMatchPointsColumns();
