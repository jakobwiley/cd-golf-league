'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Player {
  id: string
  name: string
  ghinNumber?: string | null
}

interface PlayerListProps {
  players: Player[]
  teamId: string
}

export function PlayerList({ players, teamId }: PlayerListProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [playerToDelete, setPlayerToDelete] = useState<Player | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!playerToDelete) return

    try {
      setIsDeleting(true)
      
      console.log(`Deleting player: ${playerToDelete.id} (${playerToDelete.name})`);
      
      const response = await fetch(`/api/players/${playerToDelete.id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete player')
      }
      
      alert('Player deleted successfully')
      setShowDeleteDialog(false)
      router.refresh()
    } catch (error) {
      console.error('Error deleting player:', error)
      alert(`Error deleting player: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsDeleting(false)
      setPlayerToDelete(null)
    }
  }

  if (players.length === 0) {
    return <p className="text-gray-500">No players added yet.</p>
  }

  return (
    <>
      <div className="space-y-2">
        {players.map((player) => (
          <div
            key={player.id}
            className="flex items-center justify-between p-3 border rounded-md"
          >
            <div>
              <p className="font-medium">{player.name}</p>
              {player.ghinNumber && (
                <p className="text-sm text-gray-500">
                  GHIN: {player.ghinNumber}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"
                onClick={() => {
                  // Edit functionality would go here
                  alert('Edit functionality coming soon')
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                  <path d="m15 5 4 4"/>
                </svg>
              </button>
              <button
                className="p-2 text-gray-500 hover:text-red-500 hover:bg-gray-100 rounded-md"
                onClick={() => {
                  setPlayerToDelete(player)
                  setShowDeleteDialog(true)
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <path d="M3 6h18"/>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                  <line x1="10" x2="10" y1="11" y2="17"/>
                  <line x1="14" x2="14" y1="11" y2="17"/>
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {showDeleteDialog && playerToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-medium">Delete Player</h3>
            <p className="mt-2 text-gray-500">
              Are you sure you want to delete {playerToDelete.name}? This action
              cannot be undone.
            </p>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
} 