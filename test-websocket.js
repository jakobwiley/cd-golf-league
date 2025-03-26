// Simple WebSocket test script
const WebSocket = require('ws');

// Function to test WebSocket connection
async function testWebSocketConnection() {
  return new Promise((resolve, reject) => {
    console.log('Attempting to connect to WebSocket server...');
    
    // Create WebSocket connection to our server
    const ws = new WebSocket('ws://localhost:3007/api/scores/ws?matchId=test');
    
    // Set timeout to fail if connection takes too long
    const timeout = setTimeout(() => {
      console.error('Connection timed out');
      ws.close();
      reject(new Error('WebSocket connection timed out'));
    }, 5000);
    
    // Handle successful connection
    ws.on('open', () => {
      console.log('Successfully connected to WebSocket server');
      clearTimeout(timeout);
      
      // Send a test message
      const testMessage = JSON.stringify({ type: 'test', message: 'Hello from test client' });
      console.log('Sending test message:', testMessage);
      ws.send(testMessage);
      
      // Set a timeout to close the connection after a short delay
      setTimeout(() => {
        console.log('Test completed successfully');
        ws.close();
        resolve(true);
      }, 2000);
    });
    
    // Handle messages from the server
    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString());
        console.log('Received message from server:', message);
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    });
    
    // Handle connection errors
    ws.on('error', (error) => {
      console.error('WebSocket connection error:', error);
      clearTimeout(timeout);
      reject(error);
    });
    
    // Handle connection close
    ws.on('close', () => {
      console.log('WebSocket connection closed');
    });
  });
}

// Run the test
console.log('Starting WebSocket connection test');
testWebSocketConnection()
  .then(() => {
    console.log('WebSocket test completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('WebSocket test failed:', error);
    process.exit(1);
  });
