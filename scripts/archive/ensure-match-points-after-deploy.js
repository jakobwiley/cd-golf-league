#!/usr/bin/env node
/**
 * This script ensures that match points are properly set up after deployment
 * It checks for the Brew/Jake vs Clauss/Wade match and creates the match points record if it doesn't exist
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Supabase URL and key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Match ID for Brew/Jake vs Clauss/Wade
const MATCH_ID = 'd0b585dd-09e4-4171-b133-2f5376bcc59a';

async function ensureMatchPoints() {
  try {
    console.log('Ensuring match points are set up after deployment...');
    
    // Check if the match exists
    console.log(`Checking for match with ID: ${MATCH_ID}`);
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
    
    console.log('Match found:');
    console.log(`- ID: ${match.id}`);
    console.log(`- Status: ${match.status}`);
    console.log(`- Home team ID: ${match.homeTeamId}`);
    console.log(`- Away team ID: ${match.awayTeamId}`);
    
    // Check if match points record exists
    console.log('\nChecking if match points record exists...');
    const { data: matchPoints, error: matchPointsError } = await supabase
      .from('MatchPoints')
      .select('*')
      .eq('matchId', MATCH_ID)
      .is('hole', null);
    
    if (matchPointsError) {
      console.error('Error fetching match points:', matchPointsError.message);
      return;
    }
    
    if (matchPoints && matchPoints.length > 0) {
      console.log('Match points record already exists:');
      console.log(`- ID: ${matchPoints[0].id}`);
      console.log(`- Home points: ${matchPoints[0].homePoints}`);
      console.log(`- Away points: ${matchPoints[0].awayPoints}`);
      
      // Update the match points if they're not correct
      if (matchPoints[0].homePoints !== 5 || matchPoints[0].awayPoints !== 4) {
        console.log('\nUpdating match points to correct values...');
        
        const { data: updatedPoints, error: updateError } = await supabase
          .from('MatchPoints')
          .update({
            homePoints: 5,
            awayPoints: 4,
            points: 5
          })
          .eq('id', matchPoints[0].id)
          .select();
        
        if (updateError) {
          console.error('Error updating match points:', updateError.message);
          return;
        }
        
        console.log('Match points updated successfully:');
        console.log(`- Home points: ${updatedPoints[0].homePoints}`);
        console.log(`- Away points: ${updatedPoints[0].awayPoints}`);
      } else {
        console.log('Match points are already correct');
      }
    } else {
      console.log('No match points record found, creating one...');
      
      // IMPORTANT: Explicitly set hole to null to ensure it's properly stored
      const { data: newPoints, error: createError } = await supabase
        .from('MatchPoints')
        .insert([
          {
            matchId: MATCH_ID,
            teamId: match.homeTeamId,
            hole: null, // Explicitly set to null
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
      
      console.log('Match points record created successfully:');
      console.log(`- ID: ${newPoints[0].id}`);
      console.log(`- Home points: ${newPoints[0].homePoints}`);
      console.log(`- Away points: ${newPoints[0].awayPoints}`);
      
      // Double-check that the record was created with hole=null
      console.log('\nVerifying the match points record...');
      const { data: verifyPoints, error: verifyError } = await supabase
        .from('MatchPoints')
        .select('*')
        .eq('id', newPoints[0].id)
        .single();
      
      if (verifyError) {
        console.error('Error verifying match points:', verifyError.message);
        return;
      }
      
      console.log('Match points record verification:');
      console.log(`- ID: ${verifyPoints.id}`);
      console.log(`- Match ID: ${verifyPoints.matchId}`);
      console.log(`- Team ID: ${verifyPoints.teamId}`);
      console.log(`- Hole: ${verifyPoints.hole === null ? 'NULL' : verifyPoints.hole}`);
      console.log(`- Home points: ${verifyPoints.homePoints}`);
      console.log(`- Away points: ${verifyPoints.awayPoints}`);
      console.log(`- Points: ${verifyPoints.points}`);
    }
    
    // Ensure match status is COMPLETED
    if (match.status !== 'COMPLETED' && match.status !== 'FINALIZED') {
      console.log('\nUpdating match status to COMPLETED...');
      
      const { data: updatedMatch, error: updateMatchError } = await supabase
        .from('Match')
        .update({ status: 'COMPLETED' })
        .eq('id', MATCH_ID)
        .select();
      
      if (updateMatchError) {
        console.error('Error updating match status:', updateMatchError.message);
        return;
      }
      
      console.log('Match status updated successfully:');
      console.log(`- Status: ${updatedMatch[0].status}`);
    } else {
      console.log(`\nMatch status is already ${match.status}`);
    }
    
    console.log('\nMatch points setup completed');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run the function
ensureMatchPoints()
  .then(() => {
    console.log('Script completed');
  })
  .catch(error => {
    console.error('Script error:', error);
  });
