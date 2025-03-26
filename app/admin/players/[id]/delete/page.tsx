'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { apiConfig } from '../../../../../lib/apiConfig'

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
        const res = await fetch(apiConfig.getUrl(`/api/players/${params.id}`))
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
      const res = await fetch(apiConfig.getUrl(`/api/players?id=${params.id}`), {
        method: 'DELETE'
      })

      if (!res.ok) {
        throw new Error('Failed to delete player')
      }

      router.push('/admin/players')
    } catch (err) {
      console.error('Error deleting player:', err)
      setError('Failed to delete player')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return <div className="p-4">Loading player data...</div>
  }

  if (error && !player) {
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

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold text-yellow-800 mb-2">Warning</h2>
        <p className="text-yellow-700">
          Are you sure you want to delete {player.name}? This action cannot be undone.
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-red-300"
        >
          {deleting ? 'Deleting...' : 'Delete Player'}
        </button>
        <Link
          href="/admin/players"
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Cancel
        </Link>
      </div>
    </div>
  )
}