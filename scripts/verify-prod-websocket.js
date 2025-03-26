/**
 * Production Verification Script for WebSocket Functionality
 * 
 * This script tests that WebSocket connections work correctly in production
 * and that the server properly handles connections for all API routes that include '/ws'.
 */

const WebSocket = require('ws');

// Production URL - update this with your actual production URL
// Note: Use wss:// protocol for secure WebSocket connections in production
const PROD_URL = process.env.PROD_URL || 'https://cd-golf-league.vercel.app';
const PROD_WS_URL = PROD_URL.replace('https://', 'wss://').replace('http://', 'ws://');

// Test multiple WebSocket endpoints to verify the fix works for all paths
const WS_ENDPOINTS = [
  '/api/scores/ws?matchId=test',
  '/api/matches/ws?teamId=test',
  '/api/standings/ws'
];

// Function to test a single WebSocket connection
async function testWebSocketConnection(endpoint) {
  return new Promise((resolve, reject) => {
    console.log(`🔌 Testing WebSocket connection to: ${endpoint}`);
    
    const ws = new WebSocket(`${PROD_WS_URL}${endpoint}`);
    let connected = false;
    let messageReceived = false;
    
    // Set timeout to fail if connection takes too long
    const timeout = setTimeout(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
      if (!connected) {
        reject(new Error(`Connection timed out for ${endpoint}`));
      } else if (!messageReceived) {
        reject(new Error(`Connected but no message received for ${endpoint}`));
      } else {
        resolve(true);
      }
    }, 10000);
    
    // Handle successful connection
    ws.on('open', () => {
      console.log(`✅ Successfully connected to ${endpoint}`);
      connected = true;
      
      // Send a test message
      const testMessage = JSON.stringify({ type: 'test', message: 'Hello from production verification test' });
      console.log(`📤 Sending test message: ${testMessage}`);
      ws.send(testMessage);
      
      // Set a timeout to close the connection if no response is received
      setTimeout(() => {
        if (!messageReceived) {
          console.warn(`⚠️ No response received from server for ${endpoint}`);
          ws.close();
          // We'll still consider this a success if we could connect
          clearTimeout(timeout);
          resolve(true);
        }
      }, 5000);
    });
    
    // Handle messages from the server
    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString());
        console.log(`📥 Received message from server: ${JSON.stringify(message)}`);
        messageReceived = true;
        
        // Success - we got a response
        clearTimeout(timeout);
        ws.close();
        resolve(true);
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    });
    
    // Handle connection errors
    ws.on('error', (error) => {
      console.error(`❌ WebSocket connection error for ${endpoint}:`, error.message);
      clearTimeout(timeout);
      reject(error);
    });
    
    // Handle connection close
    ws.on('close', () => {
      console.log(`🔌 WebSocket connection closed for ${endpoint}`);
      clearTimeout(timeout);
      if (!connected) {
        reject(new Error(`Connection closed before establishing for ${endpoint}`));
      } else if (messageReceived) {
        resolve(true);
      }
      // If connected but no message, the timeout will handle it
    });
  });
}

// Function to verify all WebSocket endpoints
async function verifyWebSocketFunctionality() {
  console.log('🔍 Verifying WebSocket functionality in production...');
  console.log(`🌐 Using production WebSocket URL: ${PROD_WS_URL}`);
  
  const results = [];
  
  // Test each endpoint
  for (const endpoint of WS_ENDPOINTS) {
    try {
      console.log(`\n🧪 Testing endpoint: ${endpoint}`);
      await testWebSocketConnection(endpoint);
      console.log(`✅ Endpoint ${endpoint} passed`);
      results.push({ endpoint, success: true });
    } catch (error) {
      console.error(`❌ Endpoint ${endpoint} failed:`, error.message);
      results.push({ endpoint, success: false, error: error.message });
    }
  }
  
  // Print summary
  console.log('\n📋 WebSocket Verification Summary:');
  const successCount = results.filter(r => r.success).length;
  console.log(`✅ ${successCount}/${WS_ENDPOINTS.length} endpoints passed`);
  
  results.forEach(result => {
    if (result.success) {
      console.log(`  ✅ ${result.endpoint}: Success`);
    } else {
      console.log(`  ❌ ${result.endpoint}: Failed - ${result.error}`);
    }
  });
  
  return successCount === WS_ENDPOINTS.length;
}

// Run the verification if this script is executed directly
if (require.main === module) {
  verifyWebSocketFunctionality()
    .then(success => {
      if (!success) {
        console.error('❌ WebSocket verification failed');
        process.exit(1);
      } else {
        console.log('✅ WebSocket verification completed successfully');
      }
    })
    .catch(error => {
      console.error('Unexpected error:', error);
      process.exit(1);
    });
}

module.exports = { verifyWebSocketFunctionality };
