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
  homeTeamId: string
  awayTeamId: string
  homeTeam: { id: string, name: string }
  awayTeam: { id: string, name: string }
  startingHole: number
  status: string
}

export default function ScoringPageClient() {
  const [matches, setMatches] = useState<Match[]>([])
  const [expandedMatches, setExpandedMatches] = useState<string[]>([])
  const [expandedWeeks, setExpandedWeeks] = useState<number[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadMatches = async () => {
      try {
        const response = await fetch('/api/schedule')
        if (!response.ok) {
          throw new Error('Failed to load matches')
        }
        const data = await response.json()
        setMatches(data.matches || [])
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
      <div className="bg-red-500/10 border-l-4 border-red-500 p-4 rounded-lg">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {Object.entries(matchesByWeek).map(([weekNumber, weekMatches]) => (
        <div key={weekNumber} className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
          <button
            onClick={() => toggleWeek(parseInt(weekNumber))}
            className="w-full px-6 py-4 flex items-center justify-between text-white hover:bg-white/5 transition-colors"
          >
            <span className="text-lg font-grifter">Week {weekNumber}</span>
            {expandedWeeks.includes(parseInt(weekNumber)) ? (
              <ChevronUpIcon className="h-5 w-5" />
            ) : (
              <ChevronDownIcon className="h-5 w-5" />
            )}
          </button>
          
          {expandedWeeks.includes(parseInt(weekNumber)) && (
            <div className="px-6 pb-4 space-y-4">
              {weekMatches.map((match) => (
                <div key={match.id} className="bg-white/5 rounded-xl overflow-hidden">
                  <div className="px-6 py-4 flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 text-white">
                        <span className="font-grifter">{match.homeTeam.name}</span>
                        <span className="text-white/60">vs</span>
                        <span className="font-grifter">{match.awayTeam.name}</span>
                      </div>
                      <div className="mt-1 text-sm text-white/60">
                        {format(new Date(match.date), 'MMMM d, yyyy')} • Starting Hole: {match.startingHole}
                      </div>
                    </div>
                    <button
                      onClick={() => toggleMatch(match.id)}
                      className="px-4 py-2 bg-[#00df82] text-black rounded-lg font-bold text-sm hover:bg-[#00df82]/90 transition-colors"
                    >
                      {expandedMatches.includes(match.id) ? 'Hide Scorecard' : 'Play Match'}
                    </button>
                  </div>
                  
                  {expandedMatches.includes(match.id) && (
                    <div className="border-t border-white/10 px-6 py-4">
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
        <div className="text-center py-12 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
          <p className="text-white/60 text-lg">No matches scheduled</p>
        </div>
      )}
    </div>
  )
} 