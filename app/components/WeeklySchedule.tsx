'use client'

import React from 'react'
import type { Team, Match } from '../../types'
import { format } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'
import { PencilIcon } from '@heroicons/react/24/outline'

interface Props {
  matches: Match[]
  teams: Team[]
}

export default function WeeklySchedule({ matches, teams }: Props) {
  const [editingMatch, setEditingMatch] = React.useState<Match | null>(null)

  // Group matches by week
  const matchesByWeek = matches.reduce((acc, match) => {
    const week = match.weekNumber
    if (!acc[week]) {
      acc[week] = []
    }
    acc[week].push(match)
    return acc
  }, {} as Record<number, Match[]>)

  // Sort weeks
  const sortedWeeks = Object.keys(matchesByWeek)
    .map(Number)
    .sort((a, b) => a - b)

  // Helper to find team name
  const getTeamName = (teamId: string) => {
    const team = teams.find(t => t.id === teamId)
    return team?.name || 'Unknown Team'
  }

  const handleEdit = (match: Match) => {
    setEditingMatch(match)
  }

  const handleClearAll = async () => {
    if (!confirm('Are you sure you want to delete all matches? This cannot be undone.')) {
      return
    }

    try {
      const response = await fetch('/api/schedule/clear', {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete matches')
      }

      window.location.reload()
    } catch (error) {
      console.error('Error deleting matches:', error)
      alert('Failed to delete matches')
    }
  }

  return (
    <div className="space-y-8">
      {matches.length > 0 && (
        <div className="flex justify-end">
          <button
            onClick={handleClearAll}
            className="flex items-center px-4 py-2 text-red-600 hover:text-white bg-red-100 hover:bg-red-600 rounded-lg transition-colors"
          >
            <PencilIcon className="w-5 h-5 mr-2" />
            Clear All Matches
          </button>
        </div>
      )}

      {matches.length === 0 && (
        <div className="bg-gray-900 rounded-xl p-8 text-center">
          <p className="text-gray-400 text-lg">No matches scheduled yet. Create your first match above.</p>
        </div>
      )}

      {editingMatch && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-2xl w-full mx-4">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Edit Match</h2>
            <button
              onClick={() => setEditingMatch(null)}
              className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {sortedWeeks.map(week => (
        <div key={week} className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Week {week}</h3>
          <div className="space-y-4">
            {matchesByWeek[week].map(match => (
              <div key={match.id} className="flex justify-between items-center border-b pb-2">
                <div className="flex-1">
                  <p className="font-medium">{getTeamName(match.homeTeamId)} vs {getTeamName(match.awayTeamId)}</p>
                  <p className="text-sm text-gray-500">
                    {format(utcToZonedTime(new Date(match.date), 'America/Chicago'), 'MMMM d, yyyy h:mm a')}
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  Starting Hole: {match.startingHole}
                  <button
                    onClick={() => handleEdit(match)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="Edit match"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}