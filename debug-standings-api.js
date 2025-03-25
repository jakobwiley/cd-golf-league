#!/usr/bin/env node
/**
 * This script debugs the standings API by directly querying the production database
 * and comparing the results with the API response
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');

// Production Supabase URL and key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Production URL
const PRODUCTION_URL = 'https://cd-golf-league-2025.vercel.app';

// Match ID for Brew/Jake vs Clauss/Wade
const MATCH_ID = 'd0b585dd-09e4-4171-b133-2f5376bcc59a';

async function debugStandingsAPI() {
  try {
    console.log('Debugging standings API...');
    
    // Step 1: Check the match in the database
    console.log('\nStep 1: Checking match in the database');
    const { data: match, error: matchError } = await supabase
      .from('Match')
      .select('*')
      .eq('id', MATCH_ID)
      .single();
    
    if (matchError) {
      console.error('Error fetching match:', matchError.message);
      return;
    }
    
    console.log('Match details:');
    console.log(`- ID: ${match.id}`);
    console.log(`- Status: ${match.status}`);
    console.log(`- Home team ID: ${match.homeTeamId}`);
    console.log(`- Away team ID: ${match.awayTeamId}`);
    
    // Step 2: Check the match points in the database
    console.log('\nStep 2: Checking match points in the database');
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
      console.log('Total match points record found:');
      console.log(`- ID: ${matchPoints[0].id}`);
      console.log(`- Match ID: ${matchPoints[0].matchId}`);
      console.log(`- Team ID: ${matchPoints[0].teamId}`);
      console.log(`- Home points: ${matchPoints[0].homePoints}`);
      console.log(`- Away points: ${matchPoints[0].awayPoints}`);
      console.log(`- Points: ${matchPoints[0].points}`);
    } else {
      console.log('No total match points record found');
    }
    
    // Step 3: Check the teams in the database
    console.log('\nStep 3: Checking teams in the database');
    const { data: homeTeam, error: homeTeamError } = await supabase
      .from('Team')
      .select('*')
      .eq('id', match.homeTeamId)
      .single();
    
    if (homeTeamError) {
      console.error('Error fetching home team:', homeTeamError.message);
      return;
    }
    
    const { data: awayTeam, error: awayTeamError } = await supabase
      .from('Team')
      .select('*')
      .eq('id', match.awayTeamId)
      .single();
    
    if (awayTeamError) {
      console.error('Error fetching away team:', awayTeamError.message);
      return;
    }
    
    console.log('Home team details:');
    console.log(`- ID: ${homeTeam.id}`);
    console.log(`- Name: ${homeTeam.name}`);
    
    console.log('Away team details:');
    console.log(`- ID: ${awayTeam.id}`);
    console.log(`- Name: ${awayTeam.name}`);
    
    // Step 4: Check all match points in the database
    console.log('\nStep 4: Checking all match points in the database');
    const { data: allMatchPoints, error: allMatchPointsError } = await supabase
      .from('MatchPoints')
      .select('*')
      .is('hole', null);
    
    if (allMatchPointsError) {
      console.error('Error fetching all match points:', allMatchPointsError.message);
      return;
    }
    
    console.log(`Found ${allMatchPoints.length} total match points records`);
    
    // Step 5: Check the standings API
    console.log('\nStep 5: Checking standings API');
    try {
      const timestamp = Date.now();
      const standingsResponse = await axios.get(`${PRODUCTION_URL}/api/standings?_=${timestamp}`);
      
      console.log(`Standings API response status: ${standingsResponse.status}`);
      console.log(`Found ${standingsResponse.data.length} teams in standings`);
      
      const brewJakeTeam = standingsResponse.data.find(team => team.teamName === 'Brew/Jake');
      const claussWadeTeam = standingsResponse.data.find(team => team.teamName === 'Clauss/Wade');
      
      if (brewJakeTeam) {
        console.log('\nBrew/Jake team details from API:');
        console.log(`- Matches played: ${brewJakeTeam.matchesPlayed}`);
        console.log(`- Matches won: ${brewJakeTeam.matchesWon}`);
        console.log(`- Matches lost: ${brewJakeTeam.matchesLost}`);
        console.log(`- League points: ${brewJakeTeam.leaguePoints}`);
      } else {
        console.log('Brew/Jake team not found in standings API');
      }
      
      if (claussWadeTeam) {
        console.log('\nClauss/Wade team details from API:');
        console.log(`- Matches played: ${claussWadeTeam.matchesPlayed}`);
        console.log(`- Matches won: ${claussWadeTeam.matchesWon}`);
        console.log(`- Matches lost: ${claussWadeTeam.matchesLost}`);
        console.log(`- League points: ${claussWadeTeam.leaguePoints}`);
      } else {
        console.log('Clauss/Wade team not found in standings API');
      }
    } catch (error) {
      console.error('Error fetching standings API:', error.message);
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Data:', error.response.data);
      }
    }
    
    // Step 6: Check the match API
    console.log('\nStep 6: Checking match API');
    try {
      const timestamp = Date.now();
      const matchResponse = await axios.get(`${PRODUCTION_URL}/api/match/${MATCH_ID}?_=${timestamp}`);
      
      console.log(`Match API response status: ${matchResponse.status}`);
      console.log('Match details from API:');
      console.log(`- Status: ${matchResponse.data.status}`);
      console.log(`- Home team: ${matchResponse.data.homeTeam?.name}`);
      console.log(`- Away team: ${matchResponse.data.awayTeam?.name}`);
      
      if (matchResponse.data.matchPoints) {
        console.log('\nMatch points from API:');
        console.log(`- Total home points: ${matchResponse.data.matchPoints.homePoints}`);
        console.log(`- Total away points: ${matchResponse.data.matchPoints.awayPoints}`);
      } else {
        console.log('\nNo match points found in API');
      }
    } catch (error) {
      console.error('Error fetching match API:', error.message);
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Data:', error.response.data);
      }
    }
    
    console.log('\nDebugging completed');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run the function
debugStandingsAPI()
  .then(() => {
    console.log('Script completed');
  })
  .catch(error => {
    console.error('Script error:', error);
  });
