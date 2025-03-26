/**
 * Script to fix the status of a specific match in production
 * that is incorrectly marked as COMPLETED/FINALIZED when all holes are not filled
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Match ID to fix
const MATCH_ID = '97e38f37-b5cd-4604-a60d-8f08183345d2';

// Create Supabase client with production credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials. Please check your .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixMatchStatus() {
  console.log(`🔧 Fixing match status for ID: ${MATCH_ID}`);
  
  try {
    // First, get the current match details
    const { data: match, error: fetchError } = await supabase
      .from('Match')
      .select('*')
      .eq('id', MATCH_ID)
      .single();
    
    if (fetchError) {
      throw new Error(`Failed to fetch match: ${fetchError.message}`);
    }
    
    if (!match) {
      throw new Error(`Match not found with ID: ${MATCH_ID}`);
    }
    
    console.log(`\n📋 Current Match Details:`);
    console.log(`- ID: ${match.id}`);
    console.log(`- Date: ${match.date}`);
    console.log(`- Current Status: ${match.status}`);
    
    // Check if the status is already correct
    if (match.status.toLowerCase() !== 'completed' && match.status.toLowerCase() !== 'finalized') {
      console.log(`\n✅ Match status is already correct (${match.status}). No action needed.`);
      return { success: true, message: 'No action needed' };
    }
    
    // Update the match status to IN_PROGRESS
    const { data: updatedMatch, error: updateError } = await supabase
      .from('Match')
      .update({ status: 'IN_PROGRESS' })
      .eq('id', MATCH_ID)
      .select()
      .single();
    
    if (updateError) {
      throw new Error(`Failed to update match: ${updateError.message}`);
    }
    
    console.log(`\n✅ Match status updated successfully!`);
    console.log(`- Previous Status: ${match.status}`);
    console.log(`- New Status: ${updatedMatch.status}`);
    
    // Refresh the standings API to reflect the changes
    console.log(`\n🔄 Refreshing standings API...`);
    
    // Make a request to the standings API to refresh the cache
    const standingsResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3007'}/api/standings?refresh=true`);
    const playerStandingsResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3007'}/api/player-standings?refresh=true`);
    
    if (!standingsResponse.ok || !playerStandingsResponse.ok) {
      console.warn(`⚠️ Failed to refresh standings API. You may need to manually refresh the cache.`);
    } else {
      console.log(`✅ Standings API refreshed successfully!`);
    }
    
    return { 
      success: true, 
      previousStatus: match.status,
      newStatus: updatedMatch.status
    };
    
  } catch (error) {
    console.error('❌ Error fixing match status:', error);
    return { success: false, error: error.message };
  }
}

// Run the fix if this script is executed directly
if (require.main === module) {
  fixMatchStatus()
    .then(result => {
      if (!result.success) {
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('Unexpected error:', error);
      process.exit(1);
    });
}

module.exports = { fixMatchStatus };
