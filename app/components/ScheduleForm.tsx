'use client'

import { useState, useEffect } from 'react'

interface Team {
  id: string
  name: string
}

interface Match {
  homeTeamId: string
  awayTeamId: string
  startTime: string
}

interface ScheduleFormProps {
  onSubmit: (data: { date: string; matches: Match[] }) => void
  onCancel: () => void
  weekNumber: number
  initialData?: {
    date: string
    matches: Match[]
  }
}

interface ValidationError {
  field: string
  message: string
}

export default function ScheduleForm({
  onSubmit,
  onCancel,
  weekNumber,
  initialData,
}: ScheduleFormProps) {
  const [formData, setFormData] = useState({
    date: initialData?.date || '',
    matches: initialData?.matches || [
      { homeTeamId: '', awayTeamId: '', startTime: '17:30' },
      { homeTeamId: '', awayTeamId: '', startTime: '17:40' },
      { homeTeamId: '', awayTeamId: '', startTime: '17:50' },
      { homeTeamId: '', awayTeamId: '', startTime: '18:00' },
      { homeTeamId: '', awayTeamId: '', startTime: '18:10' },
    ],
  })
  const [teams, setTeams] = useState<Team[]>([])
  const [errors, setErrors] = useState<ValidationError[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchTeams()
  }, [])

  const fetchTeams = async () => {
    try {
      const response = await fetch('/api/teams')
      if (!response.ok) throw new Error('Failed to fetch teams')
      const data = await response.json()
      setTeams(data)
    } catch (error) {
      console.error('Error fetching teams:', error)
      // Fallback to mock data if API fails
      setTeams([
        { id: '1', name: 'Team Eagles' },
        { id: '2', name: 'Team Birdies' },
        { id: '3', name: 'Team Pars' },
        { id: '4', name: 'Team Bogeys' },
        { id: '5', name: 'Team Albatross' },
      ])
    }
  }

  const validateForm = (): boolean => {
    const newErrors: ValidationError[] = []

    // Check date
    if (!formData.date) {
      newErrors.push({ field: 'date', message: 'Date is required' })
    }

    // Check matches
    const usedTeams = new Set<string>()
    const usedTimes = new Set<string>()

    formData.matches.forEach((match, index) => {
      // Check if teams are selected
      if (!match.homeTeamId) {
        newErrors.push({ field: `match-${index}-home`, message: 'Home team is required' })
      }
      if (!match.awayTeamId) {
        newErrors.push({ field: `match-${index}-away`, message: 'Away team is required' })
      }

      // Check for duplicate teams in the same week
      if (match.homeTeamId) {
        if (usedTeams.has(match.homeTeamId)) {
          newErrors.push({ field: `match-${index}-home`, message: 'Team is already playing in this week' })
        }
        usedTeams.add(match.homeTeamId)
      }
      if (match.awayTeamId) {
        if (usedTeams.has(match.awayTeamId)) {
          newErrors.push({ field: `match-${index}-away`, message: 'Team is already playing in this week' })
        }
        usedTeams.add(match.awayTeamId)
      }

      // Check for same team playing against itself
      if (match.homeTeamId && match.homeTeamId === match.awayTeamId) {
        newErrors.push({ field: `match-${index}`, message: 'Team cannot play against itself' })
      }

      // Check for duplicate time slots
      if (match.startTime) {
        if (usedTimes.has(match.startTime)) {
          newErrors.push({ field: `match-${index}-time`, message: 'Time slot is already taken' })
        }
        usedTimes.add(match.startTime)
      }
    })

    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleMatchChange = (index: number, field: keyof Match, value: string) => {
    const newMatches = [...formData.matches]
    newMatches[index] = { ...newMatches[index], [field]: value }
    setFormData({ ...formData, matches: newMatches })

    // Clear errors for the changed field
    setErrors(errors.filter(error => !error.field.includes(`match-${index}`)))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: formData.date,
          weekNumber,
          matches: formData.matches,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to create schedule')
      }

      onSubmit(formData)
    } catch (error) {
      console.error('Error saving schedule:', error)
      setErrors([{ field: 'submit', message: 'Failed to save schedule' }])
    } finally {
      setLoading(false)
    }
  }

  const getFieldError = (field: string) => {
    return errors.find(error => error.field === field)?.message
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-masters-green mb-4">
          Schedule Week {weekNumber}
        </h3>
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              type="date"
              id="date"
              value={formData.date}
              onChange={(e) => {
                setFormData({ ...formData, date: e.target.value })
                setErrors(errors.filter(error => error.field !== 'date'))
              }}
              className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                getFieldError('date')
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-masters-green focus:ring-masters-green'
              }`}
              required
            />
            {getFieldError('date') && (
              <p className="mt-1 text-sm text-red-600">{getFieldError('date')}</p>
            )}
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-700">Matches</h4>
            {formData.matches.map((match, index) => (
              <div key={index} className="grid grid-cols-3 gap-4 items-end border rounded-lg p-4 bg-gray-50">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Home Team
                  </label>
                  <select
                    value={match.homeTeamId}
                    onChange={(e) => handleMatchChange(index, 'homeTeamId', e.target.value)}
                    className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                      getFieldError(`match-${index}-home`)
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-masters-green focus:ring-masters-green'
                    }`}
                    required
                  >
                    <option value="">Select Team</option>
                    {teams.map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                  {getFieldError(`match-${index}-home`) && (
                    <p className="mt-1 text-sm text-red-600">{getFieldError(`match-${index}-home`)}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Away Team
                  </label>
                  <select
                    value={match.awayTeamId}
                    onChange={(e) => handleMatchChange(index, 'awayTeamId', e.target.value)}
                    className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                      getFieldError(`match-${index}-away`)
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-masters-green focus:ring-masters-green'
                    }`}
                    required
                  >
                    <option value="">Select Team</option>
                    {teams.map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                  {getFieldError(`match-${index}-away`) && (
                    <p className="mt-1 text-sm text-red-600">{getFieldError(`match-${index}-away`)}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={match.startTime}
                    onChange={(e) => handleMatchChange(index, 'startTime', e.target.value)}
                    className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                      getFieldError(`match-${index}-time`)
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-masters-green focus:ring-masters-green'
                    }`}
                    required
                  />
                  {getFieldError(`match-${index}-time`) && (
                    <p className="mt-1 text-sm text-red-600">{getFieldError(`match-${index}-time`)}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {getFieldError('submit') && (
        <p className="text-sm text-red-600">{getFieldError('submit')}</p>
      )}

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-masters-green"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Schedule'}
        </button>
      </div>
    </form>
  )
} 