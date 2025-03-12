'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Player {
  id: string
  name: string
  handicapIndex: number
  teamId: string
}

interface Team {
  id: string
  name: string
}

export default function EditPlayerPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [player, setPlayer] = useState<Player | null>(null)
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    handicap: 0,
    teamId: ''
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch player data
        const playerRes = await fetch(`/api/players/${params.id}`)
        if (!playerRes.ok) {
          throw new Error(`Failed to fetch player: ${playerRes.statusText}`)
        }
        const playerData = await playerRes.json()
        
        // Fetch teams for dropdown
        const teamsRes = await fetch('/api/teams')
        if (!teamsRes.ok) {
          throw new Error(`Failed to fetch teams: ${teamsRes.statusText}`)
        }
        const teamsData = await teamsRes.json()
        
        setPlayer(playerData)
        setTeams(teamsData)
        setFormData({
          name: playerData.name,
          handicap: playerData.handicapIndex || 0,
          teamId: playerData.teamId
        })
      } catch (err) {
        console.error('Error fetching data:', err)
        setError('Failed to load player data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'handicap' ? parseFloat(value) : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      const res = await fetch('/api/players', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: params.id,
          name: formData.name,
          handicap: formData.handicap,
          teamId: formData.teamId
        })
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to update player')
      }

      router.push('/admin/players')
    } catch (err) {
      console.error('Error updating player:', err)
      setError('Failed to update player')
    } finally {
      setLoading(false)
    }
  }

  if (loading && !player) {
    return <div className="p-4">Loading...</div>
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>
  }

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Edit Player</h1>
        <Link href="/admin/players" className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
          Back to Players
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="max-w-md">
        <div className="mb-4">
          <label htmlFor="name" className="block mb-1 font-medium">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="handicap" className="block mb-1 font-medium">
            Handicap
          </label>
          <input
            type="number"
            id="handicap"
            name="handicap"
            value={formData.handicap}
            onChange={handleChange}
            min="0"
            max="54"
            step="0.1"
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="teamId" className="block mb-1 font-medium">
            Team
          </label>
          <select
            id="teamId"
            name="teamId"
            value={formData.teamId}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select a team</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          <Link
            href="/admin/players"
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
} 