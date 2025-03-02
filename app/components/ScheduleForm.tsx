'use client'

import { useState } from 'react'
import { format } from 'date-fns'

interface Team {
  id: string
  name: string
}

interface ScheduleFormProps {
  teams?: Team[]
  onSubmit: () => void
  initialData?: {
    id?: string
    date: Date
    weekNumber: number
    homeTeamId: string
    awayTeamId: string
    startingHole: number
    status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED'
  }
}

export default function ScheduleForm({ teams = [], onSubmit, initialData }: ScheduleFormProps) {
  const [formData, setFormData] = useState({
    id: initialData?.id || undefined,
    date: initialData?.date ? format(new Date(initialData.date), 'yyyy-MM-dd') : '',
    weekNumber: initialData?.weekNumber || 1,
    homeTeamId: initialData?.homeTeamId || '',
    awayTeamId: initialData?.awayTeamId || '',
    startingHole: initialData?.startingHole || 1,
    status: initialData?.status || 'SCHEDULED'
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'weekNumber' || name === 'startingHole' ? parseInt(value) : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create schedule')
      }

      onSubmit()
    } catch (err) {
      console.error('Error saving schedule:', err)
      setError(err instanceof Error ? err.message : 'Failed to save schedule')
    } finally {
      setLoading(false)
    }
  }

  if (teams.length === 0) {
    return (
      <div className="text-center p-8 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl shadow-xl">
        <p className="text-white text-lg font-medium">No teams available. Create your squad first! 🏌️‍♂️</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      )}
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="date" className="block text-lg font-semibold text-gray-800">
            Match Date 📅
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200 text-gray-800 bg-gray-50 hover:bg-gray-100"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="weekNumber" className="block text-lg font-semibold text-gray-800">
            Week # 🎯
          </label>
          <input
            type="number"
            id="weekNumber"
            name="weekNumber"
            min="1"
            value={formData.weekNumber}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200 text-gray-800 bg-gray-50 hover:bg-gray-100"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <div className="space-y-2">
          <label htmlFor="homeTeamId" className="block text-lg font-semibold text-gray-800">
            Home Squad 🏠
          </label>
          <select
            id="homeTeamId"
            name="homeTeamId"
            value={formData.homeTeamId}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200 text-gray-800 bg-gray-50 hover:bg-gray-100"
          >
            <option value="">Pick Home Team</option>
            {teams.map(team => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="awayTeamId" className="block text-lg font-semibold text-gray-800">
            Away Squad 🛫
          </label>
          <select
            id="awayTeamId"
            name="awayTeamId"
            value={formData.awayTeamId}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200 text-gray-800 bg-gray-50 hover:bg-gray-100"
          >
            <option value="">Pick Away Team</option>
            {teams.map(team => (
              <option 
                key={team.id} 
                value={team.id}
                disabled={team.id === formData.homeTeamId}
              >
                {team.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6">
        <label htmlFor="startingHole" className="block text-lg font-semibold text-gray-800">
          Starting Hole ⛳
        </label>
        <input
          type="number"
          id="startingHole"
          name="startingHole"
          min="1"
          max="9"
          value={formData.startingHole}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200 text-gray-800 bg-gray-50 hover:bg-gray-100"
        />
      </div>

      <div className="mt-8">
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-emerald-500 to-emerald-700 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-emerald-600 hover:to-emerald-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          {loading ? '⏳ Setting Up Match...' : '🏌️‍♂️ Schedule Match'}
        </button>
      </div>
    </form>
  )
} 