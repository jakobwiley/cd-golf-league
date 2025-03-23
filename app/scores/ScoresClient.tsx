'use client'

import { useState, useEffect } from 'react'
import { useSocket } from '../../lib/useSocket'
import { SocketEvents } from '../../app/utils/websocketConnection'

// This is a placeholder component for the scores page
// You'll need to implement the actual UI based on your design

export default function ScoresClient({ initialScores, matchId }: { initialScores: any[], matchId: string }) {
  const [scores, setScores] = useState(initialScores)
  const { isConnected, subscribe } = useSocket()

  // Fetch scores from the API
  const fetchScores = async () => {
    try {
      const response = await fetch(`/api/scores?matchId=${matchId}`)
      if (!response.ok) throw new Error('Failed to fetch scores')
      const data = await response.json()
      setScores(data)
    } catch (error) {
      console.error('Error fetching scores:', error)
    }
  }

  // Subscribe to Socket.IO events for real-time updates
  useEffect(() => {
    if (!isConnected) return

    // Subscribe to score updated events
    const unsubscribe = subscribe(SocketEvents.SCORE_UPDATED, (data) => {
      console.log('Score updated event received:', data)
      
      // Only refresh scores if the updated match is the current match
      if (data.matchId === matchId) {
        fetchScores()
      }
    })

    return () => {
      unsubscribe()
    }
  }, [isConnected, matchId])

  return (
    <div>
      <h1>Match Scores</h1>
      {/* Implement your scores UI here */}
      <pre>{JSON.stringify(scores, null, 2)}</pre>
    </div>
  )
} 