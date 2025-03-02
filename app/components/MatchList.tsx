'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import Link from 'next/link'
import MatchScoring from './MatchScoring'

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
  weekNumber: number
  homeTeam: Team
  awayTeam: Team
  startingHole: number
  status: string
}

export default function MatchList({ view = 'list' }: { view?: 'list' | 'scoring' }) {
  const [matches, setMatches] = useState<Match[]>([])
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadMatches = async () => {
      try {
        const response = await fetch('/api/matches')
        if (!response.ok) {
          throw new Error('Failed to load matches')
        }
        const data = await response.json()
        setMatches(data)
      } catch (error) {
        console.error('Error loading matches:', error)
        setError('Failed to load matches')
      } finally {
        setLoading(false)
      }
    }

    loadMatches()
  }, [])

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

  if (matches.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-500">No matches scheduled</p>
      </div>
    )
  }

  if (selectedMatch && view === 'scoring') {
    return (
      <div className="space-y-6">
        <button
          onClick={() => setSelectedMatch(null)}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          ← Back to matches
        </button>
        <MatchScoring match={selectedMatch} />
      </div>
    )
  }

  return (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Week</th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Home Team</th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Away Team</th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Starting Hole</th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {matches.map((match) => (
            <tr key={match.id}>
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900">
                Week {match.weekNumber}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                {format(new Date(match.date), 'MMM d, yyyy')}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                {match.homeTeam.name}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                {match.awayTeam.name}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                {match.startingHole}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm">
                <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                  match.status === 'COMPLETED' 
                    ? 'bg-green-50 text-green-700'
                    : match.status === 'IN_PROGRESS'
                    ? 'bg-yellow-50 text-yellow-700'
                    : 'bg-gray-50 text-gray-700'
                }`}>
                  {match.status}
                </span>
              </td>
              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                {view === 'scoring' ? (
                  <button
                    onClick={() => setSelectedMatch(match)}
                    className="text-masters-green hover:text-masters-green/80"
                  >
                    Enter Scores
                  </button>
                ) : (
                  <Link
                    href={`/matches/${match.id}`}
                    className="text-masters-green hover:text-masters-green/80"
                  >
                    View Details
                  </Link>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
} 