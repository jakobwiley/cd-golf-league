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
  players?: any[]
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

// Fallback team data
const fallbackTeams: Record<string, Team> = {
  'team1': { id: 'team1', name: 'Nick/Brent', players: [] },
  'team2': { id: 'team2', name: 'Hot/Huerter', players: [] },
  'team3': { id: 'team3', name: 'Ashley/Alli', players: [] },
  'team4': { id: 'team4', name: 'Brew/Jake', players: [] },
  'team5': { id: 'team5', name: 'Sketch/Rob', players: [] },
  'team6': { id: 'team6', name: 'Trev/Murph', players: [] },
  'team7': { id: 'team7', name: 'Ryan/Drew', players: [] },
  'team8': { id: 'team8', name: 'AP/JohnP', players: [] },
  'team9': { id: 'team9', name: 'Clauss/Wade', players: [] },
  'team10': { id: 'team10', name: 'Brett/Tony', players: [] }
};

// Fallback match data for all weeks
const fallbackMatches = [
  // Week 1 - April 15, 2025
  { id: 'match1', date: '2025-04-15T18:00:00.000Z', weekNumber: 1, homeTeam: fallbackTeams['team2'], awayTeam: fallbackTeams['team1'], startingHole: 1, status: 'SCHEDULED' },
  { id: 'match2', date: '2025-04-15T18:00:00.000Z', weekNumber: 1, homeTeam: fallbackTeams['team3'], awayTeam: fallbackTeams['team10'], startingHole: 2, status: 'SCHEDULED' },
  { id: 'match3', date: '2025-04-15T18:00:00.000Z', weekNumber: 1, homeTeam: fallbackTeams['team4'], awayTeam: fallbackTeams['team9'], startingHole: 3, status: 'SCHEDULED' },
  { id: 'match4', date: '2025-04-15T18:00:00.000Z', weekNumber: 1, homeTeam: fallbackTeams['team5'], awayTeam: fallbackTeams['team8'], startingHole: 4, status: 'SCHEDULED' },
  { id: 'match5', date: '2025-04-15T18:00:00.000Z', weekNumber: 1, homeTeam: fallbackTeams['team6'], awayTeam: fallbackTeams['team7'], startingHole: 5, status: 'SCHEDULED' },
  
  // Week 2 - April 22, 2025
  { id: 'match6', date: '2025-04-22T18:00:00.000Z', weekNumber: 2, homeTeam: fallbackTeams['team10'], awayTeam: fallbackTeams['team4'], startingHole: 1, status: 'SCHEDULED' },
  { id: 'match7', date: '2025-04-22T18:00:00.000Z', weekNumber: 2, homeTeam: fallbackTeams['team1'], awayTeam: fallbackTeams['team7'], startingHole: 2, status: 'SCHEDULED' },
  { id: 'match8', date: '2025-04-22T18:00:00.000Z', weekNumber: 2, homeTeam: fallbackTeams['team8'], awayTeam: fallbackTeams['team6'], startingHole: 3, status: 'SCHEDULED' },
  { id: 'match9', date: '2025-04-22T18:00:00.000Z', weekNumber: 2, homeTeam: fallbackTeams['team9'], awayTeam: fallbackTeams['team5'], startingHole: 4, status: 'SCHEDULED' },
  { id: 'match10', date: '2025-04-22T18:00:00.000Z', weekNumber: 2, homeTeam: fallbackTeams['team2'], awayTeam: fallbackTeams['team3'], startingHole: 5, status: 'SCHEDULED' },
  
  // Week 3 - April 29, 2025
  { id: 'match11', date: '2025-04-29T18:00:00.000Z', weekNumber: 3, homeTeam: fallbackTeams['team7'], awayTeam: fallbackTeams['team8'], startingHole: 1, status: 'SCHEDULED' },
  { id: 'match12', date: '2025-04-29T18:00:00.000Z', weekNumber: 3, homeTeam: fallbackTeams['team6'], awayTeam: fallbackTeams['team9'], startingHole: 2, status: 'SCHEDULED' },
  { id: 'match13', date: '2025-04-29T18:00:00.000Z', weekNumber: 3, homeTeam: fallbackTeams['team5'], awayTeam: fallbackTeams['team10'], startingHole: 3, status: 'SCHEDULED' },
  { id: 'match14', date: '2025-04-29T18:00:00.000Z', weekNumber: 3, homeTeam: fallbackTeams['team4'], awayTeam: fallbackTeams['team2'], startingHole: 4, status: 'SCHEDULED' },
  { id: 'match15', date: '2025-04-29T18:00:00.000Z', weekNumber: 3, homeTeam: fallbackTeams['team3'], awayTeam: fallbackTeams['team1'], startingHole: 5, status: 'SCHEDULED' },
  
  // Week 4 - May 6, 2025
  { id: 'match16', date: '2025-05-06T18:00:00.000Z', weekNumber: 4, homeTeam: fallbackTeams['team1'], awayTeam: fallbackTeams['team8'], startingHole: 1, status: 'SCHEDULED' },
  { id: 'match17', date: '2025-05-06T18:00:00.000Z', weekNumber: 4, homeTeam: fallbackTeams['team2'], awayTeam: fallbackTeams['team5'], startingHole: 2, status: 'SCHEDULED' },
  { id: 'match18', date: '2025-05-06T18:00:00.000Z', weekNumber: 4, homeTeam: fallbackTeams['team3'], awayTeam: fallbackTeams['team4'], startingHole: 3, status: 'SCHEDULED' },
  { id: 'match19', date: '2025-05-06T18:00:00.000Z', weekNumber: 4, homeTeam: fallbackTeams['team10'], awayTeam: fallbackTeams['team6'], startingHole: 4, status: 'SCHEDULED' },
  { id: 'match20', date: '2025-05-06T18:00:00.000Z', weekNumber: 4, homeTeam: fallbackTeams['team9'], awayTeam: fallbackTeams['team7'], startingHole: 5, status: 'SCHEDULED' },
  
  // Week 5 - May 13, 2025
  { id: 'match21', date: '2025-05-13T18:00:00.000Z', weekNumber: 5, homeTeam: fallbackTeams['team5'], awayTeam: fallbackTeams['team3'], startingHole: 1, status: 'SCHEDULED' },
  { id: 'match22', date: '2025-05-13T18:00:00.000Z', weekNumber: 5, homeTeam: fallbackTeams['team4'], awayTeam: fallbackTeams['team1'], startingHole: 2, status: 'SCHEDULED' },
  { id: 'match23', date: '2025-05-13T18:00:00.000Z', weekNumber: 5, homeTeam: fallbackTeams['team7'], awayTeam: fallbackTeams['team10'], startingHole: 3, status: 'SCHEDULED' },
  { id: 'match24', date: '2025-05-13T18:00:00.000Z', weekNumber: 5, homeTeam: fallbackTeams['team8'], awayTeam: fallbackTeams['team9'], startingHole: 4, status: 'SCHEDULED' },
  { id: 'match25', date: '2025-05-13T18:00:00.000Z', weekNumber: 5, homeTeam: fallbackTeams['team6'], awayTeam: fallbackTeams['team2'], startingHole: 5, status: 'SCHEDULED' },
  
  // Week 6 - May 20, 2025
  { id: 'match26', date: '2025-05-20T18:00:00.000Z', weekNumber: 6, homeTeam: fallbackTeams['team1'], awayTeam: fallbackTeams['team9'], startingHole: 1, status: 'SCHEDULED' },
  { id: 'match27', date: '2025-05-20T18:00:00.000Z', weekNumber: 6, homeTeam: fallbackTeams['team10'], awayTeam: fallbackTeams['team8'], startingHole: 2, status: 'SCHEDULED' },
  { id: 'match28', date: '2025-05-20T18:00:00.000Z', weekNumber: 6, homeTeam: fallbackTeams['team2'], awayTeam: fallbackTeams['team7'], startingHole: 3, status: 'SCHEDULED' },
  { id: 'match29', date: '2025-05-20T18:00:00.000Z', weekNumber: 6, homeTeam: fallbackTeams['team3'], awayTeam: fallbackTeams['team6'], startingHole: 4, status: 'SCHEDULED' },
  { id: 'match30', date: '2025-05-20T18:00:00.000Z', weekNumber: 6, homeTeam: fallbackTeams['team4'], awayTeam: fallbackTeams['team5'], startingHole: 5, status: 'SCHEDULED' },
  
  // Week 7 - May 27, 2025
  { id: 'match31', date: '2025-05-27T18:00:00.000Z', weekNumber: 7, homeTeam: fallbackTeams['team7'], awayTeam: fallbackTeams['team3'], startingHole: 1, status: 'SCHEDULED' },
  { id: 'match32', date: '2025-05-27T18:00:00.000Z', weekNumber: 7, homeTeam: fallbackTeams['team6'], awayTeam: fallbackTeams['team4'], startingHole: 2, status: 'SCHEDULED' },
  { id: 'match33', date: '2025-05-27T18:00:00.000Z', weekNumber: 7, homeTeam: fallbackTeams['team8'], awayTeam: fallbackTeams['team2'], startingHole: 3, status: 'SCHEDULED' },
  { id: 'match34', date: '2025-05-27T18:00:00.000Z', weekNumber: 7, homeTeam: fallbackTeams['team9'], awayTeam: fallbackTeams['team10'], startingHole: 4, status: 'SCHEDULED' },
  { id: 'match35', date: '2025-05-27T18:00:00.000Z', weekNumber: 7, homeTeam: fallbackTeams['team1'], awayTeam: fallbackTeams['team5'], startingHole: 5, status: 'SCHEDULED' },
  
  // Week 8 - June 3, 2025
  { id: 'match36', date: '2025-06-03T18:00:00.000Z', weekNumber: 8, homeTeam: fallbackTeams['team4'], awayTeam: fallbackTeams['team8'], startingHole: 1, status: 'SCHEDULED' },
  { id: 'match37', date: '2025-06-03T18:00:00.000Z', weekNumber: 8, homeTeam: fallbackTeams['team5'], awayTeam: fallbackTeams['team6'], startingHole: 2, status: 'SCHEDULED' },
  { id: 'match38', date: '2025-06-03T18:00:00.000Z', weekNumber: 8, homeTeam: fallbackTeams['team3'], awayTeam: fallbackTeams['team9'], startingHole: 3, status: 'SCHEDULED' },
  { id: 'match39', date: '2025-06-03T18:00:00.000Z', weekNumber: 8, homeTeam: fallbackTeams['team2'], awayTeam: fallbackTeams['team10'], startingHole: 4, status: 'SCHEDULED' },
  { id: 'match40', date: '2025-06-03T18:00:00.000Z', weekNumber: 8, homeTeam: fallbackTeams['team1'], awayTeam: fallbackTeams['team7'], startingHole: 5, status: 'SCHEDULED' },
  
  // Week 9 - June 10, 2025
  { id: 'match41', date: '2025-06-10T18:00:00.000Z', weekNumber: 9, homeTeam: fallbackTeams['team8'], awayTeam: fallbackTeams['team3'], startingHole: 1, status: 'SCHEDULED' },
  { id: 'match42', date: '2025-06-10T18:00:00.000Z', weekNumber: 9, homeTeam: fallbackTeams['team9'], awayTeam: fallbackTeams['team2'], startingHole: 2, status: 'SCHEDULED' },
  { id: 'match43', date: '2025-06-10T18:00:00.000Z', weekNumber: 9, homeTeam: fallbackTeams['team10'], awayTeam: fallbackTeams['team1'], startingHole: 3, status: 'SCHEDULED' },
  { id: 'match44', date: '2025-06-10T18:00:00.000Z', weekNumber: 9, homeTeam: fallbackTeams['team7'], awayTeam: fallbackTeams['team4'], startingHole: 4, status: 'SCHEDULED' },
  { id: 'match45', date: '2025-06-10T18:00:00.000Z', weekNumber: 9, homeTeam: fallbackTeams['team6'], awayTeam: fallbackTeams['team5'], startingHole: 5, status: 'SCHEDULED' },
  
  // Week 11 - June 24, 2025
  { id: 'match46', date: '2025-06-24T18:00:00.000Z', weekNumber: 11, homeTeam: fallbackTeams['team10'], awayTeam: fallbackTeams['team6'], startingHole: 1, status: 'SCHEDULED' },
  { id: 'match47', date: '2025-06-24T18:00:00.000Z', weekNumber: 11, homeTeam: fallbackTeams['team7'], awayTeam: fallbackTeams['team9'], startingHole: 2, status: 'SCHEDULED' },
  { id: 'match48', date: '2025-06-24T18:00:00.000Z', weekNumber: 11, homeTeam: fallbackTeams['team8'], awayTeam: fallbackTeams['team2'], startingHole: 3, status: 'SCHEDULED' },
  { id: 'match49', date: '2025-06-24T18:00:00.000Z', weekNumber: 11, homeTeam: fallbackTeams['team3'], awayTeam: fallbackTeams['team4'], startingHole: 4, status: 'SCHEDULED' },
  { id: 'match50', date: '2025-06-24T18:00:00.000Z', weekNumber: 11, homeTeam: fallbackTeams['team1'], awayTeam: fallbackTeams['team5'], startingHole: 5, status: 'SCHEDULED' },
  
  // Week 12 - July 1, 2025
  { id: 'match51', date: '2025-07-01T18:00:00.000Z', weekNumber: 12, homeTeam: fallbackTeams['team2'], awayTeam: fallbackTeams['team4'], startingHole: 1, status: 'SCHEDULED' },
  { id: 'match52', date: '2025-07-01T18:00:00.000Z', weekNumber: 12, homeTeam: fallbackTeams['team5'], awayTeam: fallbackTeams['team6'], startingHole: 2, status: 'SCHEDULED' },
  { id: 'match53', date: '2025-07-01T18:00:00.000Z', weekNumber: 12, homeTeam: fallbackTeams['team3'], awayTeam: fallbackTeams['team9'], startingHole: 3, status: 'SCHEDULED' },
  { id: 'match54', date: '2025-07-01T18:00:00.000Z', weekNumber: 12, homeTeam: fallbackTeams['team1'], awayTeam: fallbackTeams['team7'], startingHole: 4, status: 'SCHEDULED' },
  { id: 'match55', date: '2025-07-01T18:00:00.000Z', weekNumber: 12, homeTeam: fallbackTeams['team8'], awayTeam: fallbackTeams['team10'], startingHole: 5, status: 'SCHEDULED' },
  
  // Week 13 - July 8, 2025
  { id: 'match56', date: '2025-07-08T18:00:00.000Z', weekNumber: 13, homeTeam: fallbackTeams['team6'], awayTeam: fallbackTeams['team9'], startingHole: 1, status: 'SCHEDULED' },
  { id: 'match57', date: '2025-07-08T18:00:00.000Z', weekNumber: 13, homeTeam: fallbackTeams['team8'], awayTeam: fallbackTeams['team3'], startingHole: 2, status: 'SCHEDULED' },
  { id: 'match58', date: '2025-07-08T18:00:00.000Z', weekNumber: 13, homeTeam: fallbackTeams['team1'], awayTeam: fallbackTeams['team4'], startingHole: 3, status: 'SCHEDULED' },
  { id: 'match59', date: '2025-07-08T18:00:00.000Z', weekNumber: 13, homeTeam: fallbackTeams['team7'], awayTeam: fallbackTeams['team2'], startingHole: 4, status: 'SCHEDULED' },
  { id: 'match60', date: '2025-07-08T18:00:00.000Z', weekNumber: 13, homeTeam: fallbackTeams['team5'], awayTeam: fallbackTeams['team10'], startingHole: 5, status: 'SCHEDULED' },
  
  // Week 14 - July 15, 2025
  { id: 'match61', date: '2025-07-15T18:00:00.000Z', weekNumber: 14, homeTeam: fallbackTeams['team2'], awayTeam: fallbackTeams['team5'], startingHole: 1, status: 'SCHEDULED' },
  { id: 'match62', date: '2025-07-15T18:00:00.000Z', weekNumber: 14, homeTeam: fallbackTeams['team1'], awayTeam: fallbackTeams['team9'], startingHole: 2, status: 'SCHEDULED' },
  { id: 'match63', date: '2025-07-15T18:00:00.000Z', weekNumber: 14, homeTeam: fallbackTeams['team3'], awayTeam: fallbackTeams['team7'], startingHole: 3, status: 'SCHEDULED' },
  { id: 'match64', date: '2025-07-15T18:00:00.000Z', weekNumber: 14, homeTeam: fallbackTeams['team4'], awayTeam: fallbackTeams['team10'], startingHole: 4, status: 'SCHEDULED' },
  { id: 'match65', date: '2025-07-15T18:00:00.000Z', weekNumber: 14, homeTeam: fallbackTeams['team6'], awayTeam: fallbackTeams['team8'], startingHole: 5, status: 'SCHEDULED' }
];

export default function MatchesPageClient() {
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
        
        // Filter to only show scheduled matches
        const scheduledMatches = (data.matches || []).filter((match: Match) => match.status === 'SCHEDULED')
        
        // Check if we have matches for all weeks (1-14, excluding week 10)
        const weeks = Array.from(new Set(scheduledMatches.map((match: Match) => match.weekNumber))).sort((a: number, b: number) => a - b);
        const expectedWeeks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14];
        const missingWeeks = expectedWeeks.filter(week => !weeks.includes(week));
        
        if (missingWeeks.length > 0 || scheduledMatches.length < 50) {
          console.log('Missing weeks or not enough matches, using fallback data');
          setMatches(fallbackMatches);
        } else {
          setMatches(scheduledMatches);
        }
      } catch (error) {
        console.error('Error loading matches:', error);
        setError('Failed to load matches, using fallback data');
        // Use fallback data in case of error
        setMatches(fallbackMatches);
      } finally {
        setLoading(false);
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