const WebSocket = require('ws');
const http = require('http');
const { parse } = require('url');
const { createServer } = require('http');
const { setTimeout } = require('timers/promises');

// Mock server setup
const setupMockServer = () => {
  return new Promise((resolve) => {
    // Create HTTP server
    const server = createServer((req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Mock server running');
    });

    // Create WebSocket server
    const wss = new WebSocket.Server({ server });

    // Handle WebSocket connections
    wss.on('connection', (ws, req) => {
      console.log('WebSocket client connected to test server');
      
      // Send a welcome message
      ws.send(JSON.stringify({ type: 'connected', message: 'Welcome to the test server' }));
      
      // Echo back any messages received
      ws.on('message', (message) => {
        try {
          const data = JSON.parse(message.toString());
          console.log('Test server received:', data);
          
          // Echo back the message with a type
          ws.send(JSON.stringify({ 
            type: 'echo', 
            originalMessage: data,
            timestamp: new Date().toISOString()
          }));
        } catch (error) {
          console.error('Error parsing message in test server:', error);
        }
      });
    });

    // Start the server on a random port
    server.listen(0, () => {
      const port = server.address().port;
      console.log(`Mock WebSocket server running on port ${port}`);
      resolve({ server, port, wss });
    });
  });
};

describe('WebSocket Functionality', () => {
  let mockServer;
  let mockPort;
  let mockWss;
  
  beforeAll(async () => {
    // Set up mock server
    const serverSetup = await setupMockServer();
    mockServer = serverSetup.server;
    mockPort = serverSetup.port;
    mockWss = serverSetup.wss;
  });
  
  afterAll(() => {
    // Clean up
    if (mockServer) {
      mockServer.close();
    }
  });
  
  test('WebSocket client can connect and receive messages', async () => {
    return new Promise((resolve, reject) => {
      // Create a client WebSocket connection
      const ws = new WebSocket(`ws://localhost:${mockPort}`);
      
      // Set up event handlers
      ws.on('open', () => {
        console.log('Client connected to test server');
        
        // Send a test message
        ws.send(JSON.stringify({ type: 'test', message: 'Hello from client' }));
      });
      
      // Track received messages
      const receivedMessages = [];
      
      ws.on('message', (data) => {
        try {
          const message = JSON.parse(data.toString());
          console.log('Client received:', message);
          receivedMessages.push(message);
          
          // If we've received both the welcome message and the echo
          if (receivedMessages.length >= 2) {
            // Check welcome message
            expect(receivedMessages[0].type).toBe('connected');
            expect(receivedMessages[0].message).toBe('Welcome to the test server');
            
            // Check echo message
            expect(receivedMessages[1].type).toBe('echo');
            expect(receivedMessages[1].originalMessage.type).toBe('test');
            expect(receivedMessages[1].originalMessage.message).toBe('Hello from client');
            
            // Close the connection and resolve the test
            ws.close();
            resolve();
          }
        } catch (error) {
          reject(error);
        }
      });
      
      ws.on('error', (error) => {
        console.error('WebSocket client error:', error);
        reject(error);
      });
      
      // Set a timeout to fail the test if it takes too long
      setTimeout(10000).then(() => {
        if (receivedMessages.length < 2) {
          ws.close();
          reject(new Error('Test timed out waiting for WebSocket messages'));
        }
      });
    });
  });
  
  test('WebSocket server handles multiple clients', async () => {
    return new Promise(async (resolve, reject) => {
      // Create two client connections
      const ws1 = new WebSocket(`ws://localhost:${mockPort}`);
      const ws2 = new WebSocket(`ws://localhost:${mockPort}`);
      
      const clients = [
        { ws: ws1, connected: false, welcomed: false, echoed: false },
        { ws: ws2, connected: false, welcomed: false, echoed: false }
      ];
      
      // Set up handlers for both clients
      clients.forEach((client, index) => {
        client.ws.on('open', () => {
          console.log(`Client ${index + 1} connected`);
          client.connected = true;
          
          // Send a unique message from each client
          client.ws.send(JSON.stringify({ 
            type: 'test', 
            message: `Hello from client ${index + 1}`,
            clientId: index + 1
          }));
        });
        
        client.ws.on('message', (data) => {
          try {
            const message = JSON.parse(data.toString());
            console.log(`Client ${index + 1} received:`, message);
            
            if (message.type === 'connected') {
              client.welcomed = true;
            } else if (message.type === 'echo' && message.originalMessage.clientId === index + 1) {
              client.echoed = true;
              
              // Check if both clients have completed their exchanges
              if (clients.every(c => c.connected && c.welcomed && c.echoed)) {
                // Close all connections
                clients.forEach(c => c.ws.close());
                resolve();
              }
            }
          } catch (error) {
            reject(error);
          }
        });
        
        client.ws.on('error', (error) => {
          console.error(`Client ${index + 1} error:`, error);
          reject(error);
        });
      });
      
      // Set a timeout to fail the test if it takes too long
      setTimeout(10000).then(() => {
        if (!clients.every(c => c.connected && c.welcomed && c.echoed)) {
          clients.forEach(c => c.ws.close());
          reject(new Error('Test timed out waiting for all WebSocket exchanges'));
        }
      });
    });
  });
});
