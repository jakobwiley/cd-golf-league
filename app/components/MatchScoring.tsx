'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { calculateNetScore, holeHandicaps } from '../lib/handicap'
import { useWebSocket } from '../hooks/useWebSocket'

interface Player {
  id: string
  name: string
  handicapIndex: number
}

interface Team {
  id: string
  name: string
  players: Player[]
}

interface Match {
  id: string
  date: string
  homeTeam: Team
  awayTeam: Team
  startingHole: number
  status: string
}

interface Score {
  playerId: string
  hole: number
  score: number
}

export default function MatchScoring({ match }: { match: Match }) {
  const [scores, setScores] = useState<Score[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const socket = useWebSocket(`/api/scores/ws?matchId=${match.id}`)

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

  useEffect(() => {
    const loadScores = async () => {
      try {
        const response = await fetch(`/api/scores?matchId=${match.id}`)
        if (response.ok) {
          const data = await response.json()
          setScores(data)
        }
      } catch (error) {
        console.error('Error loading scores:', error)
        setError('Failed to load existing scores')
      }
    }

    loadScores()

    // Listen for real-time score updates
    if (socket) {
      socket.onmessage = (event) => {
        const newScores = JSON.parse(event.data)
        setScores(newScores)
      }
    }

    return () => {
      if (socket) {
        socket.close()
      }
    }
  }, [match.id, socket])

  const handleScoreChange = async (playerId: string, hole: number, value: string) => {
    const numericValue = parseInt(value) || 0
    
    const newScores = [...scores]
    const existingScoreIndex = newScores.findIndex(
      s => s.playerId === playerId && s.hole === hole
    )

    if (existingScoreIndex >= 0) {
      newScores[existingScoreIndex].score = numericValue
    } else {
      newScores.push({ playerId, hole, score: numericValue })
    }

    setScores(newScores)

    // Send score update to server
    try {
      await fetch('/api/scores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          matchId: match.id,
          scores: [{ playerId, hole, score: numericValue }],
        }),
      })
    } catch (error) {
      console.error('Error saving score:', error)
    }
  }

  const getPlayerScore = (playerId: string, hole: number) => {
    return scores.find(s => s.playerId === playerId && s.hole === hole)?.score || ''
  }

  const getNetScore = (playerId: string, hole: number, grossScore: number) => {
    const player = [...match.homeTeam.players, ...match.awayTeam.players].find(p => p.id === playerId)
    const opponent = [...match.homeTeam.players, ...match.awayTeam.players].find(p => p.id !== playerId)
    
    if (!player || !opponent) return grossScore

    return calculateNetScore(grossScore, player.handicapIndex, opponent.handicapIndex, hole)
  }

  const calculateTotal = (playerId: string) => {
    return holes.reduce((total, hole) => {
      const score = scores.find(s => s.playerId === playerId && s.hole === hole)?.score || 0
      return total + score
    }, 0)
  }

  const calculateNetTotal = (playerId: string) => {
    return holes.reduce((total, hole) => {
      const score = scores.find(s => s.playerId === playerId && s.hole === hole)?.score || 0
      return total + getNetScore(playerId, hole, score)
    }, 0)
  }

  const getHoleHandicap = (hole: number) => {
    return holeHandicaps[hole as keyof typeof holeHandicaps]
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)

    try {
      const response = await fetch('/api/scores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          matchId: match.id,
          scores: scores,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save scores')
      }

      // Update match status if all scores are entered
      if (isMatchComplete()) {
        await fetch(`/api/matches/${match.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: 'COMPLETED',
          }),
        })
      }
    } catch (error) {
      console.error('Error saving scores:', error)
      setError('Failed to save scores')
    } finally {
      setSaving(false)
    }
  }

  const isMatchComplete = () => {
    const allPlayers = [...match.homeTeam.players, ...match.awayTeam.players]
    return allPlayers.every(player => 
      holes.every(hole => 
        scores.some(s => s.playerId === player.id && s.hole === hole)
      )
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
        <div className="px-4 py-5 sm:p-6">
          <div className="sm:flex sm:items-center sm:justify-between">
            <h3 className="text-base font-semibold leading-7 text-gray-900">
              {format(new Date(match.date), 'MMMM d, yyyy')}
            </h3>
            <div className="mt-2 sm:mt-0">
              <span className="text-sm text-gray-500">
                Starting Hole: {match.startingHole}
              </span>
            </div>
          </div>

          <div className="mt-6 flow-root">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                      Player
                    </th>
                    {holes.map(hole => (
                      <th key={hole} scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                        {hole}
                        <div className="text-xs text-gray-500">
                          Par {parValues[hole as keyof typeof parValues]}
                          <br />
                          Hdcp {getHoleHandicap(hole)}
                        </div>
                      </th>
                    ))}
                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                      Gross
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                      Net
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {match.homeTeam.players.map(player => (
                    <tr key={player.id} className="bg-masters-cream/10">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                        {player.name}
                        <div className="text-xs text-gray-500">
                          {match.homeTeam.name} • HCP: {player.handicapIndex}
                        </div>
                      </td>
                      {holes.map(hole => {
                        const grossScore = getPlayerScore(player.id, hole)
                        const netScore = grossScore ? getNetScore(player.id, hole, grossScore) : ''
                        return (
                          <td key={hole} className="whitespace-nowrap px-3 py-4 text-center">
                            <input
                              type="number"
                              min="1"
                              max="12"
                              value={grossScore}
                              onChange={(e) => handleScoreChange(player.id, hole, e.target.value)}
                              className="w-12 text-center rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-masters-green sm:text-sm sm:leading-6"
                            />
                            {grossScore && netScore !== grossScore && (
                              <div className="text-xs text-gray-500 mt-1">({netScore})</div>
                            )}
                          </td>
                        )
                      })}
                      <td className="whitespace-nowrap px-3 py-4 text-center text-sm font-medium text-gray-900">
                        {calculateTotal(player.id)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-center text-sm font-medium text-gray-900">
                        {calculateNetTotal(player.id)}
                      </td>
                    </tr>
                  ))}
                  {match.awayTeam.players.map(player => (
                    <tr key={player.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                        {player.name}
                        <div className="text-xs text-gray-500">
                          {match.awayTeam.name} • HCP: {player.handicapIndex}
                        </div>
                      </td>
                      {holes.map(hole => {
                        const grossScore = getPlayerScore(player.id, hole)
                        const netScore = grossScore ? getNetScore(player.id, hole, grossScore) : ''
                        return (
                          <td key={hole} className="whitespace-nowrap px-3 py-4 text-center">
                            <input
                              type="number"
                              min="1"
                              max="12"
                              value={grossScore}
                              onChange={(e) => handleScoreChange(player.id, hole, e.target.value)}
                              className="w-12 text-center rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-masters-green sm:text-sm sm:leading-6"
                            />
                            {grossScore && netScore !== grossScore && (
                              <div className="text-xs text-gray-500 mt-1">({netScore})</div>
                            )}
                          </td>
                        )
                      })}
                      <td className="whitespace-nowrap px-3 py-4 text-center text-sm font-medium text-gray-900">
                        {calculateTotal(player.id)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-center text-sm font-medium text-gray-900">
                        {calculateNetTotal(player.id)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {error && (
            <div className="mt-4 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="mt-6 flex justify-end gap-x-3">
            <button
              type="button"
              onClick={() => {}}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              View History
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="btn-primary"
            >
              {saving ? 'Saving...' : 'Save Scores'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 