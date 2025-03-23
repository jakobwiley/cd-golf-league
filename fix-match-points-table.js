// Script to fix the MatchPoints table structure
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixMatchPointsTable() {
  console.log('Fixing MatchPoints table structure...');
  console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  
  try {
    // Check if the table exists
    console.log('Checking if MatchPoints table exists...');
    const { data: testData, error: testError } = await supabase
      .from('MatchPoints')
      .select('*')
      .limit(1);
    
    if (testError) {
      console.error('Error checking MatchPoints table:', testError);
      
      if (testError.code === '42P01') { // relation does not exist
        console.log('MatchPoints table does not exist. We will create it.');
      } else {
        console.error('Unexpected error checking MatchPoints table:', testError);
        return;
      }
    } else {
      console.log('MatchPoints table exists. Checking for data...');
      console.log('Sample data:', testData);
      
      // Delete all records from the table
      console.log('Clearing existing data from MatchPoints table...');
      const { error: deleteError } = await supabase
        .from('MatchPoints')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');
      
      if (deleteError) {
        console.error('Error clearing data:', deleteError);
        return;
      }
      
      console.log('Successfully cleared existing data.');
    }
    
    // Use raw SQL through the REST API to create or alter the table
    console.log('Creating or updating MatchPoints table with correct structure...');
    
    // First, try to use the Supabase REST API to execute SQL
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/execute_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      },
      body: JSON.stringify({
        sql: `
          DROP TABLE IF EXISTS "MatchPoints";
          
          CREATE TABLE "MatchPoints" (
            id UUID PRIMARY KEY,
            "matchId" UUID NOT NULL REFERENCES "Match"(id) ON DELETE CASCADE,
            hole INTEGER,
            "homePoints" NUMERIC NOT NULL DEFAULT 0,
            "awayPoints" NUMERIC NOT NULL DEFAULT 0,
            "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error executing SQL:', errorData);
      
      console.log('Trying alternative approach...');
      // If the RPC approach doesn't work, we'll create a simple test record
      // and check if it has the right columns
      
      // Test inserting a record with the expected structure
      console.log('Testing insert into MatchPoints table...');
      const { error: insertError } = await supabase
        .from('MatchPoints')
        .insert({
          id: '00000000-0000-0000-0000-000000000001',
          matchId: 'd0b585dd-09e4-4171-b133-2f5376bcc59a',
          hole: null,
          homePoints: 0,
          awayPoints: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      
      if (insertError) {
        console.error('Error inserting test record:', insertError);
        
        // If we can't insert with homePoints and awayPoints, the table structure is wrong
        console.log('The table structure appears to be incorrect.');
        console.log('Please contact your database administrator to fix the MatchPoints table structure.');
        console.log('Required columns: id, matchId, hole, homePoints, awayPoints, createdAt, updatedAt');
      } else {
        console.log('Successfully inserted test record. The table structure appears to be correct.');
      }
    } else {
      const responseData = await response.json();
      console.log('SQL execution response:', responseData);
      console.log('Successfully updated MatchPoints table structure.');
      
      // Test inserting a record
      console.log('Testing insert into MatchPoints table...');
      const { error: insertError } = await supabase
        .from('MatchPoints')
        .insert({
          id: '00000000-0000-0000-0000-000000000001',
          matchId: 'd0b585dd-09e4-4171-b133-2f5376bcc59a',
          hole: null,
          homePoints: 0,
          awayPoints: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      
      if (insertError) {
        console.error('Error inserting test record:', insertError);
      } else {
        console.log('Successfully inserted test record.');
      }
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

fixMatchPointsTable()
  .catch(err => {
    console.error('Unhandled error:', err);
  })
  .finally(() => {
    console.log('Fix completed');
  });
