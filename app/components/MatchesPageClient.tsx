'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'
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

export default function MatchesPageClient() {
  const [matches, setMatches] = useState<Match[]>([])
  const [expandedMatches, setExpandedMatches] = useState<string[]>([])
  const [expandedWeeks, setExpandedWeeks] = useState<number[]>([])
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
        // Filter to only show scheduled matches
        const scheduledMatches = data.filter((match: Match) => match.status === 'SCHEDULED')
        setMatches(scheduledMatches)
      } catch (error) {
        console.error('Error loading matches:', error)
        setError('Failed to load matches')
      } finally {
        setLoading(false)
      }
    }

    loadMatches()
  }, [])

  // Group matches by week
  const matchesByWeek = matches.reduce((acc, match) => {
    if (!acc[match.weekNumber]) {
      acc[match.weekNumber] = []
    }
    acc[match.weekNumber].push(match)
    return acc
  }, {} as Record<number, Match[]>)

  const toggleWeek = (weekNumber: number) => {
    setExpandedWeeks(prev => 
      prev.includes(weekNumber)
        ? prev.filter(w => w !== weekNumber)
        : [...prev, weekNumber]
    )
  }

  const toggleMatch = (matchId: string) => {
    setExpandedMatches(prev => 
      prev.includes(matchId)
        ? prev.filter(id => id !== matchId)
        : [...prev, matchId]
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00df82]"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-red-500/30 backdrop-blur-sm bg-[#030f0f]/50 p-6">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent"></div>
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-500/10 rounded-full blur-3xl"></div>
        <p className="text-red-500 relative font-orbitron">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {Object.entries(matchesByWeek).map(([weekNumber, weekMatches]) => (
        <div key={weekNumber} className="relative overflow-hidden rounded-2xl border border-[#00df82]/30 backdrop-blur-sm bg-[#030f0f]/50">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00df82]/5 to-transparent"></div>
          <button
            onClick={() => toggleWeek(parseInt(weekNumber))}
            className="w-full px-6 py-4 flex items-center justify-between text-white hover:bg-white/5 transition-colors relative z-10"
          >
            <div className="flex items-center space-x-4">
              <span className="text-lg font-audiowide">Week {weekNumber}</span>
              <span className="text-sm text-white/60 font-orbitron">
                {weekMatches.length} {weekMatches.length === 1 ? 'match' : 'matches'}
              </span>
            </div>
            {expandedWeeks.includes(parseInt(weekNumber)) ? (
              <ChevronUpIcon className="h-5 w-5 text-[#00df82]" />
            ) : (
              <ChevronDownIcon className="h-5 w-5 text-[#00df82]" />
            )}
          </button>
          
          {expandedWeeks.includes(parseInt(weekNumber)) && (
            <div className="px-6 pb-4 space-y-4 relative z-10">
              {weekMatches.map((match) => (
                <div key={match.id} className="relative overflow-hidden rounded-xl border border-[#00df82]/20 backdrop-blur-sm bg-[#030f0f]/70">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#00df82]/5 to-transparent"></div>
                  <div className="px-6 py-4 relative">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 text-white">
                          <span className="font-audiowide">{match.homeTeam.name}</span>
                          <span className="text-white/60">vs</span>
                          <span className="font-audiowide">{match.awayTeam.name}</span>
                        </div>
                        <div className="mt-1 text-sm text-white/60 font-orbitron">
                          {format(new Date(match.date), 'MMMM d, yyyy')} • Starting Hole: {match.startingHole}
                        </div>
                      </div>
                      <button
                        onClick={() => toggleMatch(match.id)}
                        className="group relative overflow-hidden px-4 py-2 bg-[#030f0f]/70 text-[#00df82] rounded-lg border border-[#00df82]/30 hover:border-[#00df82]/50 backdrop-blur-sm transition-all duration-300 hover:scale-105"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-[#00df82]/5 to-transparent"></div>
                        <div className="absolute -top-10 -right-10 w-20 h-20 bg-[#00df82]/10 rounded-full blur-3xl group-hover:bg-[#00df82]/20 transition-all duration-500"></div>
                        <span className="relative font-audiowide text-sm">
                          {expandedMatches.includes(match.id) ? 'Hide Scorecard' : 'Play Match'}
                        </span>
                      </button>
                    </div>
                  </div>
                  
                  {expandedMatches.includes(match.id) && (
                    <div className="border-t border-white/10 px-6 py-4 relative">
                      <MatchScoring match={match} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
      
      {Object.keys(matchesByWeek).length === 0 && (
        <div className="relative overflow-hidden rounded-2xl border border-[#00df82]/30 backdrop-blur-sm bg-[#030f0f]/50 p-12 text-center">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00df82]/5 to-transparent"></div>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#00df82]/10 rounded-full blur-3xl"></div>
          <p className="text-white/60 text-lg font-orbitron relative">No scheduled matches available</p>
        </div>
      )}
    </div>
  )
} 