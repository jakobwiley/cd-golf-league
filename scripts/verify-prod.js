/**
 * Production Verification Script
 * 
 * This script runs all production verification tests to ensure
 * that the application is working correctly in production.
 */

const { verifyStandingsAPI } = require('./verify-prod-standings');
const { verifyWebSocketFunctionality } = require('./verify-prod-websocket');

async function verifyProduction() {
  console.log('🚀 Starting production verification tests...');
  console.log('=============================================');
  
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
      allTestsPassed = false;
      console.error('❌ WebSocket functionality verification failed');
    }
  } catch (error) {
    allTestsPassed = false;
    console.error('❌ Error during WebSocket functionality verification:', error);
  }
  
  // Final summary
  console.log('\n=============================================');
  if (allTestsPassed) {
    console.log('✅ All production verification tests passed!');
    console.log('🎉 The application is ready for production use.');
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
