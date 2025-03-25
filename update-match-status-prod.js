#!/usr/bin/env node
/**
 * This script checks and updates the match status in the production database
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Production Supabase URL and key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Match ID for Brew/Jake vs Clauss/Wade
const MATCH_ID = 'd0b585dd-09e4-4171-b133-2f5376bcc59a';

async function updateMatchStatus() {
  try {
    console.log('Checking match status in production database...');
    
    // Check if the match exists
    const { data: match, error: matchError } = await supabase
      .from('Match')
      .select('*')
      .eq('id', MATCH_ID)
      .single();
    
    if (matchError) {
      console.error('Error fetching match:', matchError.message);
      return;
    }
    
    if (!match) {
      console.log('Match not found');
      return;
    }
    
    console.log('Match details:');
    console.log(`- ID: ${match.id}`);
    console.log(`- Status: ${match.status}`);
    console.log(`- Home team ID: ${match.homeTeamId}`);
    console.log(`- Away team ID: ${match.awayTeamId}`);
    
    // Check if the match status is FINALIZED or COMPLETED
    const isCompleted = match.status === 'COMPLETED' || 
                        match.status === 'FINALIZED' || 
                        match.status?.toLowerCase() === 'completed' || 
                        match.status?.toLowerCase() === 'finalized';
    
    if (!isCompleted) {
      console.log('\nMatch status is not COMPLETED or FINALIZED, updating to FINALIZED...');
      
      const { data: updatedMatch, error: updateError } = await supabase
        .from('Match')
        .update({ status: 'FINALIZED' })
        .eq('id', match.id)
        .select();
      
      if (updateError) {
        console.error('Error updating match status:', updateError.message);
        return;
      }
      
      console.log('Match status updated to FINALIZED successfully');
      console.log(`- New status: ${updatedMatch[0].status}`);
    } else {
      console.log(`\nMatch status is already ${match.status}`);
    }
    
    // Check the match points
    console.log('\nChecking match points...');
    const { data: matchPoints, error: matchPointsError } = await supabase
      .from('MatchPoints')
      .select('*')
      .eq('matchId', match.id)
      .is('hole', null);
    
    if (matchPointsError) {
      console.error('Error fetching match points:', matchPointsError.message);
      return;
    }
    
    if (matchPoints && matchPoints.length > 0) {
      console.log('Total match points record found:');
      console.log(`- ID: ${matchPoints[0].id}`);
      console.log(`- Match ID: ${matchPoints[0].matchId}`);
      console.log(`- Team ID: ${matchPoints[0].teamId}`);
      console.log(`- Home points: ${matchPoints[0].homePoints}`);
      console.log(`- Away points: ${matchPoints[0].awayPoints}`);
      console.log(`- Points: ${matchPoints[0].points}`);
      
      // Ensure the points are correct (5 for home, 4 for away)
      if (matchPoints[0].homePoints !== 5 || matchPoints[0].awayPoints !== 4 || matchPoints[0].points !== 5) {
        console.log('\nMatch points are incorrect, updating...');
        
        const { data: updatedMatchPoints, error: updatePointsError } = await supabase
          .from('MatchPoints')
          .update({
            homePoints: 5,
            awayPoints: 4,
            points: 5
          })
          .eq('id', matchPoints[0].id)
          .select();
        
        if (updatePointsError) {
          console.error('Error updating match points:', updatePointsError.message);
          return;
        }
        
        console.log('Match points updated successfully:');
        console.log(`- Home points: ${updatedMatchPoints[0].homePoints}`);
        console.log(`- Away points: ${updatedMatchPoints[0].awayPoints}`);
        console.log(`- Points: ${updatedMatchPoints[0].points}`);
      } else {
        console.log('\nMatch points are already correct');
      }
    } else {
      console.log('\nNo total match points record found');
      
      // Create the total match points record
      console.log('\nCreating total match points record...');
      
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
    
    console.log('\nUpdate completed');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run the function
updateMatchStatus()
  .then(() => {
    console.log('Script completed');
  })
  .catch(error => {
    console.error('Script error:', error);
  });
