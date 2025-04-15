'use client'

import { useState, useMemo } from 'react'
import { Team, Player } from '../types'
import { calculateCourseHandicap } from '../lib/handicap'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

type TeamsListProps = {
  teams: Team[]
}

type PlayerFormData = {
  name: string
  handicapIndex: string
  playerType: 'PRIMARY' | 'SUBSTITUTE'
}

export default function TeamsList({ teams: initialTeams }: TeamsListProps) {
  const [teams, setTeams] = useState(initialTeams)
  const [isCreating, setIsCreating] = useState(false)
  const [newTeamName, setNewTeamName] = useState('')
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
  const [isAddingPlayer, setIsAddingPlayer] = useState(false)
  const [isEditingTeam, setIsEditingTeam] = useState(false)
  const [isEditingPlayer, setIsEditingPlayer] = useState(false)
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)
  const [playerFormData, setPlayerFormData] = useState<PlayerFormData>({
    name: '',
    handicapIndex: '',
    playerType: 'PRIMARY'
  })
  const [error, setError] = useState('')
  const [expandedSubstitutes, setExpandedSubstitutes] = useState<Set<string>>(new Set())
  const [expandedTeam, setExpandedTeam] = useState<string | null>(null)

  const handleEditTeam = async (teamId: string, newName: string) => {
    try {
      const response = await fetch(`/api/teams/${teamId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newName }),
      })

      if (!response.ok) {
        throw new Error('Failed to update team')
      }

      const updatedTeam = await response.json()
      setTeams(teams.map(team => team.id === teamId ? { ...team, name: newName } : team))
      setIsEditingTeam(false)
      setSelectedTeam(null)
      setNewTeamName('')
    } catch (error) {
      console.error('Error updating team:', error)
      setError('Failed to update team')
    }
  }

  const handleEditPlayer = async (playerId: string) => {
    if (!playerFormData.name.trim() || !playerFormData.handicapIndex.trim()) {
      setError('Name and handicap index are required')
      return
    }

    try {
      const response = await fetch(`/api/players/${playerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...playerFormData,
          handicapIndex: parseFloat(playerFormData.handicapIndex)
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update player')
      }

      const updatedPlayer = await response.json()
      
      setTeams(teams.map(team => ({
        ...team,
        players: (team.players || []).map(player => 
          player.id === playerId ? updatedPlayer : player
        )
      })))

      setIsEditingPlayer(false)
      setSelectedPlayer(null)
      setPlayerFormData({
        name: '',
        handicapIndex: '',
        playerType: 'PRIMARY'
      })
      setError('')
    } catch (error) {
      console.error('Error updating player:', error)
      setError('Failed to update player')
    }
  }

  const handleDeletePlayer = async (playerId: string, teamId: string) => {
    if (!confirm('Are you sure you want to remove this player?')) return

    try {
      const response = await fetch(`/api/players/${playerId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete player')
      }

      setTeams(teams.map(team => {
        if (team.id === teamId) {
          return {
            ...team,
            players: (team.players || []).filter(p => p.id !== playerId)
          }
        }
        return team
      }))
    } catch (error) {
      console.error('Error deleting player:', error)
      setError('Failed to delete player')
    }
  }

  const renderPlayerHandicaps = (player: Player) => {
    const courseHandicap = calculateCourseHandicap(player.handicapIndex)
    return (
      <div className="text-sm text-gray-500 font-bold space-x-2">
        <span>HCP: {player.handicapIndex}</span>
        <span>•</span>
        <span>CHP: {courseHandicap}</span>
      </div>
    )
  }

  const handleCreateTeam = async () => {
    if (!newTeamName.trim()) return

    try {
      const response = await fetch('/api/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newTeamName }),
      })

      if (!response.ok) {
        throw new Error('Failed to create team')
      }

      const newTeam = await response.json()
      setTeams([...teams, { ...newTeam, players: [] }])
      setNewTeamName('')
      setIsCreating(false)
    } catch (error) {
      console.error('Error creating team:', error)
      setError('Failed to create team')
    }
  }

  const handleDeleteTeam = async (teamId: string) => {
    if (!confirm('Are you sure you want to delete this team? This will also delete all players in the team.')) {
      return
    }

    try {
      const response = await fetch(`/api/teams/${teamId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete team')
      }

      setTeams(teams.filter(team => team.id !== teamId))
      setError('')
    } catch (error) {
      console.error('Error deleting team:', error)
      setError(error instanceof Error ? error.message : 'Failed to delete team')
    }
  }

  const handleAddPlayer = async (teamId: string) => {
    if (!playerFormData.name.trim() || !playerFormData.handicapIndex.trim()) {
      setError('Name and handicap index are required')
      return
    }

    try {
      const response = await fetch('/api/players', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...playerFormData,
          teamId,
          handicapIndex: parseFloat(playerFormData.handicapIndex)
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to add player')
      }

      const newPlayer = await response.json()
      setTeams(teams.map(team => {
        if (team.id === teamId) {
          return {
            ...team,
            players: [...(team.players || []), newPlayer]
          }
        }
        return team
      }))

      setIsAddingPlayer(false)
      setPlayerFormData({
        name: '',
        handicapIndex: '',
        playerType: 'PRIMARY'
      })
      setError('')
    } catch (error) {
      console.error('Error adding player:', error)
      setError('Failed to add player')
    }
  }

  const toggleSubstitutes = (teamId: string) => {
    const newExpandedSubstitutes = new Set(expandedSubstitutes)
    if (expandedSubstitutes.has(teamId)) {
      newExpandedSubstitutes.delete(teamId)
    } else {
      newExpandedSubstitutes.add(teamId)
    }
    setExpandedSubstitutes(newExpandedSubstitutes)
  }

  const getPrimaryPlayers = (players: Player[]) => {
    return players.filter(p => p.playerType === 'PRIMARY')
  }

  const getSubstitutePlayers = (players: Player[]) => {
    return players.filter(p => p.playerType === 'SUBSTITUTE')
  }

  const toggleTeam = (teamId: string) => {
    setExpandedTeam(expandedTeam === teamId ? null : teamId)
  }

  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {teams.map((team) => {
          const primaryPlayers = getPrimaryPlayers(team.players || [])
          const substitutePlayers = getSubstitutePlayers(team.players || [])
          
          return (
            <div key={team.id} className="relative overflow-hidden rounded-2xl border border-[#00df82]/30 backdrop-blur-sm bg-[#030f0f]/50">
              <div className="absolute inset-0 bg-gradient-to-br from-[#00df82]/5 to-transparent"></div>
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#00df82]/10 rounded-full blur-3xl"></div>
              
              <div className="relative p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-audiowide text-white mb-1">{team.name}</h3>
                    <p className="text-sm text-gray-400 font-orbitron">Primary Players</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setSelectedTeam(team)
                        setIsEditingTeam(true)
                        setNewTeamName(team.name)
                      }}
                      className="p-2 text-[#00df82] hover:text-[#00df82]/80 transition-colors"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteTeam(team.id)}
                      className="p-2 text-red-500 hover:text-red-400 transition-colors"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                {/* Primary Players */}
                <div className="space-y-4 mb-4">
                  {primaryPlayers.map((player) => (
                    <div key={player.id} className="flex items-center justify-between p-3 rounded-lg bg-[#030f0f]/30 border border-[#00df82]/10">
                      <div>
                        <div className="text-white font-medium">{player.name}</div>
                        {renderPlayerHandicaps(player)}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedPlayer(player)
                            setPlayerFormData({
                              name: player.name,
                              handicapIndex: player.handicapIndex.toString(),
                              playerType: player.playerType
                            })
                            setIsEditingPlayer(true)
                          }}
                          className="p-1 text-[#00df82] hover:text-[#00df82]/80 transition-colors"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePlayer(player.id, team.id)}
                          className="p-1 text-red-500 hover:text-red-400 transition-colors"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Substitute Players Section */}
                {substitutePlayers.length > 0 && (
                  <div className="mt-4">
                    <button
                      onClick={() => toggleSubstitutes(team.id)}
                      className="w-full flex items-center justify-between p-3 rounded-lg bg-[#030f0f]/30 border border-[#00df82]/10 hover:bg-[#030f0f]/40 transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-white font-medium">Substitutes</span>
                        <span className="text-sm text-gray-400">({substitutePlayers.length})</span>
                      </div>
                      <svg
                        className={`w-5 h-5 text-[#00df82] transform transition-transform ${
                          expandedSubstitutes.has(team.id) ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {expandedSubstitutes.has(team.id) && (
                      <div className="mt-2 space-y-2">
                        {substitutePlayers.map((player) => (
                          <div key={player.id} className="flex items-center justify-between p-3 rounded-lg bg-[#030f0f]/30 border border-[#00df82]/10">
                            <div>
                              <div className="text-white font-medium">{player.name}</div>
                              {renderPlayerHandicaps(player)}
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => {
                                  setSelectedPlayer(player)
                                  setPlayerFormData({
                                    name: player.name,
                                    handicapIndex: player.handicapIndex.toString(),
                                    playerType: player.playerType
                                  })
                                  setIsEditingPlayer(true)
                                }}
                                className="p-1 text-[#00df82] hover:text-[#00df82]/80 transition-colors"
                              >
                                <PencilIcon className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeletePlayer(player.id, team.id)}
                                className="p-1 text-red-500 hover:text-red-400 transition-colors"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                
                {/* Add Player Button */}
                <button
                  onClick={() => {
                    setSelectedTeam(team)
                    setPlayerFormData({
                      name: '',
                      handicapIndex: '',
                      playerType: 'PRIMARY'
                    })
                    setIsAddingPlayer(true)
                  }}
                  className="mt-4 w-full py-2 px-4 bg-[#00df82]/10 text-[#00df82] rounded-lg border border-[#00df82]/20 hover:bg-[#00df82]/20 transition-colors font-orbitron"
                >
                  Add Player
                </button>
              </div>
            </div>
          )
        })}
        
        {/* Create Team Button */}
        <div 
          onClick={() => {
            setIsCreating(true)
            setNewTeamName('')
          }}
          className="group relative overflow-hidden rounded-2xl border border-[#00df82]/30 backdrop-blur-sm bg-[#030f0f]/50 p-6 flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#00df82]/5 to-transparent"></div>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#00df82]/10 rounded-full blur-3xl group-hover:bg-[#00df82]/20 transition-all duration-500"></div>
          <div className="text-center relative">
            <div className="w-12 h-12 bg-[#00df82]/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#00df82]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-xl font-audiowide text-white mb-1">Create Team</h3>
            <p className="text-white/60 text-sm font-orbitron">Add a new team to the league</p>
          </div>
        </div>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="relative overflow-hidden rounded-2xl border border-red-500/30 backdrop-blur-sm bg-[#030f0f]/50 p-6 mt-6">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent"></div>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-500/10 rounded-full blur-3xl"></div>
          <p className="text-red-500 relative font-orbitron">{error}</p>
        </div>
      )}
      
      {/* Create Team Modal */}
      {isCreating && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative overflow-hidden bg-[#030f0f] p-6 rounded-xl shadow-xl w-full max-w-md mx-auto border border-[#00df82]/30">
            <div className="absolute inset-0 bg-gradient-to-br from-[#00df82]/5 to-transparent"></div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#00df82]/10 rounded-full blur-3xl"></div>
            <div className="relative">
              <h2 className="text-2xl font-audiowide text-white mb-6">Create New Team</h2>
              
              <div className="mb-6">
                <label htmlFor="teamName" className="block text-white/70 mb-2 font-orbitron">Team Name</label>
                <input
                  type="text"
                  id="teamName"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  className="w-full px-4 py-2 bg-[#030f0f]/70 text-white border border-[#00df82]/30 rounded-lg focus:outline-none focus:border-[#00df82]/60 backdrop-blur-sm"
                  placeholder="Enter team name"
                />
              </div>
              
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 text-white/70 hover:text-white transition-colors font-orbitron"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateTeam}
                  disabled={!newTeamName.trim()}
                  className="group relative overflow-hidden px-4 py-2 bg-[#030f0f]/70 text-[#00df82] rounded-lg border border-[#00df82]/30 hover:border-[#00df82]/50 backdrop-blur-sm transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#00df82]/5 to-transparent"></div>
                  <div className="absolute -top-10 -right-10 w-20 h-20 bg-[#00df82]/10 rounded-full blur-3xl group-hover:bg-[#00df82]/20 transition-all duration-500"></div>
                  <span className="relative font-audiowide">Create Team</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Edit Team Modal */}
      {isEditingTeam && selectedTeam && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative overflow-hidden bg-[#030f0f] p-6 rounded-xl shadow-xl w-full max-w-md mx-auto border border-[#00df82]/30">
            <div className="absolute inset-0 bg-gradient-to-br from-[#00df82]/5 to-transparent"></div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#00df82]/10 rounded-full blur-3xl"></div>
            <div className="relative">
              <h2 className="text-2xl font-audiowide text-white mb-6">Edit Team</h2>
              
              <div className="mb-6">
                <label htmlFor="editTeamName" className="block text-white/70 mb-2 font-orbitron">Team Name</label>
                <input
                  type="text"
                  id="editTeamName"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  className="w-full px-4 py-2 bg-[#030f0f]/70 text-white border border-[#00df82]/30 rounded-lg focus:outline-none focus:border-[#00df82]/60 backdrop-blur-sm"
                />
              </div>
              
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => {
                    setIsEditingTeam(false)
                    setSelectedTeam(null)
                  }}
                  className="px-4 py-2 text-white/70 hover:text-white transition-colors font-orbitron"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleEditTeam(selectedTeam.id, newTeamName)}
                  disabled={!newTeamName.trim()}
                  className="group relative overflow-hidden px-4 py-2 bg-[#030f0f]/70 text-[#00df82] rounded-lg border border-[#00df82]/30 hover:border-[#00df82]/50 backdrop-blur-sm transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#00df82]/5 to-transparent"></div>
                  <div className="absolute -top-10 -right-10 w-20 h-20 bg-[#00df82]/10 rounded-full blur-3xl group-hover:bg-[#00df82]/20 transition-all duration-500"></div>
                  <span className="relative font-audiowide">Save Changes</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Add/Edit Player Modal */}
      {(isAddingPlayer || isEditingPlayer) && selectedTeam && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative overflow-hidden bg-[#030f0f] p-6 rounded-xl shadow-xl w-full max-w-md mx-auto border border-[#00df82]/30">
            <div className="absolute inset-0 bg-gradient-to-br from-[#00df82]/5 to-transparent"></div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#00df82]/10 rounded-full blur-3xl"></div>
            <div className="relative">
              <h2 className="text-2xl font-audiowide text-white mb-6">
                {isAddingPlayer ? `Add Player to ${selectedTeam.name}` : 'Edit Player'}
              </h2>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label htmlFor="playerName" className="block text-white/70 mb-2 font-orbitron">Player Name</label>
                  <input
                    type="text"
                    id="playerName"
                    value={playerFormData.name}
                    onChange={(e) => setPlayerFormData({...playerFormData, name: e.target.value})}
                    className="w-full px-4 py-2 bg-[#030f0f]/70 text-white border border-[#00df82]/30 rounded-lg focus:outline-none focus:border-[#00df82]/60 backdrop-blur-sm"
                    placeholder="Enter player name"
                  />
                </div>
                
                <div>
                  <label htmlFor="handicapIndex" className="block text-white/70 mb-2 font-orbitron">Handicap Index</label>
                  <input
                    type="number"
                    id="handicapIndex"
                    value={playerFormData.handicapIndex}
                    onChange={(e) => setPlayerFormData({...playerFormData, handicapIndex: e.target.value})}
                    className="w-full px-4 py-2 bg-[#030f0f]/70 text-white border border-[#00df82]/30 rounded-lg focus:outline-none focus:border-[#00df82]/60 backdrop-blur-sm"
                    placeholder="Enter handicap index"
                    min="0"
                    max="54"
                    step="0.1"
                  />
                </div>
                
                <div>
                  <label htmlFor="playerType" className="block text-white/70 mb-2 font-orbitron">Player Type</label>
                  <select
                    id="playerType"
                    value={playerFormData.playerType}
                    onChange={(e) => setPlayerFormData({...playerFormData, playerType: e.target.value as 'PRIMARY' | 'SUBSTITUTE'})}
                    className="w-full px-4 py-2 bg-[#030f0f]/70 text-white border border-[#00df82]/30 rounded-lg focus:outline-none focus:border-[#00df82]/60 backdrop-blur-sm"
                  >
                    <option value="PRIMARY">Primary Player</option>
                    <option value="SUBSTITUTE">Substitute Player</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => {
                    setIsAddingPlayer(false)
                    setIsEditingPlayer(false)
                    setSelectedPlayer(null)
                    setPlayerFormData({
                      name: '',
                      handicapIndex: '',
                      playerType: 'PRIMARY'
                    })
                  }}
                  className="px-4 py-2 text-white/70 hover:text-white transition-colors font-orbitron"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (isEditingPlayer && selectedPlayer) {
                      handleEditPlayer(selectedPlayer.id)
                    } else if (isAddingPlayer && selectedTeam) {
                      handleAddPlayer(selectedTeam.id)
                    }
                  }}
                  disabled={!playerFormData.name.trim() || !playerFormData.handicapIndex.trim()}
                  className="group relative overflow-hidden px-4 py-2 bg-[#030f0f]/70 text-[#00df82] rounded-lg border border-[#00df82]/30 hover:border-[#00df82]/50 backdrop-blur-sm transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#00df82]/5 to-transparent"></div>
                  <div className="absolute -top-10 -right-10 w-20 h-20 bg-[#00df82]/10 rounded-full blur-3xl group-hover:bg-[#00df82]/20 transition-all duration-500"></div>
                  <span className="relative font-audiowide">
                    {isEditingPlayer ? 'Save Changes' : 'Add Player'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
} 