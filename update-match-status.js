// Script to update match status to lowercase 'completed'
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateMatchStatus() {
  const matchId = 'd0b585dd-09e4-4171-b133-2f5376bcc59a';
  
  console.log(`Updating match status for match ID: ${matchId}`);
  
  const { data, error } = await supabase
    .from('Match')
    .update({ status: 'completed' })
    .eq('id', matchId);
  
  if (error) {
    console.error('Error updating match status:', error);
    process.exit(1);
  }
  
  console.log('Match status updated successfully to "completed"');
  
  // Verify the update
  const { data: match, error: fetchError } = await supabase
    .from('Match')
    .select('*')
    .eq('id', matchId)
    .single();
  
  if (fetchError) {
    console.error('Error fetching updated match:', fetchError);
    process.exit(1);
  }
  
  console.log('Updated match:', match);
}

updateMatchStatus()
  .catch(err => {
    console.error('Unexpected error:', err);
    process.exit(1);
  });
