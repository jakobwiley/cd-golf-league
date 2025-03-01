import React from 'react'
import clsx from 'clsx'

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

interface MatchScoreCardProps {
  homeTeam: Team
  awayTeam: Team
  onScoreChange: (playerId: string, hole: number, score: number) => void
  scores: Record<string, number[]>
}

export default function MatchScoreCard({ homeTeam, awayTeam, onScoreChange, scores }: MatchScoreCardProps) {
  const holes = Array.from({ length: 9 }, (_, i) => i + 1)

  const calculateTotal = (playerId: string) => {
    return scores[playerId]?.reduce((sum, score) => sum + (score || 0), 0) || 0
  }

  const renderScoreInput = (playerId: string, hole: number) => {
    const currentScore = scores[playerId]?.[hole - 1] || ''
    
    return (
      <input
        type="number"
        min="1"
        max="12"
        value={currentScore}
        onChange={(e) => onScoreChange(playerId, hole, parseInt(e.target.value) || 0)}
        className="w-12 h-12 text-center border rounded focus:ring-masters-green focus:border-masters-green"
      />
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Player
            </th>
            {holes.map((hole) => (
              <th
                key={hole}
                className="px-6 py-3 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {hole}
              </th>
            ))}
            <th className="px-6 py-3 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {[homeTeam, awayTeam].map((team) => (
            <React.Fragment key={team.id}>
              <tr className="bg-masters-green bg-opacity-10">
                <td
                  colSpan={11}
                  className="px-6 py-2 text-sm font-medium text-masters-green"
                >
                  {team.name}
                </td>
              </tr>
              {team.players.map((player) => (
                <tr key={player.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {player.name}
                  </td>
                  {holes.map((hole) => (
                    <td key={hole} className="px-6 py-4 whitespace-nowrap text-center">
                      {renderScoreInput(player.id, hole)}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-center font-bold">
                    {calculateTotal(player.id)}
                  </td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  )
} 