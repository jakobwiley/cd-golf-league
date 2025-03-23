// Script to test Supabase connection
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Testing Supabase connection with:');
console.log('URL:', supabaseUrl);
console.log('Key available:', !!supabaseKey);

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('Testing read access...');
  const { data: matchData, error: matchError } = await supabase
    .from('Match')
    .select('id')
    .limit(1);
  
  console.log('Match data:', matchData);
  if (matchError) {
    console.error('Error reading from Match table:', matchError);
  } else {
    console.log('Successfully read from Match table');
  }
  
  console.log('\nTesting write access...');
  // Create a test score with a unique ID to avoid conflicts
  const testId = `test-${Date.now()}`;
  const testScore = {
    id: testId,
    matchId: 'd0b585dd-09e4-4171-b133-2f5376bcc59a', // The match ID you mentioned
    playerId: 'test-player',
    hole: 1,
    score: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  const { data: insertData, error: insertError } = await supabase
    .from('MatchScore')
    .insert(testScore);
  
  if (insertError) {
    console.error('Error inserting test score:', insertError);
    
    // Check if it's a foreign key constraint issue
    if (insertError.code === '23503') {
      console.log('This appears to be a foreign key constraint error.');
      console.log('Checking if the match exists...');
      
      const { data: matchCheck, error: matchCheckError } = await supabase
        .from('Match')
        .select('id')
        .eq('id', 'd0b585dd-09e4-4171-b133-2f5376bcc59a')
        .single();
      
      if (matchCheckError) {
        console.error('Error checking match:', matchCheckError);
      } else {
        console.log('Match exists:', !!matchCheck);
      }
    }
    
    // Check for permission issues
    if (insertError.code === '42501') {
      console.log('This appears to be a permission issue. Check RLS policies.');
    }
  } else {
    console.log('Successfully inserted test score');
    
    // Clean up the test data
    const { error: deleteError } = await supabase
      .from('MatchScore')
      .delete()
      .eq('id', testId);
    
    if (deleteError) {
      console.error('Error deleting test score:', deleteError);
    } else {
      console.log('Successfully deleted test score');
    }
  }
}

testConnection()
  .catch(err => {
    console.error('Unhandled error:', err);
  })
  .finally(() => {
    console.log('Test completed');
  });
