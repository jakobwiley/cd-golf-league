'use client'

import { useState, useEffect } from 'react'
import { useSocket } from '../../lib/useSocket'
import { SocketEvents } from '../../lib/socket'

// This is a placeholder component for the teams page
// You'll need to implement the actual UI based on your design

export default function TeamsClient({ initialTeams }: { initialTeams: any[] }) {
  const [teams, setTeams] = useState(initialTeams)
  const { isConnected, subscribe } = useSocket()

  // Fetch teams from the API
  const fetchTeams = async () => {
    try {
      const response = await fetch('/api/teams')
      if (!response.ok) throw new Error('Failed to fetch teams')
      const data = await response.json()
      setTeams(data)
    } catch (error) {
      console.error('Error fetching teams:', error)
    }
  }

  // Subscribe to Socket.IO events for real-time updates
  useEffect(() => {
    if (!isConnected) return

    // Subscribe to team updated events
    const unsubscribe = subscribe(SocketEvents.TEAM_UPDATED, (data) => {
      console.log('Team updated event received:', data)
      fetchTeams()
    })

    return () => {
      unsubscribe()
    }
  }, [isConnected])

  return (
    <div>
      <h1>Teams</h1>
      {/* Implement your teams UI here */}
      <pre>{JSON.stringify(teams, null, 2)}</pre>
    </div>
  )
} 