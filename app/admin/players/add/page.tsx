'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { apiConfig } from '../../../../lib/apiConfig'

interface Team {
  id: string
  name: string
}

export default function AddPlayerPage() {
  const router = useRouter()
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    handicap: 0,
    teamId: '',
    playerType: 'PRIMARY'
  })

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await fetch(apiConfig.getUrl('/api/teams'))
        if (!res.ok) {
          throw new Error(`Failed to fetch teams: ${res.statusText}`)
        }
        const data = await res.json()
        setTeams(data)
      } catch (err) {
        console.error('Error fetching teams:', err)
        setError('Failed to load teams')
      } finally {
        setLoading(false)
      }
    }

    fetchTeams()
  }, [])

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
      setSubmitting(true)
      setError('')
      
      // Prepare the data to send to the API
      const playerData = {
        name: formData.name,
        handicapIndex: formData.handicap,
        teamId: formData.teamId,
        playerType: formData.playerType
      }
      
      console.log('Submitting player data:', playerData)
      
      const res = await fetch(apiConfig.getUrl('/api/players'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(playerData)
      })

      if (!res.ok) {
        const errorData = await res.json()
        console.error('Error adding player:', errorData)
        throw new Error(errorData.error || errorData.details || 'Failed to create player')
      }

      router.push('/admin/players')
    } catch (err: any) {
      console.error('Error adding player:', err)
      setError(err.message || 'Failed to create player')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="p-4">Loading teams...</div>
  }

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Add New Player</h1>
        <Link href="/admin/players" className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
          Back to Players
        </Link>
      </div>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

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

        <div className="mb-4">
          <label htmlFor="playerType" className="block mb-1 font-medium">
            Player Type
          </label>
          <select
            id="playerType"
            name="playerType"
            value={formData.playerType}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="PRIMARY">Primary</option>
            <option value="SUBSTITUTE">Substitute</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {submitting ? 'Adding...' : 'Add Player'}
        </button>
      </form>
    </div>
  )
}