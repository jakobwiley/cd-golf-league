'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { ChevronDownIcon, ChevronUpIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import ScheduleForm from '../components/ScheduleForm'
import type { Team, Match } from '../types'
import { formatDateForForm, formatDisplayDate, formatDateForAPI } from '../lib/date-utils'

interface ExtendedMatch extends Match {
  id: string
  homeTeam: Team
  awayTeam: Team
  homeTeamId: string
  awayTeamId: string
  weekNumber: number
  date: string
  startingHole: number
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'FINALIZED' | 'CANCELED'
}

interface SchedulePageClientProps {
  teams: Team[]
  matches: ExtendedMatch[]
}

export default function SchedulePageClient({ teams, matches }: SchedulePageClientProps) {
  const [expandedWeeks, setExpandedWeeks] = useState<Record<number, boolean>>({});
  const [editingMatch, setEditingMatch] = useState<ExtendedMatch | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeWeek, setActiveWeek] = useState<number | null>(null)

  // Initialize with first week expanded and fetch its match details
  useEffect(() => {
    const now = new Date()
    
    // Group matches by week
    const matchesByWeek = matches.reduce((acc: Record<number, ExtendedMatch[]>, match) => {
      if (!acc[match.weekNumber]) {
        acc[match.weekNumber] = []
      }
      acc[match.weekNumber].push(match)
      return acc
    }, {})

    // Find the next upcoming week
    const sortedWeeks = Object.keys(matchesByWeek)
      .map(Number)
      .sort((a, b) => a - b)

    const nextWeek = sortedWeeks.find(week => {
      const weekMatches = matchesByWeek[week]
      // Use the first match's date as the week's date
      const weekDate = new Date(weekMatches[0].date)
      return weekDate >= now
    })

    if (nextWeek) {
      console.log('Setting active week:', nextWeek)
      setActiveWeek(nextWeek)
      
      // Initialize all weeks as collapsed initially
      const initialExpandedState: Record<number, boolean> = {}
      initialExpandedState[nextWeek] = true
      setExpandedWeeks(initialExpandedState)
      
      // Scroll to the active week
      setTimeout(() => {
        const weekElement = document.getElementById(`week-${nextWeek}`)
        if (weekElement) {
          weekElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    }
  }, [])  // Only run once on mount

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
    const weekNum = Number(match.weekNumber)
    if (!acc[weekNum]) {
      acc[weekNum] = []
    }
    acc[weekNum].push(match)
    return acc
  }, {} as Record<number, ExtendedMatch[]>)

  const toggleWeek = (weekNumber: number) => {
    console.log('Toggling week:', weekNumber)
    console.log('Current expanded weeks:', expandedWeeks)
    setExpandedWeeks(prev => ({
      ...prev,
      [weekNumber]: !prev[weekNumber]
    }))
  }

  return (
    <div className="min-h-screen bg-[#030f0f] relative overflow-hidden">
      {/* Futuristic background elements */}
      <div className="absolute inset-0 z-0">
        {/* Gradient base */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#00df82]/20 to-[#4CAF50]/10" />
        
        {/* Animated grid lines */}
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full bg-[url('/grid-pattern.svg')] bg-repeat bg-[length:50px_50px]" />
        </div>
        
        {/* Glowing orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#00df82]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-[#4CAF50]/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative overflow-hidden rounded-3xl backdrop-blur-sm bg-gradient-to-r from-[#00df82]/30 to-[#4CAF50]/20 mb-8">
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent"></div>
          <div className="relative px-6 py-8">
            <h1 className="text-3xl md:text-4xl font-audiowide text-white mb-2">Schedule</h1>
            <p className="text-lg text-white/90 font-orbitron tracking-wide">View and manage upcoming matches</p>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-2xl transform translate-x-1/4 -translate-y-1/4"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-black/20 to-transparent rounded-full blur-xl transform -translate-x-1/4 translate-y-1/4"></div>
        </div>
        
        <div className="space-y-8">
          {/* Schedule Form */}
          <div className="relative overflow-hidden rounded-2xl border border-[#00df82]/30 backdrop-blur-sm bg-[#030f0f]/50 p-8">
            <div className="absolute inset-0 bg-gradient-to-br from-[#00df82]/5 to-transparent"></div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#00df82]/10 rounded-full blur-3xl"></div>
            <div className="relative">
              <h2 className="text-2xl font-audiowide text-white mb-6">Create New Match</h2>
              <ScheduleForm 
                teams={teams} 
                onSubmit={handleSubmit} 
                onCancel={() => {}} 
              />
            </div>
          </div>

          {/* Clear All Button */}
          {matches.length > 0 && (
            <div className="flex justify-end">
              <button
                onClick={handleClearAll}
                disabled={loading}
                className="group relative overflow-hidden px-6 py-3 text-red-400 hover:text-white bg-red-900/20 hover:bg-red-900/40 rounded-lg transition-all duration-300 border border-red-900/30 hover:border-red-500/50 backdrop-blur-sm"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent"></div>
                <div className="absolute -top-10 -right-10 w-20 h-20 bg-red-500/10 rounded-full blur-3xl group-hover:bg-red-500/20 transition-all duration-500"></div>
                <span className="relative flex items-center font-audiowide">
                  <TrashIcon className="w-5 h-5 mr-3" />
                  {loading ? 'Deleting...' : 'Clear All Matches'}
                </span>
              </button>
            </div>
          )}

          {/* Edit Modal */}
          {editingMatch && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
              <div className="relative overflow-hidden bg-[#030f0f] p-6 rounded-xl shadow-xl w-full max-w-2xl mx-auto my-8 border border-[#00df82]/30">
                <div className="absolute inset-0 bg-gradient-to-br from-[#00df82]/5 to-transparent"></div>
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#00df82]/10 rounded-full blur-3xl"></div>
                <div className="relative">
                  <h2 className="text-2xl font-audiowide text-white mb-6">Edit Match</h2>
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
                      status: editingMatch.status as 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'FINALIZED' | 'CANCELED'
                    }}
                    onCancel={() => setEditingMatch(null)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Matches by Week */}
          <div className="space-y-6">
            {Object.entries(matchesByWeek).map(([weekNumber, weekMatches]) => (
              <div key={weekNumber} id={`week-${weekNumber}`} className="relative overflow-hidden rounded-2xl border border-[#00df82]/30 backdrop-blur-sm bg-[#030f0f]/50">
                <div className="absolute inset-0 bg-gradient-to-br from-[#00df82]/5 to-transparent"></div>
                <button
                  onClick={() => toggleWeek(Number(weekNumber))}
                  className="w-full px-6 py-4 flex items-center justify-between text-white hover:bg-white/5 transition-colors relative z-10"
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-xl font-audiowide">Week {weekNumber}</span>
                    <span className="text-base text-white/60 font-orbitron">
                      {weekMatches.length} {weekMatches.length === 1 ? 'match' : 'matches'}
                    </span>
                  </div>
                  {expandedWeeks[Number(weekNumber)] ? (
                    <ChevronUpIcon className="h-6 w-6 text-[#00df82]" />
                  ) : (
                    <ChevronDownIcon className="h-6 w-6 text-[#00df82]" />
                  )}
                </button>

                {expandedWeeks[Number(weekNumber)] && (
                  <div className="px-4 pb-4 relative z-10">
                    {/* Mobile view */}
                    <div className="block sm:hidden space-y-4">
                      {weekMatches.map((match) => (
                        <div key={match.id} className="bg-white/5 backdrop-blur-sm rounded-xl p-5 space-y-4 border border-white/10">
                          <div className="flex justify-between items-center">
                            <div className="text-base text-white/80 font-orbitron">
                              {formatDisplayDate(match.date, 'MMMM d, yyyy')}
                            </div>
                            <button
                              onClick={() => handleEdit(match)}
                              className="p-3 text-[#00df82]/60 hover:text-[#00df82] hover:bg-white/10 rounded-lg transition-colors"
                              aria-label="Edit match"
                            >
                              <PencilIcon className="w-6 h-6" />
                            </button>
                          </div>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <div className="font-medium text-white/80 text-base">Home:</div>
                              <div className="text-white text-base font-audiowide">{match.homeTeam.name}</div>
                            </div>
                            <div className="flex justify-between items-center">
                              <div className="font-medium text-white/80 text-base">Away:</div>
                              <div className="text-white text-base font-audiowide">{match.awayTeam.name}</div>
                            </div>
                            <div className="flex justify-between items-center">
                              <div className="font-medium text-white/80 text-base">Starting Hole:</div>
                              <div className="text-white text-base font-orbitron">{match.startingHole}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Desktop view */}
                    <div className="hidden sm:block">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-white/10">
                          <thead>
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Date</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Home Team</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Away Team</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Starting Hole</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Status</th>
                              <th className="px-6 py-3 text-right text-xs font-medium text-white/60 uppercase tracking-wider">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/10">
                            {weekMatches.map((match) => (
                              <tr key={match.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                                  {formatDisplayDate(match.date, 'MMMM d, yyyy')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-audiowide">
                                  {match.homeTeam.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-audiowide">
                                  {match.awayTeam.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-orbitron">
                                  {match.startingHole}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    match.status === 'COMPLETED' || match.status === 'FINALIZED'
                                      ? 'bg-green-500/20 text-green-400' 
                                      : match.status === 'CANCELED' 
                                        ? 'bg-red-500/20 text-red-400' 
                                        : 'bg-blue-500/20 text-blue-400'
                                  }`}>
                                    {match.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-white text-right">
                                  <button
                                    onClick={() => handleEdit(match)}
                                    className="text-[#00df82]/60 hover:text-[#00df82] p-2 rounded-full hover:bg-white/10 transition-colors"
                                  >
                                    <PencilIcon className="h-5 w-5" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {Object.keys(matchesByWeek).length === 0 && (
              <div className="relative overflow-hidden rounded-2xl border border-[#00df82]/30 backdrop-blur-sm bg-[#030f0f]/50 p-12 text-center">
                <div className="absolute inset-0 bg-gradient-to-br from-[#00df82]/5 to-transparent"></div>
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#00df82]/10 rounded-full blur-3xl"></div>
                <p className="text-white/60 text-lg font-orbitron relative">No matches scheduled yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 