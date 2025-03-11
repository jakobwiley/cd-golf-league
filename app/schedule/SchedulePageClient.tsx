'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { ChevronDownIcon, ChevronUpIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import ScheduleForm from '../components/ScheduleForm'
import type { Team, Match } from '@prisma/client'
import { formatDateForForm, formatDisplayDate, formatDateForAPI } from '../lib/date-utils'

interface ExtendedMatch extends Match {
  homeTeam: Team
  awayTeam: Team
}

interface SchedulePageClientProps {
  teams: Team[]
  matches: ExtendedMatch[]
}

export default function SchedulePageClient({ teams, matches }: SchedulePageClientProps) {
  const [expandedWeeks, setExpandedWeeks] = useState<number[]>([])
  const [editingMatch, setEditingMatch] = useState<ExtendedMatch | null>(null)
  const [loading, setLoading] = useState(false)
  
  const handleSubmit = async (data: any) => {
    setLoading(true)
    try {
      console.log('Creating match with data:', data)
      
      const response = await fetch('/api/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Error response:', errorData)
        throw new Error('Failed to schedule match')
      }

      const createdMatch = await response.json()
      console.log('Created match:', createdMatch)

      // Refresh the page to show updated data
      window.location.reload()
    } catch (error) {
      console.error('Error scheduling match:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (match: ExtendedMatch) => {
    setEditingMatch(match)
  }

  const handleEditSubmit = async (data: any) => {
    setLoading(true)
    try {
      console.log('Submitting edit with data:', data)
      
      const response = await fetch(`/api/schedule/${editingMatch?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Error response:', errorData)
        throw new Error('Failed to update match')
      }

      const updatedMatch = await response.json()
      console.log('Updated match:', updatedMatch)

      // Refresh the page to show updated data
      window.location.reload()
    } catch (error) {
      console.error('Error updating match:', error)
    } finally {
      setLoading(false)
      setEditingMatch(null)
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

  // Group matches by week
  const matchesByWeek = matches.reduce((acc, match) => {
    if (!acc[match.weekNumber]) {
      acc[match.weekNumber] = []
    }
    acc[match.weekNumber].push(match)
    return acc
  }, {} as Record<number, ExtendedMatch[]>)

  const toggleWeek = (weekNumber: number) => {
    setExpandedWeeks(prev => 
      prev.includes(weekNumber)
        ? prev.filter(w => w !== weekNumber)
        : [...prev, weekNumber]
    )
  }

  return (
    <div className="min-h-screen bg-[#030f0f]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#92E3A9] to-[#4CAF50] mb-8">
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent"></div>
          <div className="relative px-6 py-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Schedule</h1>
            <p className="text-lg text-white/90">View and manage upcoming matches</p>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-2xl transform translate-x-1/4 -translate-y-1/4"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-black/20 to-transparent rounded-full blur-xl transform -translate-x-1/4 translate-y-1/4"></div>
        </div>
        
        <div className="space-y-8">
          {/* Schedule Form */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-5 sm:p-8 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-6">Create New Match</h2>
            <ScheduleForm 
              teams={teams} 
              onSubmit={handleSubmit} 
              onCancel={() => {}} 
            />
          </div>

          {/* Clear All Button */}
          {matches.length > 0 && (
            <div className="flex justify-end">
              <button
                onClick={handleClearAll}
                disabled={loading}
                className="flex items-center px-5 py-3 text-base text-red-400 hover:text-white bg-red-900/20 hover:bg-red-900/40 rounded-lg transition-colors border border-red-900/30"
              >
                <TrashIcon className="w-5 h-5 mr-3" />
                {loading ? 'Deleting...' : 'Clear All Matches'}
              </button>
            </div>
          )}

          {/* Edit Modal */}
          {editingMatch && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
              <div className="bg-[#0a1f1f] p-6 rounded-xl shadow-xl w-full max-w-2xl mx-auto my-8 border border-white/10">
                <h2 className="text-2xl font-bold mb-6 text-white">Edit Match</h2>
                <ScheduleForm 
                  teams={teams}
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

          {/* Matches by Week */}
          <div className="space-y-6">
            {Object.entries(matchesByWeek).map(([weekNumber, weekMatches]) => (
              <div key={weekNumber} className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
                <button
                  onClick={() => toggleWeek(parseInt(weekNumber))}
                  className="w-full px-6 py-4 flex items-center justify-between text-white hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-xl font-bold">Week {weekNumber}</span>
                    <span className="text-base text-white/60">
                      {weekMatches.length} {weekMatches.length === 1 ? 'match' : 'matches'}
                    </span>
                  </div>
                  {expandedWeeks.includes(parseInt(weekNumber)) ? (
                    <ChevronUpIcon className="h-6 w-6" />
                  ) : (
                    <ChevronDownIcon className="h-6 w-6" />
                  )}
                </button>

                {expandedWeeks.includes(parseInt(weekNumber)) && (
                  <div className="px-4 pb-4">
                    {/* Mobile view */}
                    <div className="block sm:hidden space-y-4">
                      {weekMatches.map((match) => (
                        <div key={match.id} className="bg-white/5 rounded-xl p-5 space-y-4">
                          <div className="flex justify-between items-center">
                            <div className="text-base text-white/80">
                              {formatDisplayDate(match.date, 'MMMM d, yyyy')}
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

                    {/* Desktop view */}
                    <div className="hidden sm:block overflow-x-auto">
                      <table className="min-w-full">
                        <thead>
                          <tr>
                            <th className="py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Date</th>
                            <th className="py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Home Team</th>
                            <th className="py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Away Team</th>
                            <th className="py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Starting Hole</th>
                            <th className="py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                          {weekMatches.map((match) => (
                            <tr key={match.id} className="hover:bg-white/5 transition-colors">
                              <td className="py-4 text-sm text-white">
                                {formatDisplayDate(match.date, 'MMMM d, yyyy')}
                              </td>
                              <td className="py-4 text-sm text-white">
                                {match.homeTeam.name}
                              </td>
                              <td className="py-4 text-sm text-white">
                                {match.awayTeam.name}
                              </td>
                              <td className="py-4 text-sm text-white">
                                {match.startingHole}
                              </td>
                              <td className="py-4 text-sm">
                                <button
                                  onClick={() => handleEdit(match)}
                                  className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                  aria-label="Edit match"
                                >
                                  <PencilIcon className="w-5 h-5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {Object.keys(matchesByWeek).length === 0 && (
              <div className="text-center py-12 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
                <p className="text-white/60 text-lg px-4">No matches scheduled</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 