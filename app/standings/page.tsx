'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'

interface TeamStanding {
  id: string
  name: string
  totalPoints: number
  matchesPlayed: number
  matchesWon: number
  matchesLost: number
  weeklyPoints: {
    weekNumber: number
    points: number
  }[]
}

export default function StandingsPage() {
  const [standings, setStandings] = useState<TeamStanding[]>([])
  const [loading, setLoading] = useState(true)
  const [currentWeek, setCurrentWeek] = useState(1)

  useEffect(() => {
    fetchStandings()
  }, [])

  const fetchStandings = async () => {
    try {
      const response = await fetch('/api/standings')
      if (!response.ok) throw new Error('Failed to fetch standings')
      const data = await response.json()
      setStandings(data)
      // Find the highest week number
      const maxWeek = Math.max(...data.flatMap(team => 
        team.weeklyPoints.map(wp => wp.weekNumber)
      ))
      setCurrentWeek(maxWeek)
    } catch (error) {
      console.error('Error fetching standings:', error)
      // Fallback to mock data for now
      setStandings([
        {
          id: '1',
          name: 'Team Eagles',
          totalPoints: 15.5,
          matchesPlayed: 4,
          matchesWon: 3,
          matchesLost: 1,
          weeklyPoints: [
            { weekNumber: 1, points: 4.5 },
            { weekNumber: 2, points: 3.0 },
            { weekNumber: 3, points: 4.0 },
            { weekNumber: 4, points: 4.0 },
          ],
        },
        // Add more mock data as needed
      ])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00df82]"></div>
      </div>
    )
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
          <div className="relative px-8 py-6">
            <h1 className="text-4xl font-audiowide text-white mb-2">Standings</h1>
            <p className="text-white/90 font-orbitron tracking-wide">View league standings and statistics</p>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-2xl transform translate-x-1/4 -translate-y-1/4"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-black/20 to-transparent rounded-full blur-xl transform -translate-x-1/4 translate-y-1/4"></div>
        </div>

        <div className="space-y-8">
          {/* Standings Table */}
          <div className="relative overflow-hidden rounded-2xl border border-[#00df82]/30 backdrop-blur-sm bg-[#030f0f]/50">
            <div className="absolute inset-0 bg-gradient-to-br from-[#00df82]/5 to-transparent"></div>
            <div className="px-6 py-5 border-b border-white/10 relative z-10">
              <h2 className="text-2xl font-audiowide text-white">League Standings</h2>
            </div>
            <div className="overflow-x-auto relative z-10">
              <table className="min-w-full divide-y divide-white/10">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Position</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Team</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-white/60 uppercase tracking-wider">Matches</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-white/60 uppercase tracking-wider">Won</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-white/60 uppercase tracking-wider">Lost</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-white/60 uppercase tracking-wider">Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {standings.map((team, index) => (
                    <tr key={team.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-audiowide">
                        {team.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white text-center font-orbitron">
                        {team.matchesPlayed}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white text-center font-orbitron">
                        {team.matchesWon}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white text-center font-orbitron">
                        {team.matchesLost}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#00df82] text-center font-audiowide">
                        {team.totalPoints}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* League Statistics */}
          <div className="relative overflow-hidden rounded-2xl border border-[#00df82]/30 backdrop-blur-sm bg-[#030f0f]/50 p-6">
            <div className="absolute inset-0 bg-gradient-to-br from-[#00df82]/5 to-transparent"></div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#00df82]/10 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <h3 className="text-2xl font-audiowide text-white mb-4">
                League Statistics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="relative overflow-hidden rounded-xl border border-[#00df82]/20 backdrop-blur-sm bg-[#030f0f]/70 p-4">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#00df82]/5 to-transparent"></div>
                  <div className="relative">
                    <p className="text-sm text-white/60 font-orbitron">Current Week</p>
                    <p className="text-2xl font-audiowide text-[#00df82]">{currentWeek}</p>
                  </div>
                </div>
                <div className="relative overflow-hidden rounded-xl border border-[#00df82]/20 backdrop-blur-sm bg-[#030f0f]/70 p-4">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#00df82]/5 to-transparent"></div>
                  <div className="relative">
                    <p className="text-sm text-white/60 font-orbitron">Total Matches Played</p>
                    <p className="text-2xl font-audiowide text-[#00df82]">
                      {standings.reduce((sum, team) => sum + team.matchesPlayed, 0)}
                    </p>
                  </div>
                </div>
                <div className="relative overflow-hidden rounded-xl border border-[#00df82]/20 backdrop-blur-sm bg-[#030f0f]/70 p-4">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#00df82]/5 to-transparent"></div>
                  <div className="relative">
                    <p className="text-sm text-white/60 font-orbitron">Average Points Per Match</p>
                    <p className="text-2xl font-audiowide text-[#00df82]">
                      {(standings.reduce((sum, team) => sum + team.totalPoints, 0) / 
                        standings.reduce((sum, team) => sum + team.matchesPlayed, 0)).toFixed(1)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 