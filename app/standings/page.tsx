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
        <div className="text-masters-green">Loading standings...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#030f0f]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#92E3A9] to-[#4CAF50] mb-8">
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent"></div>
          <div className="relative px-8 py-6">
            <h1 className="text-4xl font-bold text-white mb-2 font-grifter">Standings</h1>
            <p className="text-white/90 font-grifter">View league standings and statistics</p>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-2xl transform translate-x-1/4 -translate-y-1/4"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-black/20 to-transparent rounded-full blur-xl transform -translate-x-1/4 translate-y-1/4"></div>
        </div>

        <div className="space-y-8">
          {/* Standings Table */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
            <div className="px-6 py-5 border-b border-white/10">
              <h2 className="text-2xl font-grifter text-white">League Standings</h2>
            </div>
            <div className="overflow-x-auto">
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">
                        {team.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white text-center">
                        {team.matchesPlayed}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white text-center">
                        {team.matchesWon}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white text-center">
                        {team.matchesLost}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white text-center font-bold">
                        {team.totalPoints}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* League Statistics */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
            <h3 className="text-2xl font-grifter text-white mb-4">
              League Statistics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <p className="text-sm text-white/60">Current Week</p>
                <p className="text-2xl font-grifter text-[#00df82]">{currentWeek}</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <p className="text-sm text-white/60">Total Matches Played</p>
                <p className="text-2xl font-grifter text-[#00df82]">
                  {standings.reduce((sum, team) => sum + team.matchesPlayed, 0)}
                </p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <p className="text-sm text-white/60">Average Points Per Match</p>
                <p className="text-2xl font-grifter text-[#00df82]">
                  {(standings.reduce((sum, team) => sum + team.totalPoints, 0) / 
                    standings.reduce((sum, team) => sum + team.matchesPlayed, 0)).toFixed(1)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 