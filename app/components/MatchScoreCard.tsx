'use client'

import React from 'react'
import clsx from 'clsx'
import { Match, Player } from '@prisma/client'
import { calculateCourseHandicap, getStrokesGivenForMatchup } from '../lib/handicap'

interface MatchScoreCardProps {
  match: Match & {
    homeTeam: {
      id: string
      name: string
      createdAt: Date
      updatedAt: Date
    }
    awayTeam: {
      id: string
      name: string
      createdAt: Date
      updatedAt: Date
    }
  }
  homeTeamPlayers: Player[]
  awayTeamPlayers: Player[]
  allPlayers: Player[]
  activeHole: number
  playerScores: {
    [playerId: string]: { hole: number; score: number }[]
  }
  holePoints: {
    [hole: number]: {
      home: number
      away: number
    }
  }
  totalPoints: {
    home: number
    away: number
  }
  onScoreChange: (playerId: string, hole: number, score: number) => void
}

export default function MatchScoreCard({
  match,
  homeTeamPlayers,
  awayTeamPlayers,
  allPlayers,
  activeHole,
  playerScores,
  holePoints,
  totalPoints,
  onScoreChange
}: MatchScoreCardProps) {
  const holes = Array.from({ length: 9 }, (_, i) => i + 1)

  const parValues = {
    1: 4,
    2: 4,
    3: 3,
    4: 4,
    5: 5,
    6: 3,
    7: 4,
    8: 5,
    9: 4
  }

  const getPlayerNetScore = (playerId: string, hole: number): number | null => {
    const score = playerScores[playerId]?.[hole - 1]?.score
    if (!score) return null
    
    const player = [...homeTeamPlayers, ...awayTeamPlayers].find(p => p.id === playerId)
    if (!player) return null
    
    const strokesGiven = getStrokesGivenForMatchup(player.handicapIndex, hole, allPlayers)
    return score - strokesGiven
  }

  return (
    <div className="bg-[#030f0f]/50 p-4 rounded-lg border border-[#00df82]/10">
      <h3 className="text-xl font-audiowide text-white mb-4">Hole-by-Hole Scorecard</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#00df82]/10 border-b border-[#00df82]/20">
              <th className="p-2 text-left text-white font-orbitron">Player</th>
              {holes.map(hole => (
                <th key={hole} className="p-2 text-center text-white font-orbitron">
                  <div>{hole}</div>
                  <div className="text-xs text-[#00df82]/70">Par {parValues[hole as keyof typeof parValues]}</div>
                </th>
              ))}
              <th className="p-2 text-center text-white font-orbitron">Total</th>
            </tr>
          </thead>
          
          <tbody>
            <tr className="border-b border-[#00df82]/20">
              <td colSpan={11} className="p-2 bg-[#00df82]/10">
                <div className="text-white font-audiowide">{match.homeTeam.name}</div>
                <div className="text-sm text-[#00df82]">{totalPoints.home.toFixed(1)} points</div>
              </td>
            </tr>
            {homeTeamPlayers.map(player => (
              <tr key={player.id} className="border-b border-[#00df82]/10 hover:bg-[#00df82]/5">
                <td className="p-2">
                  <div className="text-white font-orbitron">{player.name}</div>
                  <div className="text-xs text-[#00df82]/70">CHP: {calculateCourseHandicap(player.handicapIndex)}</div>
                </td>
                {holes.map(hole => {
                  const score = playerScores[player.id]?.[hole - 1]?.score
                  const netScore = getPlayerNetScore(player.id, hole)
                  const strokesGiven = getStrokesGivenForMatchup(player.handicapIndex, hole, allPlayers)
                  
                  return (
                    <td key={hole} className="p-2 text-center">
                      <div className="relative">
                        <input
                          type="number"
                          min="1"
                          max="12"
                          value={score || ''}
                          onChange={(e) => onScoreChange(player.id, hole, parseInt(e.target.value) || 0)}
                          className={`w-12 bg-[#030f0f] border ${hole === activeHole ? 'border-[#00df82]' : 'border-[#00df82]/30'} rounded p-1 text-white text-center`}
                          placeholder="-"
                        />
                        {strokesGiven > 0 && (
                          <span className="absolute -top-2 -right-2 text-[#00df82] text-xs font-bold">
                            {Array(strokesGiven).fill('*').join('')}
                          </span>
                        )}
                      </div>
                      {netScore !== null && (
                        <div className="text-xs text-[#00df82]/70 mt-1">
                          Net: {netScore}
                        </div>
                      )}
                    </td>
                  )
                })}
                <td className="p-2 text-center text-white">
                  {playerScores[player.id]?.reduce((sum, score) => sum + (score.score || 0), 0) || '-'}
                </td>
              </tr>
            ))}
          </tbody>
          
          <tbody>
            <tr className="border-b border-[#00df82]/20">
              <td colSpan={11} className="p-2 bg-[#00df82]/10">
                <div className="text-white font-audiowide">{match.awayTeam.name}</div>
                <div className="text-sm text-[#00df82]">{totalPoints.away.toFixed(1)} points</div>
              </td>
            </tr>
            {awayTeamPlayers.map(player => (
              <tr key={player.id} className="border-b border-[#00df82]/10 hover:bg-[#00df82]/5">
                <td className="p-2">
                  <div className="text-white font-orbitron">{player.name}</div>
                  <div className="text-xs text-[#00df82]/70">CHP: {calculateCourseHandicap(player.handicapIndex)}</div>
                </td>
                {holes.map(hole => {
                  const score = playerScores[player.id]?.[hole - 1]?.score
                  const netScore = getPlayerNetScore(player.id, hole)
                  const strokesGiven = getStrokesGivenForMatchup(player.handicapIndex, hole, allPlayers)
                  
                  return (
                    <td key={hole} className="p-2 text-center">
                      <div className="relative">
                        <input
                          type="number"
                          min="1"
                          max="12"
                          value={score || ''}
                          onChange={(e) => onScoreChange(player.id, hole, parseInt(e.target.value) || 0)}
                          className={`w-12 bg-[#030f0f] border ${hole === activeHole ? 'border-[#00df82]' : 'border-[#00df82]/30'} rounded p-1 text-white text-center`}
                          placeholder="-"
                        />
                        {strokesGiven > 0 && (
                          <span className="absolute -top-2 -right-2 text-[#00df82] text-xs font-bold">
                            {Array(strokesGiven).fill('*').join('')}
                          </span>
                        )}
                      </div>
                      {netScore !== null && (
                        <div className="text-xs text-[#00df82]/70 mt-1">
                          Net: {netScore}
                        </div>
                      )}
                    </td>
                  )
                })}
                <td className="p-2 text-center text-white">
                  {playerScores[player.id]?.reduce((sum, score) => sum + (score.score || 0), 0) || '-'}
                </td>
              </tr>
            ))}
          </tbody>
          
          <tbody>
            <tr className="border-t-2 border-[#00df82]/20">
              <td className="p-2 text-white font-audiowide">Points</td>
              {holes.map(hole => (
                <td key={hole} className="p-2 text-center">
                  <div className="text-[#00df82]">
                    {holePoints[hole]?.home || '0'} - {holePoints[hole]?.away || '0'}
                  </div>
                </td>
              ))}
              <td className="p-2 text-center text-[#00df82] font-bold">
                {totalPoints.home.toFixed(1)} - {totalPoints.away.toFixed(1)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
} 