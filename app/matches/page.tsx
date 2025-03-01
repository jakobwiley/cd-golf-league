'use client'

import { useState } from 'react'
import MatchScoreCard from '../components/MatchScoreCard'

// Temporary mock data until we integrate with the database
const MOCK_DATA = {
  homeTeam: {
    id: '1',
    name: 'Team Eagles',
    players: [
      { id: '1', name: 'John Doe', ghinNumber: '1234567' },
      { id: '2', name: 'Jane Smith', ghinNumber: '7654321' },
    ],
  },
  awayTeam: {
    id: '2',
    name: 'Team Birdies',
    players: [
      { id: '3', name: 'Bob Johnson', ghinNumber: '2345678' },
      { id: '4', name: 'Alice Brown', ghinNumber: '8765432' },
    ],
  },
}

export default function MatchesPage() {
  const [scores, setScores] = useState<Record<string, number[]>>({})

  const handleScoreChange = (playerId: string, hole: number, score: number) => {
    setScores((prev) => {
      const playerScores = [...(prev[playerId] || Array(9).fill(0))]
      playerScores[hole - 1] = score
      return { ...prev, [playerId]: playerScores }
    })
  }

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-masters-text sm:truncate sm:text-3xl sm:tracking-tight">
            Current Match
          </h2>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0">
          <button
            type="button"
            className="btn-primary"
            onClick={() => console.log('Saving match...', scores)}
          >
            Save Match
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <MatchScoreCard
            homeTeam={MOCK_DATA.homeTeam}
            awayTeam={MOCK_DATA.awayTeam}
            onScoreChange={handleScoreChange}
            scores={scores}
          />
        </div>
      </div>
    </div>
  )
} 