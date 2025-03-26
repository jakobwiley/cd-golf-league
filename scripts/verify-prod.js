/**
 * Production Verification Script
 * 
 * This script runs all production verification tests to ensure
 * that the application is working correctly in production.
 */

const { verifyStandingsAPI } = require('./verify-prod-standings');
const { verifyWebSocketFunctionality } = require('./verify-prod-websocket');
const fetch = require('node-fetch');

// Verify that the REST API endpoints are working correctly
// This serves as a fallback when WebSockets aren't available
async function verifyRESTAPIFallback(prodUrl) {
  console.log('🔍 Verifying REST API endpoints for fallback functionality...');
  console.log(`🌐 Using production URL: ${prodUrl}`);
  
  try {
    // Test the scores API
    console.log('\n📊 Testing /api/scores endpoint...');
    const scoresResponse = await fetch(`${prodUrl}/api/scores?matchId=test`);
    
    if (!scoresResponse.ok) {
      console.error(`❌ Scores API returned status ${scoresResponse.status}`);
      return false;
    }
    
    console.log(`✅ Scores API is accessible for polling fallback`);
    
    // Test the matches API
    console.log('\n🏆 Testing /api/matches endpoint...');
    const matchesResponse = await fetch(`${prodUrl}/api/matches?teamId=test`);
    
    if (!matchesResponse.ok) {
      console.error(`❌ Matches API returned status ${matchesResponse.status}`);
      return false;
    }
    
    console.log(`✅ Matches API is accessible for polling fallback`);
    
    console.log('\n✅ REST API fallback verification completed successfully');
    return true;
  } catch (error) {
    console.error('❌ Error verifying REST API fallback:', error);
    return false;
  }
}

async function verifyProduction() {
  console.log('🚀 Starting production verification tests...');
  console.log('=============================================');
  
  const prodUrl = process.env.PROD_URL || 'https://cd-golf-league.vercel.app';
  let allTestsPassed = true;
  
  // Verify Standings API
  console.log('\n📊 STANDINGS API VERIFICATION');
  console.log('-----------------------------');
  try {
    const standingsResult = await verifyStandingsAPI();
    if (!standingsResult) {
      allTestsPassed = false;
      console.error('❌ Standings API verification failed');
    }
  } catch (error) {
    allTestsPassed = false;
    console.error('❌ Error during Standings API verification:', error);
  }
  
  // Verify WebSocket Functionality
  console.log('\n🔌 WEBSOCKET FUNCTIONALITY VERIFICATION');
  console.log('-------------------------------------');
  try {
    const websocketResult = await verifyWebSocketFunctionality();
    if (!websocketResult) {
      console.warn('⚠️ WebSocket functionality verification failed');
      console.log('ℹ️ This is expected in some environments like Vercel. Checking fallback mechanism...');
      
      // If WebSockets fail, verify the REST API fallback
      const fallbackResult = await verifyRESTAPIFallback(prodUrl);
      if (!fallbackResult) {
        allTestsPassed = false;
        console.error('❌ REST API fallback verification failed');
      } else {
        console.log('✅ REST API fallback is working correctly');
      }
    }
  } catch (error) {
    // Don't fail the entire verification if WebSockets aren't supported
    console.error('❌ Error during WebSocket functionality verification:', error);
    console.log('ℹ️ Checking fallback mechanism...');
    
    // If WebSockets fail, verify the REST API fallback
    const fallbackResult = await verifyRESTAPIFallback(prodUrl);
    if (!fallbackResult) {
      allTestsPassed = false;
      console.error('❌ REST API fallback verification failed');
    } else {
      console.log('✅ REST API fallback is working correctly');
    }
  }
  
  // Final summary
  console.log('\n=============================================');
  if (allTestsPassed) {
    console.log('✅ All production verification tests passed!');
    console.log('🎉 The application is ready for production use.');
    console.log('ℹ️ Note: WebSockets may not be fully supported in the production environment,');
    console.log('   but the application will automatically fall back to polling for realtime updates.');
  } else {
    console.error('❌ Some production verification tests failed.');
    console.error('⚠️ Please review the logs and fix any issues before proceeding.');
  }
  
  return allTestsPassed;
}

// Run the verification if this script is executed directly
if (require.main === module) {
  verifyProduction()
    .then(success => {
      if (!success) {
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('Unexpected error:', error);
      process.exit(1);
    });
}

module.exports = { verifyProduction };
