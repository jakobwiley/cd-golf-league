const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const WebSocket = require('ws')

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = 3007
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

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

  // Handle WebSocket connection
  wss.on('connection', (ws, req) => {
    console.log('WebSocket client connected')
    const { searchParams } = new URL(req.url, `http://${req.headers.host}`)
    const matchId = searchParams.get('matchId')

    // Send initial message
    ws.send(JSON.stringify({ type: 'connected', matchId }))

    // Handle client messages
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString())
        console.log('Received:', data)
      } catch (error) {
        console.error('Error parsing message:', error)
      }
    })

    // Handle client disconnection
    ws.on('close', () => {
      console.log('Client disconnected')
    })
  })

  // Handle upgrade requests
  server.on('upgrade', (request, socket, head) => {
    const { pathname } = parse(request.url)

    if (pathname.startsWith('/api/scores/ws')) {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request)
      })
    } else {
      socket.destroy()
    }
  })

  server.listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://${hostname}:${port}`)
  })
})
