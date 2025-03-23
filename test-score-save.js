// Script to test saving a score for a real player
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

// Real player IDs from the database
const jakeId = '6bc61f17-41ba-4e74-8d10-73b261de3de2';
const brewId = '88e50209-c1cd-4342-9a35-122025a8b028';
const matchId = 'd0b585dd-09e4-4171-b133-2f5376bcc59a';

async function testScoreSave() {
  console.log('Testing score save for Jake...');
  
  // Create a test score with a unique ID
  const testId = `test-${Date.now()}`;
  const testScore = {
    id: testId,
    matchId: matchId,
    playerId: jakeId,
    hole: 1,
    score: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  console.log('Inserting score:', testScore);
  
  const { data: insertData, error: insertError } = await supabase
    .from('MatchScore')
    .insert(testScore);
  
  if (insertError) {
    console.error('Error inserting score for Jake:', insertError);
    
    // Check for RLS policy issues
    if (insertError.code === '42501') {
      console.log('This appears to be a permission issue. Checking RLS policies...');
      
      // Try with service role key explicitly
      console.log('Trying with service role key...');
      const serviceSupabase = createClient(
        supabaseUrl,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
        { auth: { persistSession: false } }
      );
      
      const { data: serviceInsertData, error: serviceInsertError } = await serviceSupabase
        .from('MatchScore')
        .insert(testScore);
      
      if (serviceInsertError) {
        console.error('Error with service role key:', serviceInsertError);
      } else {
        console.log('Successfully inserted with service role key');
      }
    }
  } else {
    console.log('Successfully inserted score for Jake');
    
    // Check if the score was actually saved
    const { data: checkData, error: checkError } = await supabase
      .from('MatchScore')
      .select('*')
      .eq('id', testId)
      .single();
    
    if (checkError) {
      console.error('Error checking saved score:', checkError);
    } else {
      console.log('Retrieved saved score:', checkData);
    }
    
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

testScoreSave()
  .catch(err => {
    console.error('Unhandled error:', err);
  })
  .finally(() => {
    console.log('Test completed');
  });
