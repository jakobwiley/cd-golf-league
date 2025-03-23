const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function createMatchPointsTable() {
  console.log('Creating MatchPoints table...');
  
  try {
    // First, check if the table exists
    const { data: tableExists, error: checkError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_name', 'MatchPoints')
      .eq('table_schema', 'public');
    
    if (checkError) {
      console.error('Error checking if table exists:', checkError);
      return;
    }
    
    if (tableExists && tableExists.length > 0) {
      console.log('MatchPoints table already exists');
      
      // Check table structure
      const { data: columns, error: columnsError } = await supabase
        .from('information_schema.columns')
        .select('column_name')
        .eq('table_name', 'MatchPoints')
        .eq('table_schema', 'public');
      
      if (columnsError) {
        console.error('Error checking columns:', columnsError);
        return;
      }
      
      console.log('Existing columns:', columns.map(c => c.column_name));
      
      // Check if required columns exist
      const requiredColumns = ['teamId', 'points', 'hole', 'homePoints', 'awayPoints'];
      const missingColumns = requiredColumns.filter(
        col => !columns.some(c => c.column_name.toLowerCase() === col.toLowerCase())
      );
      
      if (missingColumns.length > 0) {
        console.log('Missing columns:', missingColumns);
        
        // Add missing columns
        for (const column of missingColumns) {
          let query = '';
          
          switch(column) {
            case 'teamId':
              query = 'ALTER TABLE "MatchPoints" ADD COLUMN "teamId" UUID NOT NULL DEFAULT \'00000000-0000-0000-0000-000000000000\'';
              break;
            case 'points':
              query = 'ALTER TABLE "MatchPoints" ADD COLUMN "points" NUMERIC NOT NULL DEFAULT 0';
              break;
            case 'hole':
              query = 'ALTER TABLE "MatchPoints" ADD COLUMN "hole" INTEGER';
              break;
            case 'homePoints':
              query = 'ALTER TABLE "MatchPoints" ADD COLUMN "homePoints" NUMERIC NOT NULL DEFAULT 0';
              break;
            case 'awayPoints':
              query = 'ALTER TABLE "MatchPoints" ADD COLUMN "awayPoints" NUMERIC NOT NULL DEFAULT 0';
              break;
          }
          
          if (query) {
            console.log(`Adding column ${column}...`);
            const { error } = await supabase.rpc('run_sql', { query });
            
            if (error) {
              console.error(`Error adding column ${column}:`, error);
            } else {
              console.log(`Column ${column} added successfully`);
            }
          }
        }
      } else {
        console.log('All required columns exist');
      }
    } else {
      console.log('MatchPoints table does not exist, creating it...');
      
      // Create the table
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS "MatchPoints" (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          "matchId" UUID NOT NULL REFERENCES "Match"(id) ON DELETE CASCADE,
          "teamId" UUID NOT NULL,
          hole INTEGER,
          "homePoints" NUMERIC NOT NULL DEFAULT 0,
          "awayPoints" NUMERIC NOT NULL DEFAULT 0,
          "points" NUMERIC NOT NULL DEFAULT 0,
          "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `;
      
      const { error } = await supabase.rpc('run_sql', { query: createTableQuery });
      
      if (error) {
        console.error('Error creating table:', error);
      } else {
        console.log('MatchPoints table created successfully');
      }
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

createMatchPointsTable()
  .then(() => console.log('Done'))
  .catch(err => console.error('Script error:', err));
