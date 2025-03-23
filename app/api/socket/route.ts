import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';
import { SocketEvents } from '../../../app/utils/websocketConnection';

export async function GET() {
  try {
    // Subscribe to Supabase realtime changes
    const subscription = supabase
      .channel('any')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public',
        table: 'Match'
      }, (payload) => {
        // Emit match updates to all connected clients using WebSocket
        const wsUrl = process.env.NEXT_PUBLIC_VERCEL_URL 
          ? `wss://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/socket`
          : 'wss://cd-golf-league.vercel.app/api/socket'

        const ws = new WebSocket(wsUrl)
        ws.on('open', () => {
          ws.send(JSON.stringify({
            event: SocketEvents.MATCH_UPDATED,
            data: payload.new
          }))
          ws.close()
        })
        ws.on('error', (error) => {
          console.error('WebSocket error:', error)
        })
      })
      .subscribe()

    return NextResponse.json({ message: 'Socket connection established' })
  } catch (error) {
    console.error('Socket error:', error)
    return NextResponse.json(
      { error: 'Failed to establish socket connection' },
      { status: 500 }
    )
  }
}
