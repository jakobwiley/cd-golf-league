// This script ensures the MatchPoints table exists in the Supabase database
// It runs during the Vercel build process

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

console.log(`Ensuring MatchPoints table exists in ${supabaseUrl}...`);

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function ensureMatchPointsTable() {
  try {
    // Check if the table exists
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'MatchPoints');
    
    if (error) {
      console.error('Error checking if table exists:', error);
      // Continue to create table anyway
    }
    
    // If table doesn't exist or we couldn't check, create it
    if (!data || data.length === 0 || error) {
      console.log('Creating MatchPoints table...');
      
      // Create the table with SQL
      const { error: createError } = await supabase.rpc('create_match_points_table');
      
      if (createError) {
        console.error('Error creating table via RPC:', createError);
        console.log('Trying direct SQL approach...');
        
        // Try direct SQL approach as fallback
        const createTableSql = `
          -- Create the MatchPoints table with all required columns
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
        `;
        
        // This will likely fail in Vercel environment without proper permissions,
        // but we'll try anyway as a last resort
        try {
          await supabase.rpc('run_sql', { query: createTableSql });
          console.log('Table created successfully via direct SQL');
        } catch (sqlError) {
          console.error('Failed to create table via direct SQL:', sqlError);
          console.log('Please ensure the MatchPoints table is created manually in the Supabase dashboard');
        }
      } else {
        console.log('Table created successfully via RPC');
      }
    } else {
      console.log('MatchPoints table already exists');
    }
    
    // Check if the table has all required columns
    const { data: columns, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('column_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'MatchPoints');
    
    if (columnsError) {
      console.error('Error checking columns:', columnsError);
    } else {
      console.log('MatchPoints table columns:', columns.map(c => c.column_name).join(', '));
      
      // Check for required columns
      const requiredColumns = ['teamId', 'points', 'homePoints', 'awayPoints', 'hole'];
      const missingColumns = requiredColumns.filter(
        col => !columns.some(c => c.column_name.toLowerCase() === col.toLowerCase())
      );
      
      if (missingColumns.length > 0) {
        console.warn('Missing required columns:', missingColumns.join(', '));
        console.log('Please ensure these columns are added manually in the Supabase dashboard');
      } else {
        console.log('All required columns exist');
      }
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    process.exit(1);
  }
}

ensureMatchPointsTable()
  .then(() => {
    console.log('MatchPoints table check complete');
    process.exit(0);
  })
  .catch(err => {
    console.error('Script error:', err);
    process.exit(1);
  });
