import React from 'react'
import type { Team } from '../types'

interface FormData {
  id?: string;
  date: string;
  weekNumber: number;
  startingHole: number;
  homeTeamId: string;
  awayTeamId: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'FINALIZED' | 'CANCELED';
}

interface Props {
  teams: Team[];
  onSubmit: (data: FormData) => void;
  onCancel?: () => void;
  initialData?: FormData;
}

export default function ScheduleForm({ teams, onSubmit, onCancel, initialData }: Props) {
  const [formData, setFormData] = React.useState<FormData>(initialData || {
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
      [name]: name === 'weekNumber' || name === 'startingHole' ? parseInt(value, 10) : value
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-200">
          Date
        </label>
        <input
          type="datetime-local"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-[#00df82] focus:ring-[#00df82]"
          required
        />
      </div>

      <div>
        <label htmlFor="weekNumber" className="block text-sm font-medium text-gray-200">
          Week Number
        </label>
        <input
          type="number"
          id="weekNumber"
          name="weekNumber"
          value={formData.weekNumber}
          onChange={handleChange}
          min="1"
          className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-[#00df82] focus:ring-[#00df82]"
          required
        />
      </div>

      <div>
        <label htmlFor="startingHole" className="block text-sm font-medium text-gray-200">
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
          className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-[#00df82] focus:ring-[#00df82]"
          required
        />
      </div>

      <div>
        <label htmlFor="homeTeamId" className="block text-sm font-medium text-gray-200">
          Home Team
        </label>
        <select
          id="homeTeamId"
          name="homeTeamId"
          value={formData.homeTeamId}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-[#00df82] focus:ring-[#00df82]"
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
        <label htmlFor="awayTeamId" className="block text-sm font-medium text-gray-200">
          Away Team
        </label>
        <select
          id="awayTeamId"
          name="awayTeamId"
          value={formData.awayTeamId}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-[#00df82] focus:ring-[#00df82]"
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
        <label htmlFor="status" className="block text-sm font-medium text-gray-200">
          Status
        </label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-[#00df82] focus:ring-[#00df82]"
          required
        >
          <option value="SCHEDULED">Scheduled</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
          <option value="FINALIZED">Finalized</option>
          <option value="CANCELED">Canceled</option>
        </select>
      </div>

      <div className="flex justify-end space-x-3 mt-6">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="group relative overflow-hidden px-6 py-3 text-red-400 hover:text-white bg-red-900/20 hover:bg-red-900/40 rounded-lg transition-all duration-300 border border-red-900/30 hover:border-red-500/50 backdrop-blur-sm"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent"></div>
            <div className="absolute -top-10 -right-10 w-20 h-20 bg-red-500/10 rounded-full blur-3xl group-hover:bg-red-500/20 transition-all duration-500"></div>
            <span className="relative font-audiowide">Cancel</span>
          </button>
        )}
        <button
          type="submit"
          className="group relative overflow-hidden px-6 py-3 text-[#00df82] hover:text-white bg-[#00df82]/10 hover:bg-[#00df82]/20 rounded-lg transition-all duration-300 border border-[#00df82]/30 hover:border-[#00df82]/50 backdrop-blur-sm"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#00df82]/5 to-transparent"></div>
          <div className="absolute -top-10 -right-10 w-20 h-20 bg-[#00df82]/10 rounded-full blur-3xl group-hover:bg-[#00df82]/20 transition-all duration-500"></div>
          <span className="relative font-audiowide">{initialData ? 'Update Match' : 'Create Match'}</span>
        </button>
      </div>
    </form>
  )
}