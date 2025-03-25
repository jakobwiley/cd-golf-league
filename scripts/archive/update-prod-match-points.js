#!/usr/bin/env node
/**
 * This script updates the match points in the production database
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Production Supabase URL and key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function updateMatchPoints() {
  try {
    console.log('Updating match points in production database...');
    
    // Update the total match points record
    const { data: updatedMatchPoints, error: updateError } = await supabase
      .from('MatchPoints')
      .update({
        homePoints: 5,
        awayPoints: 4,
        points: 5
      })
      .eq('id', '99d1c9f7-6dd9-4e43-adbc-95a24b8dbdbc')
      .select();
    
    if (updateError) {
      console.error('Error updating match points:', updateError.message);
      return;
    }
    
    console.log('Match points updated successfully:');
    console.log(`- ID: ${updatedMatchPoints[0].id}`);
    console.log(`- Match ID: ${updatedMatchPoints[0].matchId}`);
    console.log(`- Team ID: ${updatedMatchPoints[0].teamId}`);
    console.log(`- Home points: ${updatedMatchPoints[0].homePoints}`);
    console.log(`- Away points: ${updatedMatchPoints[0].awayPoints}`);
    console.log(`- Points: ${updatedMatchPoints[0].points}`);
    
    console.log('\nUpdate completed');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run the function
updateMatchPoints()
  .then(() => {
    console.log('Script completed');
  })
  .catch(error => {
    console.error('Script error:', error);
  });
