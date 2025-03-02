'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import WeeklySchedule from '../components/WeeklySchedule'
import ScheduleForm from '../components/ScheduleForm'
import { prisma } from '../../lib/prisma'

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

export default async function SchedulePage() {
  const teams = await prisma.team.findMany({
    orderBy: {
      name: 'asc'
    }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-white mb-2">Match Schedule 🏌️‍♂️</h1>
          <p className="text-emerald-100 text-lg">Set up your next epic golf showdown!</p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8 -mt-8">
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
          <div className="max-w-3xl mx-auto">
            <ScheduleForm teams={teams} onSubmit={() => {}} />
          </div>
        </div>
      </div>
    </div>
  )
} 