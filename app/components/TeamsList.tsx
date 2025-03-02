'use client'

import { useState, useMemo } from 'react'
import { Team, Player } from '@prisma/client'
import { calculateCourseHandicap } from '../lib/handicap'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'

type TeamsListProps = {
  teams: (Team & {
    players: Player[]
  })[]
}

type PlayerFormData = {
  name: string
  handicapIndex: string
  playerType: 'PRIMARY' | 'SUB'
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
        players: team.players.map(player => 
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
            players: team.players.filter(p => p.id !== playerId)
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
      setTeams([...teams, newTeam])
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
      
      // Update the teams state with the new player
      setTeams(teams.map(team => {
        if (team.id === teamId) {
          return {
            ...team,
            players: [...team.players, newPlayer]
          }
        }
        return team
      }))

      // Reset form
      setPlayerFormData({
        name: '',
        handicapIndex: '',
        playerType: 'PRIMARY'
      })
      setIsAddingPlayer(false)
      setSelectedTeam(null)
      setError('')
    } catch (error) {
      console.error('Error adding player:', error)
      setError('Failed to add player')
    }
  }

  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {teams.map((team) => (
          <div key={team.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">{team.name}</h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedTeam(team)
                      setNewTeamName(team.name)
                      setIsEditingTeam(true)
                    }}
                    className="p-1 text-[#00df82] hover:text-[#00df82]/80 transition-colors"
                    aria-label="Edit team"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteTeam(team.id)}
                    className="p-1 text-red-500 hover:text-red-600 transition-colors"
                    aria-label="Delete team"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-gray-500 mb-2">Primary Players</h3>
                  <ul className="space-y-2">
                    {team.players
                      .filter(player => player.playerType === 'PRIMARY')
                      .map(player => (
                        <li 
                          key={player.id}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                        >
                          <div className="flex-1">
                            <span className="text-gray-900 font-bold">{player.name}</span>
                            {renderPlayerHandicaps(player)}
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <button
                              onClick={() => {
                                setSelectedPlayer(player)
                                setSelectedTeam(team)
                                setPlayerFormData({
                                  name: player.name,
                                  handicapIndex: player.handicapIndex.toString(),
                                  playerType: player.playerType as 'PRIMARY' | 'SUB'
                                })
                                setIsEditingPlayer(true)
                              }}
                              className="p-1 text-[#00df82] hover:text-[#00df82]/80 transition-colors"
                              aria-label="Edit player"
                            >
                              <PencilIcon className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeletePlayer(player.id, team.id)}
                              className="p-1 text-red-500 hover:text-red-600 transition-colors"
                              aria-label="Remove player"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-gray-500 mb-2">Substitute Players</h3>
                  <ul className="space-y-2">
                    {team.players
                      .filter(player => player.playerType === 'SUB')
                      .map(player => (
                        <li 
                          key={player.id}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                        >
                          <div className="flex-1">
                            <span className="text-gray-900 font-bold">{player.name}</span>
                            {renderPlayerHandicaps(player)}
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <button
                              onClick={() => {
                                setSelectedPlayer(player)
                                setSelectedTeam(team)
                                setPlayerFormData({
                                  name: player.name,
                                  handicapIndex: player.handicapIndex.toString(),
                                  playerType: player.playerType as 'PRIMARY' | 'SUB'
                                })
                                setIsEditingPlayer(true)
                              }}
                              className="p-1 text-[#00df82] hover:text-[#00df82]/80 transition-colors"
                              aria-label="Edit player"
                            >
                              <PencilIcon className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeletePlayer(player.id, team.id)}
                              className="p-1 text-red-500 hover:text-red-600 transition-colors"
                              aria-label="Remove player"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => {
                    setSelectedTeam(team)
                    setIsAddingPlayer(true)
                  }}
                  className="w-full px-4 py-2 text-sm font-bold text-[#00df82] bg-white border border-[#00df82] rounded-lg hover:bg-[#00df82] hover:text-white transition-colors duration-200"
                >
                  Add Player
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Add New Team Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Add New Team</h2>
          {isCreating ? (
            <div className="space-y-4">
              <input
                type="text"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                placeholder="Enter team name"
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00df82] focus:border-transparent"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleCreateTeam}
                  className="flex-1 px-4 py-2 text-sm font-bold text-white bg-[#00df82] rounded-lg hover:bg-[#00df82]/80 transition-colors duration-200"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setIsCreating(false)
                    setNewTeamName('')
                    setError('')
                  }}
                  className="flex-1 px-4 py-2 text-sm font-bold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsCreating(true)}
              className="w-full px-4 py-2 text-sm font-bold text-white bg-[#00df82] rounded-lg hover:bg-[#00df82]/80 transition-colors duration-200"
            >
              Create Team
            </button>
          )}
        </div>
      </div>

      {/* Edit Team Modal */}
      {isEditingTeam && selectedTeam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Edit Team</h2>
            
            {error && (
              <div className="mb-4 p-2 bg-red-50 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="teamName" className="block text-sm font-bold text-gray-700 mb-1">
                  Team Name
                </label>
                <input
                  id="teamName"
                  type="text"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00df82] focus:border-transparent"
                  placeholder="Enter team name"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => handleEditTeam(selectedTeam.id, newTeamName)}
                  className="flex-1 px-4 py-2 text-sm font-bold text-white bg-[#00df82] rounded-lg hover:bg-[#00df82]/80 transition-colors duration-200"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setIsEditingTeam(false)
                    setSelectedTeam(null)
                    setNewTeamName('')
                    setError('')
                  }}
                  className="flex-1 px-4 py-2 text-sm font-bold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Player Modal */}
      {isEditingPlayer && selectedPlayer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Edit Player</h2>
            
            {error && (
              <div className="mb-4 p-2 bg-red-50 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="playerName" className="block text-sm font-bold text-gray-700 mb-1">
                  Player Name
                </label>
                <input
                  id="playerName"
                  type="text"
                  value={playerFormData.name}
                  onChange={(e) => setPlayerFormData({ ...playerFormData, name: e.target.value })}
                  className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00df82] focus:border-transparent"
                  placeholder="Enter player name"
                />
              </div>

              <div>
                <label htmlFor="handicapIndex" className="block text-sm font-bold text-gray-700 mb-1">
                  Handicap Index
                </label>
                <input
                  id="handicapIndex"
                  type="number"
                  step="0.1"
                  value={playerFormData.handicapIndex}
                  onChange={(e) => setPlayerFormData({ ...playerFormData, handicapIndex: e.target.value })}
                  className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00df82] focus:border-transparent"
                  placeholder="Enter handicap index"
                />
              </div>

              <div>
                <label htmlFor="playerType" className="block text-sm font-bold text-gray-700 mb-1">
                  Player Type
                </label>
                <select
                  id="playerType"
                  value={playerFormData.playerType}
                  onChange={(e) => setPlayerFormData({ ...playerFormData, playerType: e.target.value as 'PRIMARY' | 'SUB' })}
                  className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00df82] focus:border-transparent"
                >
                  <option value="PRIMARY">Primary</option>
                  <option value="SUB">Substitute</option>
                </select>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => handleEditPlayer(selectedPlayer.id)}
                  className="flex-1 px-4 py-2 text-sm font-bold text-white bg-[#00df82] rounded-lg hover:bg-[#00df82]/80 transition-colors duration-200"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setIsEditingPlayer(false)
                    setSelectedPlayer(null)
                    setPlayerFormData({
                      name: '',
                      handicapIndex: '',
                      playerType: 'PRIMARY'
                    })
                    setError('')
                  }}
                  className="flex-1 px-4 py-2 text-sm font-bold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Player Modal */}
      {isAddingPlayer && selectedTeam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Add Player to {selectedTeam.name}</h2>
            
            {error && (
              <div className="mb-4 p-2 bg-red-50 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="playerName" className="block text-sm font-bold text-gray-700 mb-1">
                  Player Name
                </label>
                <input
                  id="playerName"
                  type="text"
                  value={playerFormData.name}
                  onChange={(e) => setPlayerFormData({ ...playerFormData, name: e.target.value })}
                  className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00df82] focus:border-transparent"
                  placeholder="Enter player name"
                />
              </div>

              <div>
                <label htmlFor="handicapIndex" className="block text-sm font-bold text-gray-700 mb-1">
                  Handicap Index
                </label>
                <input
                  id="handicapIndex"
                  type="number"
                  step="0.1"
                  value={playerFormData.handicapIndex}
                  onChange={(e) => setPlayerFormData({ ...playerFormData, handicapIndex: e.target.value })}
                  className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00df82] focus:border-transparent"
                  placeholder="Enter handicap index"
                />
              </div>

              <div>
                <label htmlFor="playerType" className="block text-sm font-bold text-gray-700 mb-1">
                  Player Type
                </label>
                <select
                  id="playerType"
                  value={playerFormData.playerType}
                  onChange={(e) => setPlayerFormData({ ...playerFormData, playerType: e.target.value as 'PRIMARY' | 'SUB' })}
                  className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00df82] focus:border-transparent"
                >
                  <option value="PRIMARY">Primary</option>
                  <option value="SUB">Substitute</option>
                </select>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => handleAddPlayer(selectedTeam.id)}
                  className="flex-1 px-4 py-2 text-sm font-bold text-white bg-[#00df82] rounded-lg hover:bg-[#00df82]/80 transition-colors duration-200"
                >
                  Add Player
                </button>
                <button
                  onClick={() => {
                    setIsAddingPlayer(false)
                    setSelectedTeam(null)
                    setPlayerFormData({
                      name: '',
                      handicapIndex: '',
                      playerType: 'PRIMARY'
                    })
                    setError('')
                  }}
                  className="flex-1 px-4 py-2 text-sm font-bold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
} 