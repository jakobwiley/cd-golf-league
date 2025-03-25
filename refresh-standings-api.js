#!/usr/bin/env node
/**
 * Script to refresh the standings API
 * This script can be used to force a refresh of the standings API in both local and production environments
 */

require('dotenv').config();
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function main() {
  try {
    console.log('Starting standings API refresh...');
    
    // Add timestamp to force cache refresh
    const timestamp = new Date().getTime();
    
    // Get site URL from environment or use default production URL
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cd-golf-league.vercel.app';
    
    // Try both local and production URLs
    const urls = [
      siteUrl,                           // Production or configured URL
      'http://localhost:3007',           // Local development server (port 3007)
      'http://localhost:3000',           // Alternative local development server
      'https://cd-golf-league.vercel.app' // Hardcoded production URL as fallback
    ];
    
    let success = false;
    
    for (const baseUrl of urls) {
      try {
        console.log(`\nAttempting to refresh standings API at ${baseUrl}...`);
        
        // Refresh standings API
        console.log(`Refreshing standings API at ${baseUrl}/api/standings?refresh=${timestamp}`);
        const standingsResponse = await fetch(`${baseUrl}/api/standings?refresh=${timestamp}`);
        
        if (standingsResponse.ok) {
          console.log(`✅ Successfully refreshed standings API at ${baseUrl}`);
          
          // Get the response data to verify it's working
          const standingsData = await standingsResponse.json();
          console.log(`Received standings data for ${standingsData.length} teams`);
          
          // Refresh player standings API
          console.log(`Refreshing player standings API at ${baseUrl}/api/player-standings?refresh=${timestamp}`);
          const playerResponse = await fetch(`${baseUrl}/api/player-standings?refresh=${timestamp}`);
          
          if (playerResponse.ok) {
            console.log(`✅ Successfully refreshed player standings API at ${baseUrl}`);
            const playerData = await playerResponse.json();
            console.log(`Received player standings data for ${playerData.length} players`);
            success = true;
            break; // Exit the loop if successful
          } else {
            console.warn(`⚠️ Failed to refresh player standings API at ${baseUrl}: ${playerResponse.status} ${playerResponse.statusText}`);
          }
        } else {
          console.warn(`⚠️ Failed to refresh standings API at ${baseUrl}: ${standingsResponse.status} ${standingsResponse.statusText}`);
        }
      } catch (error) {
        console.warn(`⚠️ Error refreshing APIs at ${baseUrl}: ${error.message}`);
      }
    }
    
    if (success) {
      console.log('\n✅ Successfully refreshed standings APIs');
    } else {
      console.error('\n❌ Failed to refresh standings APIs on all attempted URLs');
      process.exit(1);
    }
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
