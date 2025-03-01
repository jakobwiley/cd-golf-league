'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import WeeklySchedule from '../components/WeeklySchedule'
import ScheduleForm from '../components/ScheduleForm'

// Temporary mock data until we integrate with the database
const MOCK_SCHEDULE = [
  {
    id: '1',
    weekNumber: 1,
    date: '2024-05-01',
    matches: [
      {
        id: '1',
        homeTeam: { id: '1', name: 'Team Eagles' },
        awayTeam: { id: '2', name: 'Team Birdies' },
        startTime: '17:30',
      },
      {
        id: '2',
        homeTeam: { id: '3', name: 'Team Pars' },
        awayTeam: { id: '4', name: 'Team Bogeys' },
        startTime: '17:40',
      },
    ],
  },
  {
    id: '2',
    weekNumber: 2,
    date: '2024-05-08',
    matches: [
      {
        id: '3',
        homeTeam: { id: '2', name: 'Team Birdies' },
        awayTeam: { id: '3', name: 'Team Pars' },
        startTime: '17:30',
      },
      {
        id: '4',
        homeTeam: { id: '4', name: 'Team Bogeys' },
        awayTeam: { id: '1', name: 'Team Eagles' },
        startTime: '17:40',
      },
    ],
  },
]

export default function SchedulePage() {
  const [schedule, setSchedule] = useState(MOCK_SCHEDULE)
  const [isAddingWeek, setIsAddingWeek] = useState(false)

  const handleAddWeek = (weekData: any) => {
    setSchedule((prev) => [...prev, {
      id: String(prev.length + 1),
      weekNumber: prev.length + 1,
      ...weekData,
    }])
    setIsAddingWeek(false)
  }

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-masters-text sm:truncate sm:text-3xl sm:tracking-tight">
            League Schedule
          </h2>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0">
          <button
            type="button"
            className="btn-primary"
            onClick={() => setIsAddingWeek(true)}
          >
            Add Week
          </button>
        </div>
      </div>

      {isAddingWeek ? (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <ScheduleForm
              onSubmit={handleAddWeek}
              onCancel={() => setIsAddingWeek(false)}
              weekNumber={schedule.length + 1}
            />
          </div>
        </div>
      ) : null}

      <div className="space-y-4">
        {schedule.map((week) => (
          <div key={week.id} className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <WeeklySchedule
                weekNumber={week.weekNumber}
                date={format(new Date(week.date), 'MMMM d, yyyy')}
                matches={week.matches}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 