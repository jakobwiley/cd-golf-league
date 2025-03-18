'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { format } from 'date-fns'
import { calculateNetScore, holeHandicaps, calculateStrokesReceived } from '../lib/handicap'
import { useWebSocket } from '../hooks/useWebSocket'
import { Match, Team, Player } from '../types'
import { calculateCourseHandicap } from '../lib/handicap'
import MatchScoreCard from './MatchScoreCard'

interface MatchScoringProps {
  match: Match
}

interface Score {
  id?: string
  matchId: string
  playerId: string
  grossScore: number
  netScore?: number
  player?: Player
}

interface PlayerScores {
  [playerId: string]: { hole: number; score: number }[]
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
            ...(homeData.players || []).map((player: Player) => ({
              matchId: match.id,
              playerId: player.id,
              grossScore: 0,
              player
            })),
            ...(awayData.players || []).map((player: Player) => ({
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

  if (loading) {
    return <div className="text-center p-4 text-white">Loading match data...</div>
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Home Team */}
        <div className="p-4 bg-[#030f0f]/50 rounded-xl border border-[#00df82]/30">
          <h3 className="text-lg font-orbitron text-white mb-4">{match.homeTeam?.name || 'Home Team'}</h3>
          <div className="space-y-4">
            {homeTeamPlayers.map(player => (
              <MatchScoreCard
                key={player.id}
                player={player}
                score={scores.find(s => s.playerId === player.id)}
                onScoreChange={handleScoreChange}
                holes={holes}
                parValues={parValues}
              />
            ))}
          </div>
        </div>

        {/* Away Team */}
        <div className="p-4 bg-[#030f0f]/50 rounded-xl border border-[#00df82]/30">
          <h3 className="text-lg font-orbitron text-white mb-4">{match.awayTeam?.name || 'Away Team'}</h3>
          <div className="space-y-4">
            {awayTeamPlayers.map(player => (
              <MatchScoreCard
                key={player.id}
                player={player}
                score={scores.find(s => s.playerId === player.id)}
                onScoreChange={handleScoreChange}
                holes={holes}
                parValues={parValues}
              />
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-500">
          {success}
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={saveScores}
          disabled={saving || !isMatchComplete()}
          className={`px-6 py-2 rounded-lg font-orbitron text-white transition-all duration-200
            ${saving || !isMatchComplete()
              ? 'bg-gray-500/50 cursor-not-allowed'
              : 'bg-[#00df82]/20 hover:bg-[#00df82]/30 border border-[#00df82]/30 hover:border-[#00df82]/60'
            }`}
        >
          {saving ? 'Saving...' : 'Save Scores'}
        </button>
      </div>
    </div>
  )
}