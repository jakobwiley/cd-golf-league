#!/usr/bin/env node
/**
 * This script checks all match points records in the production database
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Production Supabase URL and key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAllMatchPoints() {
  try {
    console.log('Checking all match points in production database...');
    
    // Get all match points records
    const { data: allMatchPoints, error: allMatchPointsError } = await supabase
      .from('MatchPoints')
      .select('*');
    
    if (allMatchPointsError) {
      console.error('Error fetching all match points:', allMatchPointsError.message);
      return;
    }
    
    console.log(`Found ${allMatchPoints.length} total match points records`);
    
    // Log all match points records
    allMatchPoints.forEach((mp, index) => {
      console.log(`\nMatch Points Record #${index + 1}:`);
      console.log(`- ID: ${mp.id}`);
      console.log(`- Match ID: ${mp.matchId}`);
      console.log(`- Team ID: ${mp.teamId}`);
      console.log(`- Hole: ${mp.hole === null ? 'NULL' : mp.hole}`);
      console.log(`- Home Points: ${mp.homePoints}`);
      console.log(`- Away Points: ${mp.awayPoints}`);
      console.log(`- Points: ${mp.points}`);
      console.log(`- Created At: ${mp.createdAt}`);
    });
    
    // Find the match points record for the specific match
    const brewJakeMatchPoints = allMatchPoints.filter(mp => mp.matchId === 'd0b585dd-09e4-4171-b133-2f5376bcc59a');
    
    console.log(`\nFound ${brewJakeMatchPoints.length} match points records for Brew/Jake vs Clauss/Wade match`);
    
    // Check if there's a record with hole = null
    const totalMatchPoints = brewJakeMatchPoints.filter(mp => mp.hole === null);
    
    console.log(`Found ${totalMatchPoints.length} total match points records (hole is null) for Brew/Jake vs Clauss/Wade match`);
    
    // If no total match points record found, create one
    if (totalMatchPoints.length === 0) {
      console.log('\nNo total match points record found, creating one...');
      
      // Get the match details first
      const { data: match, error: matchError } = await supabase
        .from('Match')
        .select('*')
        .eq('id', 'd0b585dd-09e4-4171-b133-2f5376bcc59a')
        .single();
      
      if (matchError) {
        console.error('Error fetching match:', matchError.message);
        return;
      }
      
      // Create the total match points record
      const { data: newMatchPoints, error: createError } = await supabase
        .from('MatchPoints')
        .insert([
          {
            matchId: match.id,
            teamId: match.homeTeamId,
            hole: null,
            homePoints: 5,
            awayPoints: 4,
            points: 5
          }
        ])
        .select();
      
      if (createError) {
        console.error('Error creating match points:', createError.message);
        return;
      }
      
      console.log('Total match points record created successfully:');
      console.log(`- ID: ${newMatchPoints[0].id}`);
      console.log(`- Match ID: ${newMatchPoints[0].matchId}`);
      console.log(`- Team ID: ${newMatchPoints[0].teamId}`);
      console.log(`- Home points: ${newMatchPoints[0].homePoints}`);
      console.log(`- Away points: ${newMatchPoints[0].awayPoints}`);
      console.log(`- Points: ${newMatchPoints[0].points}`);
    }
    
    console.log('\nCheck completed');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run the function
checkAllMatchPoints()
  .then(() => {
    console.log('Script completed');
  })
  .catch(error => {
    console.error('Script error:', error);
  });
