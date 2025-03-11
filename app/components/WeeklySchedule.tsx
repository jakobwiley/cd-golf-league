'use client'

import { useState } from 'react'
import { Match, Team } from '@prisma/client'
import { format } from 'date-fns'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import ScheduleForm from './ScheduleForm'
import { formatDateForForm, formatDisplayDate } from '../lib/date-utils'

interface WeeklyScheduleProps {
  matches: (Match & {
    homeTeam: Team
    awayTeam: Team
  })[]
}

interface GroupedMatches {
  [key: number]: (Match & {
    homeTeam: Team
    awayTeam: Team
  })[]
}

export default function WeeklySchedule({ matches }: WeeklyScheduleProps) {
  const [editingMatch, setEditingMatch] = useState<Match | null>(null)
  const [loading, setLoading] = useState(false)

  // Group matches by week number
  const groupedMatches = matches.reduce((acc: GroupedMatches, match) => {
    if (!acc[match.weekNumber]) {
      acc[match.weekNumber] = []
    }
    acc[match.weekNumber].push(match)
    return acc
  }, {})

  const handleEdit = (match: Match & { homeTeam: Team; awayTeam: Team }) => {
    console.log('Editing match:', match);
    setEditingMatch(match);
  }

  const handleEditSubmit = async (data: any) => {
    try {
      console.log('Submitting edit with data:', data);
      
      const response = await fetch(`/api/schedule/${editingMatch?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error('Failed to update match');
      }

      // Refresh the page to show updated data
      window.location.reload();
    } catch (error) {
      console.error('Error updating match:', error);
    } finally {
      setEditingMatch(null);
    }
  }

  const handleClearAll = async () => {
    if (!confirm('Are you sure you want to delete all matches? This cannot be undone.')) {
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/schedule/clear', {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete matches')
      }

      // Refresh the page to show updated data
      window.location.reload()
    } catch (error) {
      console.error('Error deleting matches:', error)
      alert('Failed to delete matches')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {matches.length > 0 && (
        <div className="flex justify-end">
          <button
            onClick={handleClearAll}
            disabled={loading}
            className="flex items-center px-4 py-2 text-red-600 hover:text-white bg-red-100 hover:bg-red-600 rounded-lg transition-colors"
          >
            <TrashIcon className="w-5 h-5 mr-2" />
            {loading ? 'Deleting...' : 'Clear All Matches'}
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
            <ScheduleForm 
              teams={matches.map(m => m.homeTeam).filter((team, index, self) => 
                index === self.findIndex(t => t.id === team.id)
              )}
              onSubmit={handleEditSubmit}
              initialData={{
                id: editingMatch.id,
                date: editingMatch.date,
                weekNumber: editingMatch.weekNumber,
                homeTeamId: editingMatch.homeTeamId,
                awayTeamId: editingMatch.awayTeamId,
                startingHole: editingMatch.startingHole,
                status: editingMatch.status as 'SCHEDULED' | 'CANCELED' | 'COMPLETED'
              }}
              onCancel={() => setEditingMatch(null)}
            />
          </div>
        </div>
      )}

      {Object.entries(groupedMatches).map(([weekNumber, weekMatches]) => (
        <div key={weekNumber} className="bg-gray-900 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-gray-800">
            <h2 className="text-xl font-bold text-white">
              Week {weekNumber}
              <span className="ml-2 text-sm font-normal text-gray-400">
                {weekMatches.length} matches
              </span>
            </h2>
          </div>
          <div className="divide-y divide-gray-800">
            {weekMatches.map((match) => (
              <div key={match.id} className="p-4 flex items-center justify-between hover:bg-gray-800/50">
                <div className="grid grid-cols-5 gap-4 flex-1">
                  <div className="text-gray-400">
                    {formatDisplayDate(match.date, 'EEEE, MMMM d, yyyy')}
                  </div>
                  <div className="text-white">
                    {match.homeTeam.name}
                  </div>
                  <div className="text-white">
                    {match.awayTeam.name}
                  </div>
                  <div className="text-gray-400">
                    {match.startingHole}
                  </div>
                  <div className="text-gray-400">
                    {match.status === 'SCHEDULED' ? 'Scheduled' : match.status}
                  </div>
                </div>
                <button
                  onClick={() => handleEdit(match)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                  aria-label="Edit match"
                >
                  <PencilIcon className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {Object.entries(groupedMatches).map(([weekNumber, weekMatches]) => (
        <div key={weekNumber} className="block sm:hidden space-y-4">
          {weekMatches.map((match) => (
            <div key={match.id} className="bg-white/5 rounded-xl p-5 space-y-4">
              <div className="flex justify-between items-center">
                <div className="text-base text-white/80">
                  {formatDisplayDate(match.date, 'EEEE, MMMM d, yyyy')}
                </div>
                <button
                  onClick={() => handleEdit(match)}
                  className="p-3 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  aria-label="Edit match"
                >
                  <PencilIcon className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="font-medium text-white/80 text-base">Home:</div>
                  <div className="text-white text-base">{match.homeTeam.name}</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="font-medium text-white/80 text-base">Away:</div>
                  <div className="text-white text-base">{match.awayTeam.name}</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="font-medium text-white/80 text-base">Starting Hole:</div>
                  <div className="text-white text-base">{match.startingHole}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
} 