'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import ScheduleForm from './ScheduleForm'

interface Team {
  id: string
  name: string
}

interface Match {
  id: string
  homeTeam: Team
  awayTeam: Team
  startTime: string
}

interface WeeklyScheduleProps {
  weekNumber: number
  date: string
  matches: Match[]
  onUpdate?: (weekNumber: number, data: any) => void
}

export default function WeeklySchedule({
  weekNumber,
  date,
  matches,
  onUpdate,
}: WeeklyScheduleProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleUpdate = async (data: any) => {
    setLoading(true)
    try {
      const response = await fetch('/api/schedule', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          weekNumber,
          ...data,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update schedule')
      }

      onUpdate?.(weekNumber, data)
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating schedule:', error)
      // Handle error (could add error state and display message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (matchId: string) => {
    if (!confirm('Are you sure you want to delete this match?')) {
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/schedule?id=${matchId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete match')
      }

      // Refresh the schedule (you'll need to implement this)
      onUpdate?.(weekNumber, { matches: matches.filter(m => m.id !== matchId) })
    } catch (error) {
      console.error('Error deleting match:', error)
      // Handle error
    } finally {
      setLoading(false)
    }
  }

  if (isEditing) {
    return (
      <ScheduleForm
        weekNumber={weekNumber}
        initialData={{
          date,
          matches: matches.map(match => ({
            homeTeamId: match.homeTeam.id,
            awayTeamId: match.awayTeam.id,
            startTime: match.startTime,
          })),
        }}
        onSubmit={handleUpdate}
        onCancel={() => setIsEditing(false)}
      />
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-medium text-masters-green">
            Week {weekNumber}
          </h3>
          <p className="text-sm text-gray-500">{date}</p>
        </div>
        <button
          type="button"
          className="text-sm text-masters-green hover:text-masters-green-dark"
          onClick={() => setIsEditing(true)}
          disabled={loading}
        >
          Edit Week
        </button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Home Team
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                vs
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Away Team
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {matches.map((match) => (
              <tr key={match.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {match.startTime}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {match.homeTeam.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  vs
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {match.awayTeam.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      className="text-masters-green hover:text-masters-green-dark"
                      onClick={() => window.location.href = `/matches/${match.id}`}
                      disabled={loading}
                    >
                      View Match
                    </button>
                    <button
                      type="button"
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDelete(match.id)}
                      disabled={loading}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 