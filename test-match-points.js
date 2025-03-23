// Script to test inserting a record into the MatchPoints table
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const { randomUUID } = require('crypto');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testMatchPointsInsert() {
  console.log('Testing MatchPoints table insertion...');
  console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  
  try {
    // First, check the current state of the MatchPoints table
    console.log('Checking current MatchPoints table...');
    const { data: tableData, error: tableError } = await supabase
      .from('MatchPoints')
      .select('*')
      .limit(10);
    
    if (tableError) {
      console.error('Error checking MatchPoints table:', tableError);
    } else {
      console.log('Current MatchPoints records:', tableData);
    }
    
    // Get a valid matchId from the Match table
    const { data: matches, error: matchError } = await supabase
      .from('Match')
      .select('id, homeTeamId, awayTeamId')
      .limit(1);
    
    if (matchError) {
      console.error('Error fetching match:', matchError);
      return;
    }
    
    if (!matches || matches.length === 0) {
      console.error('No matches found in the database');
      return;
    }
    
    const match = matches[0];
    console.log('Using match:', match);
    
    // Test inserting a record with all required fields
    const testRecord = {
      id: randomUUID(),
      matchId: match.id,
      teamId: match.homeTeamId, // Include the required teamId
      hole: 1, // Use a specific hole number
      homePoints: 1.0,
      awayPoints: 0.0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    console.log('Inserting test record:', testRecord);
    
    const { data, error } = await supabase
      .from('MatchPoints')
      .insert(testRecord)
      .select();
    
    if (error) {
      console.error('Error inserting record:', error);
      
      // Check table structure
      console.log('Checking table structure...');
      const { data: tableInfo, error: tableInfoError } = await supabase
        .rpc('get_table_info', { table_name: 'MatchPoints' });
      
      if (tableInfoError) {
        console.error('Error checking table info:', tableInfoError);
        
        // Try a direct SQL query to check columns
        console.log('Trying direct SQL query...');
        const { data: columns, error: columnsError } = await supabase
          .rpc('execute_sql', { 
            sql: "SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'MatchPoints'" 
          });
        
        if (columnsError) {
          console.error('Error with direct SQL query:', columnsError);
        } else {
          console.log('Table columns:', columns);
        }
      } else {
        console.log('Table info:', tableInfo);
      }
    } else {
      console.log('Record inserted successfully:', data);
      
      // Check if the record is actually in the table
      console.log('Verifying insertion...');
      const { data: verifyData, error: verifyError } = await supabase
        .from('MatchPoints')
        .select('*')
        .eq('id', testRecord.id)
        .single();
      
      if (verifyError) {
        console.error('Error verifying insertion:', verifyError);
      } else {
        console.log('Verified record in database:', verifyData);
      }
    }
    
    // Try to insert a total points record (hole = null)
    const totalPointsRecord = {
      id: randomUUID(),
      matchId: match.id,
      teamId: match.homeTeamId,
      hole: null, // null for total points
      homePoints: 2.5,
      awayPoints: 1.5,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    console.log('Inserting total points record:', totalPointsRecord);
    
    const { data: totalData, error: totalError } = await supabase
      .from('MatchPoints')
      .insert(totalPointsRecord)
      .select();
    
    if (totalError) {
      console.error('Error inserting total points record:', totalError);
    } else {
      console.log('Total points record inserted successfully:', totalData);
    }
    
    // Check if the points column is being used
    console.log('Checking if points column is used...');
    const { data: pointsData, error: pointsError } = await supabase
      .from('MatchPoints')
      .select('*')
      .not('points', 'is', null)
      .limit(5);
    
    if (pointsError) {
      console.error('Error checking points column:', pointsError);
    } else {
      console.log('Records with points column:', pointsData);
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

testMatchPointsInsert()
  .catch(err => {
    console.error('Unhandled error:', err);
  })
  .finally(() => {
    console.log('Test completed');
  });
