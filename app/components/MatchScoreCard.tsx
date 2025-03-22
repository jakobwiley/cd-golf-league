'use client'

import React from 'react'
import clsx from 'clsx'
import { Match, Team, Player, Score } from '../types'
import { calculateCourseHandicap } from '../lib/handicap'

// Define a more flexible score interface that can work with both the app's Score type
// and the LocalScore type from MatchScoring
interface FlexibleScore {
  id?: string
  playerId: string
  strokes?: number
  hole?: number
  matchId?: string
}

interface MatchScoreCardProps {
  match?: Match
  player?: Player
  score?: FlexibleScore
  onScoreChange?: (playerId: string, value: number) => void
  holes?: number[]
  parValues?: {
    [key: number]: number
  }
  onClose?: () => void
  onViewScorecard?: () => void
}

export default function MatchScoreCard({
  match,
  player,
  score,
  onScoreChange,
  holes = [1, 2, 3, 4, 5, 6, 7, 8, 9],
  parValues = {
    1: 5,
    2: 3,
    3: 4,
    4: 3,
    5: 4,
    6: 4,
    7: 4,
    8: 4,
    9: 5
  },
  onClose,
  onViewScorecard
}: MatchScoreCardProps) {
  // If we're in the single player mode (used within MatchScoring)
  if (player && onScoreChange) {
    return (
      <div className="bg-[#030f0f]/50 p-4 rounded-lg border border-[#00df82]/10">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-white font-orbitron">{player.name}</div>
            <div className="text-xs text-[#00df82]/70">CHP: {calculateCourseHandicap(player.handicapIndex)}</div>
          </div>
          {holes.map(hole => {
            const holeScore = score?.strokes || 0;
            return (
              <div key={hole} className="text-center">
                <div className="text-xs text-[#00df82]/70">
                  <div>Hole {hole}</div>
                  <div className="text-[10px]">Par {parValues[hole]}</div>
                </div>
                <input
                  type="number"
                  min="0"
                  className="w-12 bg-[#030f0f] border border-[#00df82]/30 rounded p-1 text-white text-center"
                  placeholder="-"
                  value={holeScore > 0 ? holeScore : ''}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    onScoreChange(player.id, value);
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // If we're in the full match mode (used as standalone component)
  if (!match?.homeTeam || !match?.awayTeam || !onClose || !onViewScorecard) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto py-8" data-component-name="MatchScoreCard">
      <div className="flex items-center justify-between p-4 bg-[#030f0f]/70 border-b border-[#00df82]/20" data-component-name="MatchScoreCard">
        <h2 className="text-xl font-audiowide text-white">Match Scoring</h2>
        <div className="space-x-4">
          <button 
            onClick={onViewScorecard}
            className="text-white hover:text-[#00df82] transition-colors text-sm"
          >
            View Scorecard
          </button>
          <button 
            onClick={onClose}
            className="text-white hover:text-[#00df82] transition-colors text-sm"
          >
            Close
          </button>
        </div>
      </div>
      
      {/* Home Team */}
      <div className="mt-8">
        <h3 className="text-lg font-audiowide text-[#00df82] mb-4" data-component-name="MatchScoreCard">{match.homeTeam.name}</h3>
        <div className="space-y-4">
          {match.homeTeam.players?.map(player => (
            <div key={player.id} className="bg-[#030f0f]/50 p-4 rounded-lg border border-[#00df82]/10">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-white font-orbitron">{player.name}</div>
                  <div className="text-xs text-[#00df82]/70">CHP: {calculateCourseHandicap(player.handicapIndex)}</div>
                </div>
                {holes.map(hole => (
                  <div key={hole} className="text-center">
                    <div className="text-xs text-[#00df82]/70">
                      <div>Hole {hole}</div>
                      <div className="text-[10px]">Par {parValues[hole]}</div>
                    </div>
                    <input
                      type="number"
                      min="0"
                      className="w-12 bg-[#030f0f] border border-[#00df82]/30 rounded p-1 text-white text-center"
                      placeholder="-"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Away Team */}
      <div className="mt-8">
        <h3 className="text-lg font-audiowide text-[#00df82] mb-4" data-component-name="MatchScoreCard">{match.awayTeam.name}</h3>
        <div className="space-y-4">
          {match.awayTeam.players?.map(player => (
            <div key={player.id} className="bg-[#030f0f]/50 p-4 rounded-lg border border-[#00df82]/10">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-white font-orbitron">{player.name}</div>
                  <div className="text-xs text-[#00df82]/70">CHP: {calculateCourseHandicap(player.handicapIndex)}</div>
                </div>
                {holes.map(hole => (
                  <div key={hole} className="text-center">
                    <div className="text-xs text-[#00df82]/70">
                      <div>Hole {hole}</div>
                      <div className="text-[10px]">Par {parValues[hole]}</div>
                    </div>
                    <input
                      type="number"
                      min="0"
                      className="w-12 bg-[#030f0f] border border-[#00df82]/30 rounded p-1 text-white text-center"
                      placeholder="-"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}