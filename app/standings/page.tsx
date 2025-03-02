'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'

interface TeamStanding {
  id: string
  name: string
  totalPoints: number
  matchesPlayed: number
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
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-masters-text sm:truncate sm:text-3xl sm:tracking-tight">
            League Standings
          </h2>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Team
                </th>
                {Array.from({ length: currentWeek }, (_, i) => (
                  <th key={i + 1} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Week {i + 1}
                  </th>
                ))}
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Points
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {standings
                .sort((a, b) => b.totalPoints - a.totalPoints)
                .map((team, index) => (
                  <tr key={team.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-masters-green">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {team.name}
                    </td>
                    {Array.from({ length: currentWeek }, (_, i) => {
                      const weekPoints = team.weeklyPoints.find(wp => wp.weekNumber === i + 1)
                      return (
                        <td key={i} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                          {weekPoints ? weekPoints.points.toFixed(1) : '-'}
                        </td>
                      )
                    })}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-center">
                      {team.totalPoints.toFixed(1)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-masters-green mb-4">
          League Statistics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500">Current Week</p>
            <p className="text-2xl font-semibold text-masters-green">{currentWeek}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500">Total Matches Played</p>
            <p className="text-2xl font-semibold text-masters-green">
              {standings.reduce((sum, team) => sum + team.matchesPlayed, 0)}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500">Average Points Per Match</p>
            <p className="text-2xl font-semibold text-masters-green">
              {(standings.reduce((sum, team) => sum + team.totalPoints, 0) / 
                standings.reduce((sum, team) => sum + team.matchesPlayed, 0)).toFixed(1)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 