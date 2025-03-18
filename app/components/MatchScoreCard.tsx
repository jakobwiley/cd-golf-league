'use client'

import React from 'react'
import clsx from 'clsx'
import { Match, Team, Player } from '../types'
import { calculateCourseHandicap } from '../lib/handicap'

interface MatchScoreCardProps {
  player: Player
  score?: {
    id?: string
    matchId: string
    playerId: string
    grossScore: number
    netScore?: number
    player?: Player
  }
  onScoreChange: (playerId: string, value: number) => void
  holes: number[]
  parValues: {
    [key: number]: number
  }
}

export default function MatchScoreCard({
  player,
  score,
  onScoreChange,
  holes,
  parValues
}: MatchScoreCardProps) {
  return (
    <div className="bg-[#030f0f]/50 p-4 rounded-lg border border-[#00df82]/10">
      <div className="flex justify-between items-center mb-4">
        <div>
          <div className="text-white font-orbitron">{player.name}</div>
          <div className="text-xs text-[#00df82]/70">CHP: {calculateCourseHandicap(player.handicapIndex)}</div>
        </div>
        <div>
          <input
            type="number"
            min="0"
            value={score?.grossScore || ''}
            onChange={(e) => onScoreChange(player.id, parseInt(e.target.value) || 0)}
            className="w-20 bg-[#030f0f] border border-[#00df82]/30 rounded p-1 text-white text-center"
            placeholder="Score"
          />
        </div>
      </div>
    </div>
  )
}