import React from 'react'
import type { Team, Match } from '../../types'
import { format } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'
import ScheduleForm from './ScheduleForm'
import WeeklySchedule from './WeeklySchedule'

interface ScheduleFormData {
  date: string
  weekNumber: number
  startingHole: number
  homeTeamId: string
  awayTeamId: string
  status: string
}

// Helper function to ensure consistent date handling
const formatDateForAPI = (date: string) => {
  const d = new Date(date)
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().split('T')[0]
}

const GolfSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="relative">
      {/* Golf ball */}
      <div className="w-12 h-12 bg-white rounded-full animate-bounce shadow-lg">
        <div className="absolute inset-1 opacity-20">
          {/* Golf ball dimples pattern */}
          <div className="grid grid-cols-3 gap-1 h-full">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="bg-gray-400 rounded-full"></div>
            ))}
          </div>
        </div>
      </div>
      {/* Golf club swing animation */}
      <div className="absolute -right-8 top-1/2 w-8 h-1 bg-gray-400 rounded origin-left animate-[swing_1s_ease-in-out_infinite]" 
           style={{
             animation: 'swing 1s ease-in-out infinite',
             transformOrigin: '0% 50%'
           }}
      ></div>
    </div>
    <style jsx>{`
      @keyframes swing {
        0%, 100% { transform: rotate(45deg); }
        50% { transform: rotate(-45deg); }
      }
    `}</style>
  </div>
)

export default function SchedulePageClient() {
  const [matches, setMatches] = React.useState<Match[]>([])
  const [teams, setTeams] = React.useState<Team[]>([])
  const [loading, setLoading] = React.useState(false)
  const [showForm, setShowForm] = React.useState(false)

  React.useEffect(() => {
    fetchMatches()
    fetchTeams()
  }, [])

  const fetchMatches = async () => {
    try {
      const response = await fetch('/api/schedule')
      const data = await response.json()
      setMatches(data.matches || [])
    } catch (error) {
      console.error('Error fetching matches:', error)
    }
  }

  const fetchTeams = async () => {
    try {
      const response = await fetch('/api/teams')
      const data = await response.json()
      setTeams(data.teams || [])
    } catch (error) {
      console.error('Error fetching teams:', error)
    }
  }

  const handleSubmit = async (formData: ScheduleFormData) => {
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
        throw new Error('Failed to create match')
      }

      await fetchMatches()
      setShowForm(false)
    } catch (error) {
      console.error('Error creating match:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Schedule</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          {showForm ? 'Cancel' : 'Add Match'}
        </button>
      </div>

      {showForm && (
        <div className="mb-8">
          <ScheduleForm teams={teams} onSubmit={handleSubmit} />
        </div>
      )}

      {loading && <GolfSpinner />}
      <WeeklySchedule matches={matches} teams={teams} />
    </div>
  )
}