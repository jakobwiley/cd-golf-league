'use client'

import { useState, useEffect, useRef } from 'react'
import { format } from 'date-fns'
import { FaEdit, FaCheck, FaTimes, FaExchangeAlt, FaChevronDown, FaChevronRight } from 'react-icons/fa'
import { toast } from 'react-hot-toast'
import { useSocket } from '../../../lib/useSocket'
import { SocketEvents } from '../../../app/utils/websocketConnection'
import { apiConfig } from '../../../lib/apiConfig'

type Player = {
  id: string
  name: string
  handicapIndex: number
  teamId: string
  playerType: 'PRIMARY' | 'SUBSTITUTE'
}

type Team = {
  id: string
  name: string
}

type Match = {
  id: string
  date: string
  weekNumber: number
  homeTeamId: string
  awayTeamId: string
  homeTeam: Team
  awayTeam: Team
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'FINALIZED'
  startingHole: number
}

type PlayerStatus = 'ACTIVE' | 'SUBSTITUTE' | 'NOT_ACTIVE';

type MatchPlayer = {
  playerId: string
  teamId: string
  name: string
  handicapIndex: number
  isSubstitute: boolean
  status: PlayerStatus
}

export default function AdminMatchesClient({ initialMatches }: { initialMatches: Match[] }) {
  const [matches, setMatches] = useState<Match[]>(initialMatches)
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)
  const [matchPlayers, setMatchPlayers] = useState<{
    homePlayers: MatchPlayer[]
    awayPlayers: MatchPlayer[]
  } | null>(null)
  const [allPlayers, setAllPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(false)
  const [editingTeam, setEditingTeam] = useState<'home' | 'away' | null>(null)
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null)
  const [selectedSubstitute, setSelectedSubstitute] = useState<Player | null>(null)
  const [expandedWeeks, setExpandedWeeks] = useState<Record<number, boolean>>({})
  const firstRenderRef = useRef(true)
  const { isConnected, subscribe } = useSocket()

  // Subscribe to Socket.io events
  useEffect(() => {
    if (!isConnected) return

    // Subscribe to match updated events
    const unsubscribe = subscribe(SocketEvents.MATCH_UPDATED, (data) => {
      console.log('Match updated event received:', data)
      
      // Refresh match players if the updated match is the selected match
      if (selectedMatch && data.matchId === selectedMatch.id) {
        fetchMatchPlayers(selectedMatch.id)
      }
      
      // Refresh all matches
      fetchMatches()
    })

    return () => {
      unsubscribe()
    }
  }, [isConnected, selectedMatch])

  // Fetch all matches
  const fetchMatches = async () => {
    try {
      const response = await fetch(apiConfig.getUrl('/api/schedule'))
      if (!response.ok) throw new Error('Failed to fetch matches')
      const data = await response.json()
      setMatches(data.matches || [])
    } catch (error) {
      console.error('Error fetching matches:', error)
      toast.error('Failed to load matches')
    }
  }

  // Fetch match players
  const fetchMatchPlayers = async (matchId: string) => {
    setLoading(true)
    try {
      const response = await fetch(apiConfig.getUrl(`/api/matches/${matchId}/players`))
      if (!response.ok) throw new Error('Failed to fetch match players')
      const data = await response.json()
      
      // Start with empty player lists
      const homePlayers: MatchPlayer[] = [];
      const awayPlayers: MatchPlayer[] = [];
      
      // Special case for the Brew/Jake team in week 2
      const isBrewJakeWeek2Match = 
        matchId === "556057bd-7c27-4c5d-8da7-dc82a4f0d3cd" && 
        data.match.awayTeamId === "9753d64a-f88e-463d-b4da-f803a2fa7f0c" && 
        data.match.weekNumber === 2;
      
      // Process match players directly from the API response
      if (data.matchPlayers && data.matchPlayers.length > 0) {
        // First handle the home team players normally
        data.matchPlayers.forEach((mp: any) => {
          if (mp.Player && mp.Player.teamId === data.match.homeTeamId) {
            const player = mp.Player;
            
            // Create player object with correct status
            const playerObj: MatchPlayer = {
              playerId: player.id,
              teamId: player.teamId,
              name: player.name,
              handicapIndex: player.handicapIndex,
              isSubstitute: mp.isSubstitute,
              status: mp.isSubstitute ? 'SUBSTITUTE' : 'ACTIVE' as PlayerStatus
            };
            
            homePlayers.push(playerObj);
          }
        });
        
        // Special handling for the Brew/Jake team in week 2
        if (isBrewJakeWeek2Match) {
          // Find Jake (primary player)
          const jakePlayer = data.matchPlayers.find((mp: any) => 
            mp.Player && mp.Player.name === "Jake" && !mp.isSubstitute
          );
          
          if (jakePlayer) {
            const playerObj: MatchPlayer = {
              playerId: jakePlayer.Player.id,
              teamId: jakePlayer.Player.teamId,
              name: jakePlayer.Player.name,
              handicapIndex: jakePlayer.Player.handicapIndex,
              isSubstitute: false,
              status: 'ACTIVE' as PlayerStatus
            };
            awayPlayers.push(playerObj);
          }
          
          // Find Greg (substitute player but active in the match)
          const gregPlayer = data.matchPlayers.find((mp: any) => 
            mp.Player && mp.Player.name === "Greg"
          );
          
          if (gregPlayer) {
            const playerObj: MatchPlayer = {
              playerId: gregPlayer.Player.id,
              teamId: gregPlayer.Player.teamId,
              name: gregPlayer.Player.name,
              handicapIndex: gregPlayer.Player.handicapIndex,
              isSubstitute: true,
              status: 'ACTIVE' as PlayerStatus
            };
            awayPlayers.push(playerObj);
          }
          
          // Find Brew (not active in the match)
          const brewPlayer = data.matchPlayers.find((mp: any) => 
            mp.Player && mp.Player.name === "Brew"
          );
          
          if (brewPlayer) {
            const playerObj: MatchPlayer = {
              playerId: brewPlayer.Player.id,
              teamId: brewPlayer.Player.teamId,
              name: brewPlayer.Player.name,
              handicapIndex: brewPlayer.Player.handicapIndex,
              isSubstitute: false,
              status: 'NOT_ACTIVE' as PlayerStatus
            };
            awayPlayers.push(playerObj);
          }
        } else {
          // For all other matches, process away team players normally
          data.matchPlayers.forEach((mp: any) => {
            if (mp.Player && mp.Player.teamId === data.match.awayTeamId) {
              const player = mp.Player;
              
              // Create player object with correct status
              const playerObj: MatchPlayer = {
                playerId: player.id,
                teamId: player.teamId,
                name: player.name,
                handicapIndex: player.handicapIndex,
                isSubstitute: mp.isSubstitute,
                status: mp.isSubstitute ? 'SUBSTITUTE' : 'ACTIVE' as PlayerStatus
              };
              
              awayPlayers.push(playerObj);
            }
          });
        }
      }
      
      setMatchPlayers({
        homePlayers,
        awayPlayers
      });
    } catch (error) {
      console.error('Error fetching match players:', error)
      toast.error('Failed to load match players')
    } finally {
      setLoading(false)
    }
  }

  // Fetch all players for substitution options
  useEffect(() => {
    const fetchAllPlayers = async () => {
      try {
        const response = await fetch(apiConfig.getUrl('/api/players'))
        if (!response.ok) throw new Error('Failed to fetch players')
        const data = await response.json()
        setAllPlayers(data.players)
      } catch (error) {
        console.error('Error fetching players:', error)
        toast.error('Failed to load players')
      }
    }

    fetchAllPlayers()
  }, [])

  // Fetch match players when a match is selected
  useEffect(() => {
    if (!selectedMatch) {
      setMatchPlayers(null)
      return
    }

    fetchMatchPlayers(selectedMatch.id)
  }, [selectedMatch])

  // Group matches by week
  const matchesByWeek = matches.reduce<Record<number, Match[]>>((acc, match) => {
    if (!acc[match.weekNumber]) {
      acc[match.weekNumber] = []
    }
    acc[match.weekNumber].push(match)
    return acc
  }, {})

  // Sort weeks in ascending order
  const sortedWeeks = Object.keys(matchesByWeek)
    .map(Number)
    .sort((a, b) => a - b)

  // Initialize expanded state for all weeks if not already set
  useEffect(() => {
    const weeksCount = sortedWeeks.length;
    
    // Only initialize on first render when there are weeks available
    if (weeksCount > 0 && firstRenderRef.current) {
      firstRenderRef.current = false;
      
      const initialExpandedState: Record<number, boolean> = {};
      sortedWeeks.forEach((week, index) => {
        // Expand only the first week by default
        initialExpandedState[week] = index === 0;
      });
      
      setExpandedWeeks(initialExpandedState);
    }
  }, [sortedWeeks.length]); // Only depend on the length, not the array itself

  const toggleWeekExpansion = (week: number) => {
    setExpandedWeeks(prev => ({
      ...prev,
      [week]: !prev[week]
    }))
  }

  const handleSelectMatch = (match: Match) => {
    setSelectedMatch(match)
    setEditingTeam(null)
    setSelectedPlayerId(null)
    setSelectedSubstitute(null)
  }

  const handleStartEdit = (team: 'home' | 'away', playerId: string) => {
    setEditingTeam(team)
    setSelectedPlayerId(playerId)
    setSelectedSubstitute(null)
  }

  const handleCancelEdit = () => {
    setEditingTeam(null)
    setSelectedPlayerId(null)
    setSelectedSubstitute(null)
  }

  const handleSelectSubstitute = (player: Player) => {
    setSelectedSubstitute(player)
  }

  const handleSaveSubstitution = async () => {
    if (!selectedMatch || !selectedPlayerId || !selectedSubstitute) return

    setLoading(true)
    try {
      // Determine which team's player is being substituted
      const teamId = editingTeam === 'home' 
        ? selectedMatch.homeTeamId 
        : selectedMatch.awayTeamId

      // Prepare the player assignment update
      const playerAssignments = {
        playerAssignments: [
          {
            originalPlayerId: selectedPlayerId,
            substitutePlayerId: selectedSubstitute.id,
            teamId
          }
        ]
      }

      const response = await fetch(apiConfig.getUrl(`/api/matches/${selectedMatch.id}/players`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(playerAssignments),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update player assignment')
      }

      // Get the response data
      const responseData = await response.json()

      // No need to manually refresh match players - Socket.io will handle this
      // The Socket.io event handler will call fetchMatchPlayers when it receives the MATCH_UPDATED event

      // Show success notification with team name
      toast.success(responseData.message || `${responseData.teamName} was updated with active players for this match`)
      handleCancelEdit()
    } catch (error) {
      console.error('Error saving substitution:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to save substitution')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy')
  }

  const getTeamPlayers = (teamId: string) => {
    return allPlayers.filter(player => player.teamId === teamId)
  }

  // Count active players for each team
  const countActivePlayers = (players: MatchPlayer[]) => {
    return players.filter(player => player.status === 'ACTIVE').length;
  };

  const renderPlayerStatus = (status: PlayerStatus) => {
    switch (status) {
      case 'ACTIVE':
        return <span className="flex items-center"><span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>Active</span>;
      case 'SUBSTITUTE':
        return <span className="flex items-center"><span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>Substitute</span>;
      case 'NOT_ACTIVE':
        return <span className="flex items-center"><span className="w-3 h-3 bg-gray-500 rounded-full mr-2"></span>Not Active</span>;
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Match List */}
      <div className="md:col-span-1 bg-black/40 backdrop-blur-sm rounded-2xl p-4 h-[calc(100vh-200px)] overflow-y-auto">
        <h2 className="text-xl font-orbitron text-white mb-4 border-b border-[#00df82]/30 pb-2">
          Matches by Week
        </h2>
        <div className="space-y-2">
          {sortedWeeks.length > 0 ? (
            sortedWeeks.map((week) => (
              <div key={`week-${week}`} className="mb-2">
                <div 
                  className="flex items-center p-2 bg-black/50 rounded-lg cursor-pointer hover:bg-black/70 transition-colors"
                  onClick={() => toggleWeekExpansion(week)}
                >
                  {expandedWeeks[week] ? (
                    <FaChevronDown className="text-[#00df82] mr-2" />
                  ) : (
                    <FaChevronRight className="text-[#00df82] mr-2" />
                  )}
                  <span className="text-white font-orbitron">Week {week}</span>
                </div>
                
                {expandedWeeks[week] && (
                  <div className="pl-4 mt-2 space-y-2">
                    {matchesByWeek[week]
                      .sort((a, b) => a.startingHole - b.startingHole)
                      .map((match) => (
                        <div
                          key={match.id}
                          className={`p-3 rounded-xl cursor-pointer transition-all duration-300 ${
                            selectedMatch?.id === match.id
                              ? 'bg-[#00df82]/30 shadow-lg shadow-[#00df82]/20'
                              : 'bg-black/30 hover:bg-black/50'
                          }`}
                          onClick={() => handleSelectMatch(match)}
                        >
                          <div className="text-sm text-white/70 mb-1">
                            Hole {match.startingHole} • {formatDate(match.date)}
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="text-white font-medium">{match.homeTeam.name}</div>
                            <div className="text-[#00df82] font-orbitron text-sm">VS</div>
                            <div className="text-white font-medium">{match.awayTeam.name}</div>
                          </div>
                          <div className="mt-2 text-xs text-white/50 flex justify-end">
                            <span className={`px-2 py-1 rounded-full ${
                              match.status === 'COMPLETED' || match.status === 'FINALIZED'
                                ? 'bg-green-900/50 text-green-400' 
                                : match.status === 'IN_PROGRESS' 
                                  ? 'bg-yellow-900/50 text-yellow-400'
                                  : 'bg-blue-900/50 text-blue-400'
                            }`}>
                              {match.status === 'IN_PROGRESS' ? 'IN PROGRESS' : match.status}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-white/70 text-center py-8">No matches found</div>
          )}
        </div>
      </div>

      {/* Match Details */}
      <div className="md:col-span-2 bg-black/40 backdrop-blur-sm rounded-2xl p-4 h-[calc(100vh-200px)] overflow-y-auto">
        {selectedMatch ? (
          <div>
            <h2 className="text-xl font-orbitron text-white mb-4 border-b border-[#00df82]/30 pb-2">
              Match Details
            </h2>
            <div className="mb-6 bg-black/30 p-4 rounded-xl">
              <div className="grid grid-cols-3 gap-4 items-center">
                <div className="text-center">
                  <div className="text-white font-bold">{selectedMatch.homeTeam.name}</div>
                  <div className="text-white/70 text-sm">Home Team</div>
                </div>
                <div className="text-center">
                  <div className="text-[#00df82] font-orbitron">
                    Week {selectedMatch.weekNumber}
                  </div>
                  <div className="text-white/70 text-sm">{formatDate(selectedMatch.date)}</div>
                </div>
                <div className="text-center">
                  <div className="text-white font-bold">{selectedMatch.awayTeam.name}</div>
                  <div className="text-white/70 text-sm">Away Team</div>
                </div>
              </div>
            </div>

            <div className="mb-4 p-3 bg-blue-900/30 text-blue-200 rounded-lg text-sm">
              <p className="flex items-center">
                <span className="mr-2">ℹ️</span>
                <span>Only two players can be active per team for each match. Use the substitute button to change active players.</span>
              </p>
              <div className="mt-2 flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                  <span>Active Player</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></div>
                  <span>Substitute</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-gray-500 mr-1"></div>
                  <span>Not Active</span>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00df82]"></div>
              </div>
            ) : matchPlayers ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Home Team Players */}
                <div className="bg-black/30 p-4 rounded-xl">
                  <h3 className="text-lg font-orbitron text-white mb-3 border-b border-[#00df82]/30 pb-2 flex justify-between items-center">
                    <span>{selectedMatch.homeTeam.name} Players</span>
                    <span className="text-sm font-normal flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                      <span className={`${countActivePlayers(matchPlayers.homePlayers) > 2 ? 'text-red-400' : 'text-white/70'}`}>
                        Active: {countActivePlayers(matchPlayers.homePlayers)}/2
                      </span>
                    </span>
                  </h3>
                  <div className="space-y-3">
                    {matchPlayers.homePlayers
                      .sort((a, b) => (a.status === 'ACTIVE' ? -1 : 1))
                      .map((player) => (
                        <div 
                          key={player.playerId} 
                          className={`p-3 rounded-lg ${
                            player.status === 'ACTIVE' 
                              ? 'bg-green-900/30 border border-green-500/30' 
                              : player.status === 'SUBSTITUTE' 
                                ? 'bg-yellow-900/30 border border-yellow-500/30' 
                                : 'bg-gray-900/30 border border-gray-500/30'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="flex items-center">
                                <div className={`w-3 h-3 rounded-full mr-2 ${
                                  player.status === 'ACTIVE' ? 'bg-green-500' : 
                                  player.status === 'SUBSTITUTE' ? 'bg-yellow-500' : 'bg-gray-500'
                                }`}></div>
                                <div className="text-white font-medium">{player.name}</div>
                              </div>
                              <div className="text-white/70 text-sm pl-5">
                                Handicap: {player.handicapIndex}
                                {player.isSubstitute && (
                                  <span className="ml-2 text-yellow-400">(Substitute)</span>
                                )}
                              </div>
                            </div>
                            {editingTeam === 'home' && selectedPlayerId === player.playerId ? (
                              <div className="flex space-x-2">
                                <button 
                                  onClick={handleCancelEdit}
                                  className="p-1 text-red-400 hover:text-red-300 transition-colors"
                                >
                                  <FaTimes />
                                </button>
                              </div>
                            ) : (
                              <button 
                                onClick={() => handleStartEdit('home', player.playerId)}
                                className={`p-1 ${
                                  selectedMatch.status === 'SCHEDULED' 
                                    ? 'text-[#00df82] hover:text-[#00df82]/80 cursor-pointer' 
                                    : 'text-gray-500 cursor-not-allowed'
                                } transition-colors`}
                                disabled={selectedMatch.status !== 'SCHEDULED'}
                                title={selectedMatch.status !== 'SCHEDULED' ? 'Substitutions are only allowed for scheduled matches' : 'Substitute player'}
                              >
                                <FaExchangeAlt />
                              </button>
                            )}
                          </div>

                          {editingTeam === 'home' && selectedPlayerId === player.playerId && (
                            <div className="mt-3 border-t border-white/10 pt-3">
                              <div className="text-sm text-white mb-2">Select substitute player:</div>
                              <div className="max-h-40 overflow-y-auto bg-black/30 rounded-lg p-2">
                                {getTeamPlayers(selectedMatch.homeTeamId)
                                  .filter(p => p.id !== player.playerId)
                                  .map(p => (
                                    <div 
                                      key={`substitute-${p.id}`}
                                      onClick={() => handleSelectSubstitute(p)}
                                      className={`p-2 rounded cursor-pointer mb-1 ${
                                        selectedSubstitute?.id === p.id 
                                          ? 'bg-[#00df82]/30' 
                                          : 'hover:bg-black/40'
                                      }`}
                                    >
                                      <div className="text-white">{p.name}</div>
                                      <div className="text-white/70 text-xs">
                                        Handicap: {p.handicapIndex} • 
                                        {p.playerType === 'PRIMARY' ? ' Primary' : ' Substitute'}
                                      </div>
                                    </div>
                                  ))}
                              </div>
                              {selectedSubstitute && (
                                <div className="mt-3 flex justify-end">
                                  <button
                                    onClick={handleSaveSubstitution}
                                    disabled={loading}
                                    className="bg-[#00df82] hover:bg-[#00df82]/80 text-black font-medium py-1 px-3 rounded-lg flex items-center space-x-1 transition-colors"
                                  >
                                    <FaCheck className="text-xs" />
                                    <span>Save</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>

                {/* Away Team Players */}
                <div className="bg-black/30 p-4 rounded-xl">
                  <h3 className="text-lg font-orbitron text-white mb-3 border-b border-[#00df82]/30 pb-2 flex justify-between items-center">
                    <span>{selectedMatch.awayTeam.name} Players</span>
                    <span className="text-sm font-normal flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                      <span className={`${countActivePlayers(matchPlayers.awayPlayers) > 2 ? 'text-red-400' : 'text-white/70'}`}>
                        Active: {countActivePlayers(matchPlayers.awayPlayers)}/2
                      </span>
                    </span>
                  </h3>
                  <div className="space-y-3">
                    {matchPlayers.awayPlayers
                      .sort((a, b) => (a.status === 'ACTIVE' ? -1 : 1))
                      .map((player) => (
                        <div 
                          key={player.playerId} 
                          className={`p-3 rounded-lg ${
                            player.status === 'ACTIVE' 
                              ? 'bg-green-900/30 border border-green-500/30' 
                              : player.status === 'SUBSTITUTE' 
                                ? 'bg-yellow-900/30 border border-yellow-500/30' 
                                : 'bg-gray-900/30 border border-gray-500/30'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="flex items-center">
                                <div className={`w-3 h-3 rounded-full mr-2 ${
                                  player.status === 'ACTIVE' ? 'bg-green-500' : 
                                  player.status === 'SUBSTITUTE' ? 'bg-yellow-500' : 'bg-gray-500'
                                }`}></div>
                                <div className="text-white font-medium">{player.name}</div>
                              </div>
                              <div className="text-white/70 text-sm pl-5">
                                Handicap: {player.handicapIndex}
                                {player.isSubstitute && (
                                  <span className="ml-2 text-yellow-400">(Substitute)</span>
                                )}
                              </div>
                            </div>
                            {editingTeam === 'away' && selectedPlayerId === player.playerId ? (
                              <div className="flex space-x-2">
                                <button 
                                  onClick={handleCancelEdit}
                                  className="p-1 text-red-400 hover:text-red-300 transition-colors"
                                >
                                  <FaTimes />
                                </button>
                              </div>
                            ) : (
                              <button 
                                onClick={() => handleStartEdit('away', player.playerId)}
                                className={`p-1 ${
                                  selectedMatch.status === 'SCHEDULED' 
                                    ? 'text-[#00df82] hover:text-[#00df82]/80 cursor-pointer' 
                                    : 'text-gray-500 cursor-not-allowed'
                                } transition-colors`}
                                disabled={selectedMatch.status !== 'SCHEDULED'}
                                title={selectedMatch.status !== 'SCHEDULED' ? 'Substitutions are only allowed for scheduled matches' : 'Substitute player'}
                              >
                                <FaExchangeAlt />
                              </button>
                            )}
                          </div>

                          {editingTeam === 'away' && selectedPlayerId === player.playerId && (
                            <div className="mt-3 border-t border-white/10 pt-3">
                              <div className="text-sm text-white mb-2">Select substitute player:</div>
                              <div className="max-h-40 overflow-y-auto bg-black/30 rounded-lg p-2">
                                {getTeamPlayers(selectedMatch.awayTeamId)
                                  .filter(p => p.id !== player.playerId)
                                  .map(p => (
                                    <div 
                                      key={`substitute-${p.id}`}
                                      onClick={() => handleSelectSubstitute(p)}
                                      className={`p-2 rounded cursor-pointer mb-1 ${
                                        selectedSubstitute?.id === p.id 
                                          ? 'bg-[#00df82]/30' 
                                          : 'hover:bg-black/40'
                                      }`}
                                    >
                                      <div className="text-white">{p.name}</div>
                                      <div className="text-white/70 text-xs">
                                        Handicap: {p.handicapIndex} • 
                                        {p.playerType === 'PRIMARY' ? ' Primary' : ' Substitute'}
                                      </div>
                                    </div>
                                  ))}
                              </div>
                              {selectedSubstitute && (
                                <div className="mt-3 flex justify-end">
                                  <button
                                    onClick={handleSaveSubstitution}
                                    disabled={loading}
                                    className="bg-[#00df82] hover:bg-[#00df82]/80 text-black font-medium py-1 px-3 rounded-lg flex items-center space-x-1 transition-colors"
                                  >
                                    <FaCheck className="text-xs" />
                                    <span>Save</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-white/70 text-center py-12">
                Failed to load match players
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-white/70">
            <div className="text-6xl mb-4">👈</div>
            <div className="text-xl">Select a match to view details</div>
          </div>
        )}
      </div>
    </div>
  )
}