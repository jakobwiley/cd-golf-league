import React from 'react'
import type { Team } from '../../types'

interface Props {
  teams: Team[]
  onSubmit: (data: {
    date: string
    weekNumber: number
    startingHole: number
    homeTeamId: string
    awayTeamId: string
    status: string
  }) => void
}

export default function ScheduleForm({ teams, onSubmit }: Props) {
  const [formData, setFormData] = React.useState({
    date: '',
    weekNumber: 1,
    startingHole: 1,
    homeTeamId: '',
    awayTeamId: '',
    status: 'SCHEDULED'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
          Date
        </label>
        <input
          type="datetime-local"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label htmlFor="weekNumber" className="block text-sm font-medium text-gray-700">
          Week Number
        </label>
        <input
          type="number"
          id="weekNumber"
          name="weekNumber"
          value={formData.weekNumber}
          onChange={handleChange}
          min="1"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label htmlFor="startingHole" className="block text-sm font-medium text-gray-700">
          Starting Hole
        </label>
        <input
          type="number"
          id="startingHole"
          name="startingHole"
          value={formData.startingHole}
          onChange={handleChange}
          min="1"
          max="18"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label htmlFor="homeTeamId" className="block text-sm font-medium text-gray-700">
          Home Team
        </label>
        <select
          id="homeTeamId"
          name="homeTeamId"
          value={formData.homeTeamId}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        >
          <option value="">Select a team</option>
          {teams.map(team => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="awayTeamId" className="block text-sm font-medium text-gray-700">
          Away Team
        </label>
        <select
          id="awayTeamId"
          name="awayTeamId"
          value={formData.awayTeamId}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        >
          <option value="">Select a team</option>
          {teams.map(team => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
          Status
        </label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        >
          <option value="SCHEDULED">Scheduled</option>
          <option value="CANCELED">Canceled</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create Match
        </button>
      </div>
    </form>
  )
}