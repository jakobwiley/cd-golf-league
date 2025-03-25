// Script to directly create the MatchPoints table in Supabase
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL');
}

if (!supabaseKey) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

console.log(`Connecting to Supabase at ${supabaseUrl}`);
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  }
});

async function createMatchPointsTable() {
  try {
    // First check if the table exists
    console.log('Checking if MatchPoints table exists...');
    try {
      const { data, error } = await supabase
        .from('MatchPoints')
        .select('*')
        .limit(1);
      
      if (!error) {
        console.log('✅ MatchPoints table already exists!');
        return true;
      }
      
      if (error.code !== '42P01') { // Not a "relation does not exist" error
        console.error('Unexpected error:', error);
        return false;
      }
    } catch (error) {
      console.log('Table does not exist, will create it');
    }
    
    console.log('Creating MatchPoints table using Supabase client...');
    
    // Create the table using the RPC function
    const { error: rpcError } = await supabase.rpc('create_match_points_table');
    
    if (rpcError) {
      console.log('RPC method failed, trying alternative approach...');
      
      // Try creating the table using the storage API as a workaround
      // First, create a temporary SQL file
      const tempSqlFile = path.join(__dirname, 'temp-create-match-points.sql');
      const sqlContent = fs.readFileSync(path.join(__dirname, 'create-dev-match-points-table.sql'), 'utf8');
      fs.writeFileSync(tempSqlFile, sqlContent);
      
      // Upload the SQL file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('temp-sql')
        .upload(`create-match-points-${Date.now()}.sql`, fs.readFileSync(tempSqlFile));
      
      if (uploadError) {
        console.error('Error uploading SQL file:', uploadError);
        
        // Last resort: Try creating the table manually using the JavaScript client
        console.log('Attempting to create table using JavaScript client...');
        
        try {
          // Create the table
          await supabase.schema.createTable('MatchPoints', [
            { name: 'id', type: 'text', primaryKey: true, defaultValue: "gen_random_uuid()::TEXT" },
            { name: 'matchId', type: 'text', notNull: true, references: '"Match"(id)', onDelete: 'cascade' },
            { name: 'teamId', type: 'text', notNull: true },
            { name: 'hole', type: 'integer' },
            { name: 'homePoints', type: 'numeric', notNull: true, defaultValue: 0 },
            { name: 'awayPoints', type: 'numeric', notNull: true, defaultValue: 0 },
            { name: 'points', type: 'numeric', notNull: true, defaultValue: 0 },
            { name: 'createdAt', type: 'timestamp with time zone', defaultValue: 'now()' },
            { name: 'updatedAt', type: 'timestamp with time zone', defaultValue: 'now()' }
          ]);
          
          // Create indexes
          await supabase.schema.createIndex('MatchPoints', ['matchId'], { name: 'idx_match_points_match_id' });
          await supabase.schema.createIndex('MatchPoints', ['teamId'], { name: 'idx_match_points_team_id' });
          await supabase.schema.createUniqueIndex('MatchPoints', ['matchId', 'hole'], { 
            name: 'idx_match_points_match_id_hole',
            predicate: 'hole IS NOT NULL'
          });
          
          console.log('✅ Table created using JavaScript client!');
        } catch (jsClientError) {
          console.error('Error creating table with JavaScript client:', jsClientError);
          
          // If all else fails, create the table through the REST API
          console.log('Attempting direct table creation through REST API...');
          
          // Create the table directly using the Supabase client
          const { error: tableError } = await supabase
            .from('MatchPoints')
            .insert([
              {
                id: 'temp-id-to-create-table',
                matchId: 'c0143847-3724-4aab-a7c1-8ccce93ab92f', // Use a known valid match ID
                teamId: 'temp-team-id',
                hole: null,
                homePoints: 0,
                awayPoints: 0,
                points: 0
              }
            ]);
          
          if (tableError && tableError.code === '42P01') {
            console.error('All methods failed. Please create the table manually:');
            console.log('1. Go to https://app.supabase.com/project/gyvaalhcjrwozinpilsw');
            console.log('2. Navigate to the SQL Editor');
            console.log('3. Copy and paste the contents of create-dev-match-points-table.sql');
            console.log('4. Run the SQL');
            return false;
          } else if (tableError) {
            console.error('Error creating table:', tableError);
            return false;
          } else {
            console.log('✅ Table created through REST API!');
          }
        }
      } else {
        console.log('✅ SQL file uploaded successfully!');
        
        // Clean up the temporary file
        fs.unlinkSync(tempSqlFile);
      }
    } else {
      console.log('✅ Table created using RPC!');
    }
    
    // Verify the table was created
    console.log('Verifying table creation...');
    const { data, error } = await supabase
      .from('MatchPoints')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Error verifying table creation:', error);
      return false;
    } else {
      console.log('✅ Table verification successful!');
      return true;
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    console.log('Please create the table manually using the Supabase dashboard:');
    console.log('1. Go to https://app.supabase.com/project/gyvaalhcjrwozinpilsw');
    console.log('2. Navigate to the SQL Editor');
    console.log('3. Copy and paste the contents of create-dev-match-points-table.sql');
    console.log('4. Run the SQL');
    return false;
  }
}

createMatchPointsTable()
  .then(success => {
    if (success) {
      console.log('✅ MatchPoints table is ready to use!');
    } else {
      console.log('❌ Failed to ensure MatchPoints table exists.');
    }
  })
  .catch(console.error)
  .finally(() => console.log('Script completed'));
