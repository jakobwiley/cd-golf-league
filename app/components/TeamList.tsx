'use client'

import { useState } from 'react'

interface Player {
  id: string
  name: string
  ghinNumber: string
}

interface Team {
  id: string
  name: string
  players: Player[]
}

interface TeamListProps {
  teams: Team[]
}

export default function TeamList({ teams }: TeamListProps) {
  const [expandedTeam, setExpandedTeam] = useState<string | null>(null)

  return (
    <div className="space-y-4">
      {teams.map((team) => (
        <div key={team.id} className="border rounded-lg overflow-hidden">
          <button
            className="w-full px-4 py-3 text-left bg-gray-50 hover:bg-gray-100 flex justify-between items-center"
            onClick={() => setExpandedTeam(expandedTeam === team.id ? null : team.id)}
          >
            <span className="font-medium text-masters-green">{team.name}</span>
            <span className="text-sm text-gray-500">
              {team.players.length} Players
            </span>
          </button>
          
          {expandedTeam === team.id && (
            <div className="px-4 py-3">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Players</h4>
              <div className="space-y-2">
                {team.players.map((player) => (
                  <div
                    key={player.id}
                    className="flex justify-between items-center bg-gray-50 p-3 rounded"
                  >
                    <div>
                      <p className="font-medium">{player.name}</p>
                      <p className="text-sm text-gray-500">GHIN: {player.ghinNumber}</p>
                    </div>
                    <button
                      className="text-sm text-masters-green hover:text-masters-green-dark"
                      onClick={() => console.log('Edit player:', player.id)}
                    >
                      Edit
                    </button>
                  </div>
                ))}
                <button
                  className="w-full mt-2 text-sm text-masters-green hover:text-masters-green-dark text-center py-2 border border-dashed border-masters-green rounded"
                  onClick={() => console.log('Add player to team:', team.id)}
                >
                  Add Player
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
} 