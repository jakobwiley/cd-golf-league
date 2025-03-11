import { useState, useEffect } from 'react'
import { Match } from '@prisma/client'
import ScheduleForm from './ScheduleForm'
import WeeklySchedule from './WeeklySchedule'

interface ScheduleFormData {
  date: string
  weekNumber: number
  homeTeamId: string
  awayTeamId: string
  startingHole: number
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
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    fetchMatches()
  }, [])

  const fetchMatches = async () => {
    try {
      const response = await fetch('/api/schedule')
      const data = await response.json()
      // Ensure dates are properly formatted when receiving from API
      const formattedData = data.map((match: any) => ({
        ...match,
        date: new Date(match.date).toISOString().split('T')[0]
      }))
      setMatches(formattedData)
    } catch (error) {
      console.error('Error fetching matches:', error)
    }
  }

  const handleScheduleMatch = async (data: ScheduleFormData) => {
    setLoading(true)
    try {
      // Format the date before sending to API
      const formattedData = {
        ...data,
        date: formatDateForAPI(data.date)
      }

      const response = await fetch('/api/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      })

      if (!response.ok) {
        throw new Error('Failed to schedule match')
      }

      await response.json()
      await fetchMatches()
    } catch (error) {
      console.error('Error scheduling match:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <ScheduleForm onSubmit={handleScheduleMatch} />
      {loading && <GolfSpinner />}
      <WeeklySchedule matches={matches} />
    </div>
  )
} 