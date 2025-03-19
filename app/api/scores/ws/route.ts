import { NextRequest } from 'next/server'
import { WebSocket, WebSocketServer } from 'ws'
import { IncomingMessage } from 'http'
import { Duplex } from 'stream'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const matchId = searchParams.get('matchId')

  if (!matchId) {
    return new Response('Match ID is required', { status: 400 })
  }

  // Upgrade the HTTP connection to a WebSocket connection
  if (!process.env.EDGE_RUNTIME) {
    const wss = new WebSocketServer({ noServer: true })

    // Handle WebSocket connection
    wss.on('connection', (ws: WebSocket) => {
      console.log('WebSocket client connected')

      // Send initial message
      ws.send(JSON.stringify({ type: 'connected', matchId }))

      // Handle client messages
      ws.on('message', (message: Buffer) => {
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

    // Upgrade the connection
    const upgrade = request.headers.get('upgrade')
    if (upgrade?.toLowerCase() !== 'websocket') {
      return new Response('Expected websocket', { status: 426 })
    }

    return new Promise<Response>((resolve) => {
      const req = request as unknown as IncomingMessage
      const socket = req.socket as Duplex

      wss.handleUpgrade(req, socket, Buffer.from(''), (ws) => {
        wss.emit('connection', ws, req)
        resolve(new Response(null, { status: 101 }))
      })
    })
  }

  return new Response('WebSocket connections are only supported in development', { status: 400 })
}
