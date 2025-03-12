'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Player {
  id: string
  name: string
  handicapIndex: number
  team: {
    id: string
    name: string
  } | null
}

export default function DeletePlayerPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [player, setPlayer] = useState<Player | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        const res = await fetch(`/api/players/${params.id}`)
        if (!res.ok) {
          throw new Error(`Failed to fetch player: ${res.statusText}`)
        }
        const data = await res.json()
        setPlayer(data)
      } catch (err) {
        console.error('Error fetching player:', err)
        setError('Failed to load player data')
      } finally {
        setLoading(false)
      }
    }

    fetchPlayer()
  }, [params.id])

  const handleDelete = async () => {
    try {
      setDeleting(true)
      const res = await fetch(`/api/players/${params.id}`, {
        method: 'DELETE'
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to delete player')
      }

      router.push('/admin/players')
    } catch (err) {
      console.error('Error deleting player:', err)
      setError('Failed to delete player')
      setDeleting(false)
    }
  }

  if (loading) {
    return <div className="p-4">Loading...</div>
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>
  }

  if (!player) {
    return <div className="p-4">Player not found</div>
  }

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Delete Player</h1>
        <Link href="/admin/players" className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
          Back to Players
        </Link>
      </div>

      <div className="bg-red-50 border border-red-200 rounded p-6 max-w-md">
        <h2 className="text-xl font-semibold mb-4">Are you sure?</h2>
        <p className="mb-6">
          You are about to delete the player <strong>{player.name}</strong>
          {player.team && ` from team ${player.team.name}`}.
          This action cannot be undone.
        </p>

        <div className="flex gap-3">
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-red-300"
          >
            {deleting ? 'Deleting...' : 'Yes, Delete Player'}
          </button>
          <Link
            href="/admin/players"
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </Link>
        </div>
      </div>
    </div>
  )
} 