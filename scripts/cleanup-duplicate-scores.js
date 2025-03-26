// Script to clean up duplicate score entries in the database
// This will keep the most recent score for each player, match, and hole combination

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function cleanupDuplicateScores() {
  console.log('Starting duplicate score cleanup...');

  try {
    // 1. Get all match scores
    console.log('Fetching all match scores...');
    const { data: allScores, error: fetchError } = await supabase
      .from('MatchScore')
      .select('*')
      .order('createdAt', { ascending: false });

    if (fetchError) {
      throw new Error(`Error fetching scores: ${fetchError.message}`);
    }

    console.log(`Found ${allScores.length} total score records`);

    // 2. Identify duplicates (same playerId, matchId, hole)
    const scoreMap = new Map();
    const duplicates = [];
    const keysToKeep = new Set();

    allScores.forEach(score => {
      const key = `${score.playerId}-${score.matchId}-${score.hole}`;
      
      if (!scoreMap.has(key)) {
        // First occurrence - keep this one
        scoreMap.set(key, score);
        keysToKeep.add(score.id);
      } else {
        // Duplicate found
        duplicates.push(score);
      }
    });

    console.log(`Found ${duplicates.length} duplicate score records`);

    if (duplicates.length === 0) {
      console.log('No duplicates found. Database is clean.');
      return;
    }

    // 3. Get IDs of duplicates to delete
    const duplicateIds = duplicates.map(score => score.id);
    
    console.log('Duplicate IDs to delete:', duplicateIds);

    // 4. Delete duplicates
    console.log('Deleting duplicate scores...');
    const { error: deleteError } = await supabase
      .from('MatchScore')
      .delete()
      .in('id', duplicateIds);

    if (deleteError) {
      throw new Error(`Error deleting duplicate scores: ${deleteError.message}`);
    }

    console.log(`Successfully deleted ${duplicateIds.length} duplicate score records`);
    
    // Log some stats about the cleanup
    console.log('Cleanup summary:');
    console.log(`- Total scores before cleanup: ${allScores.length}`);
    console.log(`- Duplicate scores removed: ${duplicateIds.length}`);
    console.log(`- Total scores after cleanup: ${allScores.length - duplicateIds.length}`);

  } catch (error) {
    console.error('Error during cleanup:', error);
    process.exit(1);
  }
}

// Run the cleanup
cleanupDuplicateScores()
  .then(() => {
    console.log('Cleanup completed successfully');
    process.exit(0);
  })
  .catch(error => {
    console.error('Cleanup failed:', error);
    process.exit(1);
  });
