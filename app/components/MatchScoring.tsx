'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { format } from 'date-fns'
import { calculateNetScore, holeHandicaps } from '../lib/handicap'
import { useWebSocket } from '../hooks/useWebSocket'

interface Player {
  id: string
  name: string
  handicapIndex: number
  teamId: string
}

interface Team {
  id: string
  name: string
  players?: Player[]
}

interface Match {
  id: string
  date: string
  weekNumber: number
  homeTeamId: string
  awayTeamId: string
  homeTeam: Team
  awayTeam: Team
  startingHole: number
  status: string
}

interface Score {
  id?: string
  matchId: string
  playerId: string
  grossScore: number
  netScore?: number
  player?: Player
}

interface MatchScoringProps {
  match?: Match
}

export default function MatchScoring({ match }: MatchScoringProps) {
  const [scores, setScores] = useState<Score[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [homeTeamPlayers, setHomeTeamPlayers] = useState<Player[]>([])
  const [awayTeamPlayers, setAwayTeamPlayers] = useState<Player[]>([])
  const socket = useWebSocket(`/api/scores/ws?matchId=${match?.id}`)

  // Array of holes 1-9
  const holes = Array.from({ length: 9 }, (_, i) => i + 1)

  // Par values for each hole
  const parValues = {
    1: 4,
    2: 4,
    3: 3,
    4: 4,
    5: 5,
    6: 3,
    7: 4,
    8: 5,
    9: 4
  }

  // If no match is provided, show a message
  if (!match) {
    return <div className="text-center p-4 text-white">No match selected</div>
  }

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setLoading(true)
        
        // Fetch home team players
        const homeResponse = await fetch(`/api/teams/${match.homeTeamId}`)
        const homeData = await homeResponse.json()
        
        // Fetch away team players
        const awayResponse = await fetch(`/api/teams/${match.awayTeamId}`)
        const awayData = await awayResponse.json()
        
        if (homeData.players) {
          setHomeTeamPlayers(homeData.players)
        }
        
        if (awayData.players) {
          setAwayTeamPlayers(awayData.players)
        }
        
        // Fetch existing scores for this match
        const scoresResponse = await fetch(`/api/scores?matchId=${match.id}`)
        const scoresData = await scoresResponse.json()
        
        if (scoresData.length > 0) {
          setScores(scoresData)
        } else {
          // Initialize empty scores for all players
          const initialScores: Score[] = [
            ...homeData.players.map((player: Player) => ({
              matchId: match.id,
              playerId: player.id,
              grossScore: 0,
              player
            })),
            ...awayData.players.map((player: Player) => ({
              matchId: match.id,
              playerId: player.id,
              grossScore: 0,
              player
            }))
          ]
          setScores(initialScores)
        }
      } catch (err) {
        console.error('Error fetching data:', err)
        setError('Failed to load match data')
      } finally {
        setLoading(false)
      }
    }
    
    if (match && match.id) {
      fetchPlayers()
    }
  }, [match])

  useEffect(() => {
    if (!match || !match.id) return
    
    // WebSocket setup would go here in a real implementation
    // For now, we'll just simulate it
    
    return () => {
      // Cleanup WebSocket
    }
  }, [match])

  const handleScoreChange = (playerId: string, value: number) => {
    setScores(prevScores => 
      prevScores.map(score => 
        score.playerId === playerId 
          ? { ...score, grossScore: value, netScore: calculateNetScore(value, playerId) } 
          : score
      )
    )
  }

  const calculateNetScore = (grossScore: number, playerId: string): number => {
    const allPlayers = [...homeTeamPlayers, ...awayTeamPlayers]
    const player = allPlayers.find(p => p.id === playerId)
    
    if (!player || grossScore === 0) return 0
    
    // Simple calculation: gross score - handicap (rounded)
    // In a real app, this would be more complex based on course rating, etc.
    const netScore = Math.max(0, grossScore - Math.round(player.handicapIndex))
    return netScore
  }

  const isMatchComplete = useCallback(() => {
    return scores.every(score => score.grossScore > 0)
  }, [scores])

  const saveScores = async () => {
    if (!isMatchComplete()) {
      setError('Please enter scores for all players')
      return
    }
    
    try {
      setSaving(true)
      setError(null)
      
      const response = await fetch('/api/scores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ scores }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to save scores')
      }
      
      setSuccess('Scores saved successfully!')
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null)
      }, 3000)
    } catch (err) {
      console.error('Error saving scores:', err)
      setError('Failed to save scores')
    } finally {
      setSaving(false)
    }
  }

  const viewHistory = () => {
    // Implementation for viewing score history
    console.log('View history for match:', match.id)
  }

  if (loading) {
    return <div className="text-center p-4">Loading match data...</div>
  }
  
  if (error && !scores.length) {
    return <div className="text-center p-4 text-red-500">{error}</div>
  }
  
  return (
    <div className="bg-[#030f0f]/80 rounded-xl p-4 backdrop-blur-sm border border-[#00df82]/20">
      <div className="mb-4">
        <h3 className="text-xl font-audiowide text-white mb-2">Match Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#030f0f]/50 p-3 rounded-lg border border-[#00df82]/10">
            <p className="text-white/80 font-orbitron text-sm">Date: <span className="text-white">{format(new Date(match.date), 'MMMM d, yyyy')}</span></p>
            <p className="text-white/80 font-orbitron text-sm">Week: <span className="text-white">{match.weekNumber}</span></p>
            <p className="text-white/80 font-orbitron text-sm">Starting Hole: <span className="text-white">{match.startingHole}</span></p>
          </div>
          <div className="bg-[#030f0f]/50 p-3 rounded-lg border border-[#00df82]/10">
            <p className="text-white/80 font-orbitron text-sm">Home Team: <span className="text-white">{match.homeTeam.name}</span></p>
            <p className="text-white/80 font-orbitron text-sm">Away Team: <span className="text-white">{match.awayTeam.name}</span></p>
            <p className="text-white/80 font-orbitron text-sm">Status: <span className="text-white">{match.status}</span></p>
          </div>
        </div>
      </div>
      
      <div className="mb-4">
        <h3 className="text-xl font-audiowide text-white mb-2">Player Scores</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#00df82]/10 border-b border-[#00df82]/20">
                <th className="p-2 text-left text-white font-orbitron">Player</th>
                <th className="p-2 text-left text-white font-orbitron">Team</th>
                <th className="p-2 text-left text-white font-orbitron">Handicap</th>
                <th className="p-2 text-left text-white font-orbitron">Gross Score</th>
                <th className="p-2 text-left text-white font-orbitron">Net Score</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((score, index) => {
                const player = homeTeamPlayers.find(p => p.id === score.playerId) || 
                               awayTeamPlayers.find(p => p.id === score.playerId)
                
                if (!player) return null
                
                const team = player.teamId === match.homeTeamId ? match.homeTeam : match.awayTeam
                
                return (
                  <tr key={index} className="border-b border-[#00df82]/10 hover:bg-[#00df82]/5">
                    <td className="p-2 text-white font-orbitron">{player.name}</td>
                    <td className="p-2 text-white/80">{team.name}</td>
                    <td className="p-2 text-white/80">{player.handicapIndex}</td>
                    <td className="p-2">
                      <input
                        type="number"
                        min="0"
                        value={score.grossScore || ''}
                        onChange={(e) => handleScoreChange(player.id, parseInt(e.target.value) || 0)}
                        className="w-20 bg-[#030f0f] border border-[#00df82]/30 rounded p-1 text-white"
                      />
                    </td>
                    <td className="p-2 text-white/80">{score.netScore || calculateNetScore(score.grossScore, player.id)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
      
      {error && <div className="mb-4 p-2 bg-red-500/20 border border-red-500/30 rounded text-white">{error}</div>}
      {success && <div className="mb-4 p-2 bg-green-500/20 border border-green-500/30 rounded text-white">{success}</div>}
      
      <div className="flex flex-wrap gap-2 justify-end">
        <button
          onClick={viewHistory}
          className="px-4 py-2 bg-[#030f0f] border border-[#00df82]/30 hover:border-[#00df82]/50 rounded-lg text-white font-orbitron text-sm transition-all"
        >
          View History
        </button>
        <button
          onClick={saveScores}
          disabled={saving || !isMatchComplete()}
          className={`px-4 py-2 rounded-lg text-white font-orbitron text-sm transition-all ${
            saving || !isMatchComplete()
              ? 'bg-[#00df82]/20 cursor-not-allowed'
              : 'bg-[#00df82]/40 hover:bg-[#00df82]/50'
          }`}
        >
          {saving ? 'Saving...' : 'Save Scores'}
        </button>
      </div>
    </div>
  )
} 