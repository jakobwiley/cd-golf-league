'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'

interface ScoreHistoryProps {
  playerId: string
}

interface HistoricalScore {
  matchId: string
  matchDate: string
  scores: number[]
  total: number
  opponent: string
  result: string
}

export default function ScoreHistory({ playerId }: ScoreHistoryProps) {
  const [history, setHistory] = useState<HistoricalScore[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const response = await fetch(`/api/scores/history?playerId=${playerId}`)
        if (response.ok) {
          const data = await response.json()
          setHistory(data)
        } else {
          throw new Error('Failed to load score history')
        }
      } catch (error) {
        console.error('Error loading score history:', error)
        setError('Failed to load score history')
      } finally {
        setLoading(false)
      }
    }

    loadHistory()
  }, [playerId])

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-masters-green"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-red-600 text-sm py-4">{error}</div>
    )
  }

  if (history.length === 0) {
    return (
      <div className="text-gray-500 text-sm py-4">No match history available</div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Match History</h3>
      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Date</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Opponent</th>
              {Array.from({ length: 9 }, (_, i) => i + 1).map(hole => (
                <th key={hole} scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">{hole}</th>
              ))}
              <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">Total</th>
              <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {history.map((match, index) => (
              <tr key={match.matchId} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900">
                  {format(new Date(match.matchDate), 'MMM d, yyyy')}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">{match.opponent}</td>
                {match.scores.map((score, hole) => (
                  <td key={hole} className="whitespace-nowrap px-3 py-4 text-sm text-center text-gray-900">{score}</td>
                ))}
                <td className="whitespace-nowrap px-3 py-4 text-sm text-center font-medium text-gray-900">{match.total}</td>
                <td className={`whitespace-nowrap px-3 py-4 text-sm text-center font-medium ${
                  match.result === 'Won' ? 'text-green-600' : 
                  match.result === 'Lost' ? 'text-red-600' : 
                  'text-gray-600'
                }`}>
                  {match.result}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 