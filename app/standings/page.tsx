'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { RefreshCw } from 'lucide-react'

interface TeamStanding {
  teamId: string;
  teamName: string;
  matchesPlayed: number;
  matchesWon: number;
  matchesLost: number;
  matchesTied: number;
  leaguePoints: number;
  weeklyPoints: {
    weekNumber: number;
    points: number;
    matchId: string;
    opponent: string;
    result: 'W' | 'L' | 'T';
  }[];
  totalHomePoints: number;
  totalAwayPoints: number;
  winPercentage: number;
  streak: {
    type: 'W' | 'L' | 'T';
    count: number;
  };
}

interface PlayerStanding {
  playerId: string;
  playerName: string;
  totalGrossScore: number;
  totalNetScore: number;
  matchesPlayed: number;
  roundsPlayed: number;
}

export default function StandingsPage() {
  const [teamStandings, setTeamStandings] = useState<TeamStanding[]>([])
  const [playerStandings, setPlayerStandings] = useState<PlayerStanding[]>([])
  const [loading, setLoading] = useState(true)
  const [currentWeek, setCurrentWeek] = useState(1)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      fetchTeamStandings(),
      fetchPlayerStandings()
    ]).finally(() => {
      setLoading(false)
    })
  }, [])

  const fetchTeamStandings = async () => {
    try {
      setError(null)
      
      console.log('Fetching team standings data...')
      const response = await fetch('/api/standings')
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Failed to fetch team standings:', response.status, errorText)
        throw new Error(`Failed to fetch team standings: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json()
      console.log('Received team standings data:', data)
      
      if (!Array.isArray(data)) {
        console.error('Invalid team standings data format:', data)
        throw new Error('Invalid team standings data format')
      }
      
      setTeamStandings(data)
      
      // Find the highest week number
      if (data.length > 0 && data[0].weeklyPoints && data[0].weeklyPoints.length > 0) {
        const maxWeek = Math.max(...data.flatMap(team => 
          team.weeklyPoints.map(wp => wp.weekNumber)
        ))
        setCurrentWeek(maxWeek)
      }
    } catch (error) {
      console.error('Error fetching team standings:', error)
      setError(error instanceof Error ? error.message : 'Unknown error')
    }
  }

  const fetchPlayerStandings = async () => {
    try {
      console.log('Fetching player standings data...')
      const response = await fetch('/api/player-standings')
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Failed to fetch player standings:', response.status, errorText)
        // Don't set the error state here to avoid blocking the team standings display
        return
      }
      
      const data = await response.json()
      console.log('Received player standings data:', data)
      
      if (!Array.isArray(data)) {
        console.error('Invalid player standings data format:', data)
        return
      }
      
      setPlayerStandings(data)
    } catch (error) {
      console.error('Error fetching player standings:', error)
      // Don't set the error state here to avoid blocking the team standings display
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030f0f] relative overflow-hidden">
        {/* Futuristic background elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00df82]/20 to-[#4CAF50]/10" />
          <div className="absolute inset-0 opacity-10">
            <div className="h-full w-full bg-[url('/grid-pattern.svg')] bg-repeat bg-[length:50px_50px]" />
          </div>
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#00df82]/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-[#4CAF50]/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00df82]"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#030f0f] relative overflow-hidden">
        {/* Futuristic background elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00df82]/20 to-[#4CAF50]/10" />
          <div className="absolute inset-0 opacity-10">
            <div className="h-full w-full bg-[url('/grid-pattern.svg')] bg-repeat bg-[length:50px_50px]" />
          </div>
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#00df82]/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-[#4CAF50]/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
          <div className="text-red-500 text-xl font-orbitron mb-4">Error loading standings</div>
          <div className="text-white/70 font-orbitron mb-6">{error}</div>
          <button 
            onClick={() => {
              fetchTeamStandings();
              fetchPlayerStandings();
            }} 
            className="px-4 py-2 bg-[#00df82]/20 border border-[#00df82]/50 rounded-lg text-white hover:bg-[#00df82]/30 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#030f0f] relative overflow-hidden">
      {/* Futuristic background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#00df82]/20 to-[#4CAF50]/10" />
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full bg-[url('/grid-pattern.svg')] bg-repeat bg-[length:50px_50px]" />
        </div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#00df82]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-[#4CAF50]/10 rounded-full blur-3xl" />
      </div>
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-audiowide text-white">League Standings</h1>
          {/* Removed the refresh button as requested */}
        </div>

        <div className="space-y-8">
          {error && (
            <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-white">
              <p>Error loading standings: {error}</p>
              <button 
                onClick={() => {
                  setLoading(true);
                  Promise.all([fetchTeamStandings(), fetchPlayerStandings()]).finally(() => setLoading(false));
                }}
                className="mt-2 px-4 py-2 bg-red-500/30 hover:bg-red-500/40 rounded-lg text-white"
              >
                Try Again
              </button>
            </div>
          )}
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 border-4 border-[#00df82]/20 border-t-[#00df82] rounded-full animate-spin"></div>
              <p className="mt-4 text-white font-orbitron">Loading standings data...</p>
            </div>
          ) : (
            <>
              {/* League Standings Table */}
              <div className="relative overflow-hidden rounded-2xl border border-[#00df82]/30 backdrop-blur-sm bg-[#030f0f]/50">
                <div className="absolute inset-0 bg-gradient-to-br from-[#00df82]/5 to-transparent"></div>
                <div className="px-6 py-5 border-b border-white/10 relative z-10">
                  <h2 className="text-2xl font-audiowide text-white">League Standings</h2>
                </div>
                <div className="overflow-x-auto relative z-10">
                  {teamStandings.length > 0 ? (
                    <table className="min-w-full divide-y divide-white/10">
                      <thead>
                        <tr className="text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                          <th className="px-3 py-3 w-24 sm:w-28">Position</th>
                          <th className="px-3 py-3">Team</th>
                          <th className="px-3 py-3 text-center w-16">W/L</th>
                          <th className="px-3 py-3 text-center w-20">Points</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10">
                        {teamStandings.map((team, index) => (
                          <tr key={team.teamId} className="hover:bg-white/5 transition-colors">
                            <td className="px-3 py-4 whitespace-nowrap">
                              <div className="w-10 h-10 rounded-full bg-[#00df82]/10 border border-[#00df82]/30 flex items-center justify-center text-white font-orbitron">
                                {index + 1}
                              </div>
                            </td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-white font-audiowide">
                              {team.teamName}
                            </td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-white text-center font-orbitron">
                              {team.matchesWon}-{team.matchesLost}{team.matchesTied > 0 ? `-${team.matchesTied}` : ''}
                            </td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-[#00df82] text-center font-orbitron">
                              {team.leaguePoints}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="p-6 text-white/70 font-orbitron text-center">
                      No standings data available. Please check back after matches have been played.
                    </div>
                  )}
                </div>
              </div>

              {/* Player Standings */}
              <div className="relative overflow-hidden rounded-2xl border border-[#00df82]/30 backdrop-blur-sm bg-[#030f0f]/50">
                <div className="absolute inset-0 bg-gradient-to-br from-[#00df82]/5 to-transparent"></div>
                <div className="px-6 py-5 border-b border-white/10 relative z-10">
                  <h2 className="text-2xl font-audiowide text-white">Player Standings</h2>
                </div>
                <div className="overflow-x-auto relative z-10">
                  {playerStandings.length > 0 ? (
                    <table className="min-w-full divide-y divide-white/10">
                      <thead>
                        <tr className="text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                          <th className="px-3 py-3 w-24 sm:w-28">Ranking</th>
                          <th className="px-3 py-3">Player</th>
                          <th className="px-3 py-3 text-center w-24">Net Score</th>
                          <th className="px-3 py-3 text-center w-24">Gross Score</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10">
                        {playerStandings.map((player, index) => (
                          <tr key={player.playerId} className="hover:bg-white/5 transition-colors">
                            <td className="px-3 py-4 whitespace-nowrap">
                              <div className="w-10 h-10 rounded-full bg-[#00df82]/10 border border-[#00df82]/30 flex items-center justify-center text-white font-orbitron">
                                {index + 1}
                              </div>
                            </td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-white font-audiowide">
                              {player.playerName}
                            </td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-[#00df82] text-center font-orbitron">
                              {player.totalNetScore}
                            </td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-white text-center font-orbitron">
                              {player.totalGrossScore}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="p-6 text-white/70 font-orbitron text-center">
                      No player standings data available. Please check back after matches have been played.
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}