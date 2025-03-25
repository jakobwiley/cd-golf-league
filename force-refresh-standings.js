#!/usr/bin/env node
/**
 * This script forces a refresh of the standings data by making a request to the API
 * with a cache-busting query parameter
 */

require('dotenv').config();
const axios = require('axios');

const PRODUCTION_URL = 'https://cd-golf-league-2025.vercel.app';

async function forceRefreshStandings() {
  try {
    console.log('Forcing refresh of standings data...');
    
    // Add a timestamp query parameter to bust the cache
    const timestamp = Date.now();
    
    // Make a request to the standings API
    console.log('Requesting standings API with cache-busting...');
    const standingsResponse = await axios.get(`${PRODUCTION_URL}/api/standings?_=${timestamp}`);
    
    console.log(`Standings API response status: ${standingsResponse.status}`);
    console.log(`Found ${standingsResponse.data.length} teams in standings`);
    
    // Check Brew/Jake and Clauss/Wade teams
    const brewJakeTeam = standingsResponse.data.find(team => team.teamName === 'Brew/Jake');
    const claussWadeTeam = standingsResponse.data.find(team => team.teamName === 'Clauss/Wade');
    
    if (brewJakeTeam) {
      console.log('\nBrew/Jake team details:');
      console.log(`- Matches played: ${brewJakeTeam.matchesPlayed}`);
      console.log(`- Matches won: ${brewJakeTeam.matchesWon}`);
      console.log(`- Matches lost: ${brewJakeTeam.matchesLost}`);
      console.log(`- League points: ${brewJakeTeam.leaguePoints}`);
    } else {
      console.log('Brew/Jake team not found in standings');
    }
    
    if (claussWadeTeam) {
      console.log('\nClauss/Wade team details:');
      console.log(`- Matches played: ${claussWadeTeam.matchesPlayed}`);
      console.log(`- Matches won: ${claussWadeTeam.matchesWon}`);
      console.log(`- Matches lost: ${claussWadeTeam.matchesLost}`);
      console.log(`- League points: ${claussWadeTeam.leaguePoints}`);
    } else {
      console.log('Clauss/Wade team not found in standings');
    }
    
    // Make a request to the match API for the specific match
    console.log('\nRequesting match details with cache-busting...');
    const matchResponse = await axios.get(`${PRODUCTION_URL}/api/match/d0b585dd-09e4-4171-b133-2f5376bcc59a?_=${timestamp}`);
    
    console.log(`Match API response status: ${matchResponse.status}`);
    console.log('Match details:');
    console.log(`- Status: ${matchResponse.data.status}`);
    console.log(`- Home team: ${matchResponse.data.homeTeam?.name}`);
    console.log(`- Away team: ${matchResponse.data.awayTeam?.name}`);
    
    if (matchResponse.data.matchPoints) {
      console.log('\nMatch points:');
      console.log(`- Total home points: ${matchResponse.data.matchPoints.homePoints}`);
      console.log(`- Total away points: ${matchResponse.data.matchPoints.awayPoints}`);
    } else {
      console.log('\nNo match points found');
    }
    
    console.log('\nRefresh completed');
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

// Run the function
forceRefreshStandings()
  .then(() => {
    console.log('Script completed');
  })
  .catch(error => {
    console.error('Script error:', error);
  });
