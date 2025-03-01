'use client'

import { useState } from 'react'
import TeamList from '../components/TeamList'
import TeamForm from '../components/TeamForm'

// Temporary mock data until we integrate with the database
const MOCK_TEAMS = [
  {
    id: '1',
    name: 'Team Eagles',
    players: [
      { id: '1', name: 'John Doe', ghinNumber: '1234567' },
      { id: '2', name: 'Jane Smith', ghinNumber: '7654321' },
    ],
  },
  {
    id: '2',
    name: 'Team Birdies',
    players: [
      { id: '3', name: 'Bob Johnson', ghinNumber: '2345678' },
      { id: '4', name: 'Alice Brown', ghinNumber: '8765432' },
    ],
  },
]

export default function TeamsPage() {
  const [teams, setTeams] = useState(MOCK_TEAMS)
  const [isAddingTeam, setIsAddingTeam] = useState(false)

  const handleAddTeam = (team: any) => {
    setTeams((prev) => [...prev, { ...team, id: String(prev.length + 1) }])
    setIsAddingTeam(false)
  }

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-masters-text sm:truncate sm:text-3xl sm:tracking-tight">
            Teams
          </h2>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0">
          <button
            type="button"
            className="btn-primary"
            onClick={() => setIsAddingTeam(true)}
          >
            Add Team
          </button>
        </div>
      </div>

      {isAddingTeam ? (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <TeamForm onSubmit={handleAddTeam} onCancel={() => setIsAddingTeam(false)} />
          </div>
        </div>
      ) : null}

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <TeamList teams={teams} />
        </div>
      </div>
    </div>
  )
} 