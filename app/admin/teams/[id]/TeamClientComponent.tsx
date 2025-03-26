'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { apiConfig } from '../../../../lib/apiConfig'

interface Player {
  id: string
  name: string
  handicapIndex: number
  playerType: string
}

interface Team {
  id: string
  name: string
  createdAt: string
}

interface TeamClientComponentProps {
  team: Team
  players: Player[]
}

export default function TeamClientComponent({ team, players }: TeamClientComponentProps) {
  const router = useRouter()
  const [deletingPlayerId, setDeletingPlayerId] = useState<string | null>(null)
  
  const handleDeletePlayer = async (playerId: string) => {
    if (!confirm('Are you sure you want to delete this player?')) {
      return
    }
    
    setDeletingPlayerId(playerId)
    
    try {
      const response = await fetch(apiConfig.getUrl(`/api/players?id=${playerId}`), {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete player')
      }
      
      toast.success('Player deleted successfully')
      router.refresh() // Refresh the page to update the player list
    } catch (error) {
      console.error('Error deleting player:', error)
      toast.error('Failed to delete player')
    } finally {
      setDeletingPlayerId(null)
    }
  }
  
  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{team.name}</h1>
        <div className="flex gap-2">
          <Link href="/admin/teams" className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
            Back to Teams
          </Link>
          <Link
            href={`/admin/teams/${team.id}/edit`}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Edit Team
          </Link>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Team Details</h2>
        <div className="bg-white border rounded p-4">
          <p>
            <strong>Team ID:</strong> {team.id}
          </p>
          <p>
            <strong>Name:</strong> {team.name}
          </p>
          <p>
            <strong>Players:</strong> {players.length}
          </p>
          <p>
            <strong>Created:</strong> {new Date(team.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Players</h2>
        <Link
          href={`/admin/players/add?teamId=${team.id}`}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Add Player
        </Link>
      </div>

      {players.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border text-left">Name</th>
                <th className="py-2 px-4 border text-left">Handicap</th>
                <th className="py-2 px-4 border text-left">Type</th>
                <th className="py-2 px-4 border text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player) => (
                <tr key={player.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border">{player.name}</td>
                  <td className="py-2 px-4 border">{player.handicapIndex ?? 'N/A'}</td>
                  <td className="py-2 px-4 border">{player.playerType || 'PRIMARY'}</td>
                  <td className="py-2 px-4 border">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/players/${player.id}/edit`}
                        className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeletePlayer(player.id)}
                        disabled={deletingPlayerId === player.id}
                        className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 disabled:bg-red-300"
                      >
                        {deletingPlayerId === player.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 border rounded bg-gray-50">
          <p className="text-gray-500 mb-4">No players added to this team yet</p>
          <Link
            href={`/admin/players/add?teamId=${team.id}`}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add First Player
          </Link>
        </div>
      )}
    </div>
  )
}
