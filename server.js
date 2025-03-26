const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const WebSocket = require('ws')
const { execSync } = require('child_process')
const path = require('path')
const fs = require('fs')

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = process.env.PORT || 3007
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

// Ensure CSS is built before starting the server in development mode
if (dev) {
  try {
    console.log('Ensuring CSS is built for development...')
    // Check if the CSS rebuild script exists
    const cssRebuildPath = path.join(__dirname, 'scripts', 'rebuild-css.js')
    if (fs.existsSync(cssRebuildPath)) {
      execSync('node scripts/rebuild-css.js', { stdio: 'inherit' })
      console.log('CSS rebuild completed')
    } else {
      console.log('CSS rebuild script not found, skipping')
    }
  } catch (error) {
    console.error('Error rebuilding CSS:', error.message)
    // Continue anyway to not block development
  }
}

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('Internal server error')
    }
  })

  // Initialize WebSocket server
  const wss = new WebSocket.Server({ noServer: true })

  // WebSocket connection handler with improved error handling
  wss.on('connection', (ws, req) => {
    console.log('WebSocket client connected')
    
    try {
      const { searchParams } = new URL(req.url, `http://${req.headers.host}`)
      const matchId = searchParams.get('matchId')
      const teamId = searchParams.get('teamId')
      
      // Log connection details for debugging
      console.log(`WebSocket connection established: ${req.url}`)
      if (matchId) console.log(`Match ID: ${matchId}`)
      if (teamId) console.log(`Team ID: ${teamId}`)

      // Send initial message with connection details
      ws.send(JSON.stringify({ 
        type: 'connected', 
        timestamp: new Date().toISOString(),
        path: req.url,
        matchId,
        teamId
      }))

      // Handle client messages
      ws.on('message', (message) => {
        try {
          const data = JSON.parse(message.toString())
          console.log('Received message:', data)
          
          // Echo back the message to confirm receipt
          ws.send(JSON.stringify({
            type: 'echo',
            originalMessage: data,
            timestamp: new Date().toISOString()
          }))
        } catch (error) {
          console.error('Error processing message:', error)
          ws.send(JSON.stringify({ 
            type: 'error', 
            message: 'Failed to process message',
            error: error.message
          }))
        }
      })

      // Handle errors
      ws.on('error', (error) => {
        console.error('WebSocket error:', error)
      })

      // Handle client disconnection
      ws.on('close', (code, reason) => {
        console.log(`Client disconnected. Code: ${code}, Reason: ${reason || 'No reason provided'}`)
      })
    } catch (error) {
      console.error('Error in WebSocket connection handler:', error)
      ws.send(JSON.stringify({ 
        type: 'error', 
        message: 'Connection setup error',
        error: error.message
      }))
    }
  })

  // Handle WebSocket upgrade with improved path handling
  server.on('upgrade', (request, socket, head) => {
    try {
      const { pathname } = parse(request.url)
      
      // Log upgrade request for debugging
      console.log(`WebSocket upgrade request: ${pathname}`)

      // Check if this is a WebSocket API route
      if (pathname.startsWith('/api/') && pathname.includes('/ws')) {
        wss.handleUpgrade(request, socket, head, (ws) => {
          wss.emit('connection', ws, request)
        })
      } else {
        console.log(`Not a WebSocket path: ${pathname}`)
        socket.destroy()
      }
    } catch (error) {
      console.error('Error handling WebSocket upgrade:', error)
      socket.destroy()
    }
  })

  server.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`)
    console.log(`> WebSocket server is listening for connections on paths containing '/ws'`)
    console.log(`> Environment: ${process.env.NODE_ENV}`)
  })
})
