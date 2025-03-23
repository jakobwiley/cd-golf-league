// Script to check if MatchPoints table exists and its structure
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTables() {
  console.log('Checking Supabase tables...');
  console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log('Supabase Key available:', !!supabaseKey);
  
  try {
    // Try to access the MatchPoints table directly
    console.log('\nChecking if MatchPoints table exists...');
    const { data: matchPointsData, error: matchPointsError } = await supabase
      .from('MatchPoints')
      .select('*')
      .limit(5);
    
    if (matchPointsError) {
      console.error('Error accessing MatchPoints table:', matchPointsError);
      
      if (matchPointsError.code === '42P01') { // relation does not exist
        console.log('\nMatchPoints table does not exist. Creating it...');
        
        // Create MatchPoints table
        const { error: createError } = await supabase.query(`
          CREATE TABLE IF NOT EXISTS "MatchPoints" (
            id UUID PRIMARY KEY,
            "matchId" UUID NOT NULL REFERENCES "Match"(id) ON DELETE CASCADE,
            hole INTEGER,
            "homePoints" NUMERIC NOT NULL DEFAULT 0,
            "awayPoints" NUMERIC NOT NULL DEFAULT 0,
            "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `);
        
        if (createError) {
          console.error('Error creating MatchPoints table:', createError);
        } else {
          console.log('Successfully created MatchPoints table.');
        }
      }
    } else {
      console.log('MatchPoints table exists with data:', matchPointsData);
    }
    
    // Check other tables
    console.log('\nChecking MatchScore table...');
    const { data: matchScoreData, error: matchScoreError } = await supabase
      .from('MatchScore')
      .select('*')
      .limit(5);
    
    if (matchScoreError) {
      console.error('Error accessing MatchScore table:', matchScoreError);
    } else {
      console.log('MatchScore table exists with data:', matchScoreData);
    }
    
    console.log('\nChecking Match table...');
    const { data: matchData, error: matchError } = await supabase
      .from('Match')
      .select('*')
      .limit(5);
    
    if (matchError) {
      console.error('Error accessing Match table:', matchError);
    } else {
      console.log('Match table exists with data:', matchData);
    }
    
    console.log('\nChecking Player table...');
    const { data: playerData, error: playerError } = await supabase
      .from('Player')
      .select('*')
      .limit(5);
    
    if (playerError) {
      console.error('Error accessing Player table:', playerError);
    } else {
      console.log('Player table exists with data:', playerData);
    }
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

checkTables()
  .catch(err => {
    console.error('Unhandled error:', err);
  })
  .finally(() => {
    console.log('\nCheck completed');
  });
