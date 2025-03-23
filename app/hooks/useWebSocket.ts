'use client'

import { useEffect, useRef } from 'react'

export function useWebSocket(url: string | null) {
  const ws = useRef<WebSocket | null>(null)

  useEffect(() => {
    // If URL is null or empty, don't create a WebSocket
    if (!url) {
      return;
    }
    
    // Convert http(s) to ws(s)
    const wsUrl = url.replace(/^http/, 'ws')
    const fullUrl = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}${wsUrl}`
    
    ws.current = new WebSocket(fullUrl)

    ws.current.onopen = () => {
      console.log('WebSocket connected')
    }

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error)
    }

    return () => {
      if (ws.current) {
        ws.current.close()
      }
    }
  }, [url])

  return ws.current
}