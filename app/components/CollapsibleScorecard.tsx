'use client'

import React from 'react'
import { Match } from '../types'
import { calculateCourseHandicap, holeHandicaps } from '../lib/handicap'

// Add the correct getStrokesGivenForMatchup function directly in this component
// This matches the implementation in HoleByHoleScorecard.tsx
const getStrokesGivenForMatchup = (playerHandicapIndex: number, hole: number, allPlayers: any[]) => {
  // Calculate course handicaps for all players
  const courseHandicaps = allPlayers.map(player => calculateCourseHandicap(player.handicapIndex));
  
  // Find the lowest course handicap in the match
  const lowestCourseHandicap = Math.min(...courseHandicaps);
  
  // Calculate the player's course handicap
  const playerCourseHandicap = calculateCourseHandicap(playerHandicapIndex);
  
  // Calculate the difference between player's handicap and the lowest handicap
  const handicapDifference = playerCourseHandicap - lowestCourseHandicap;
  
  // If player has the lowest handicap or negative difference, they get no strokes
  if (handicapDifference <= 0) return 0;
  
  // Get the hole's handicap value (difficulty rating 1-9)
  const holeHandicapValue = holeHandicaps[hole as keyof typeof holeHandicaps];
  
  // Use the USGA allocation method for multiple strokes
  // First allocation: one stroke per hole starting from the hardest hole
  let strokesGiven = 0;
  
  // First allocation (1-9 strokes)
  if (holeHandicapValue <= handicapDifference) {
    strokesGiven += 1;
  }
  
  // Second allocation (10-18 strokes)
  if (handicapDifference > 9 && holeHandicapValue <= (handicapDifference - 9)) {
    strokesGiven += 1;
  }
  
  // Third allocation (19-27 strokes)
  if (handicapDifference > 18 && holeHandicapValue <= (handicapDifference - 18)) {
    strokesGiven += 1;
  }
  
  // Fourth allocation (28-36 strokes)
  if (handicapDifference > 27 && holeHandicapValue <= (handicapDifference - 27)) {
    strokesGiven += 1;
  }
  
  // Fifth allocation (37-45 strokes)
  if (handicapDifference > 36 && holeHandicapValue <= (handicapDifference - 36)) {
    strokesGiven += 1;
  }
  
  return strokesGiven;
}

interface Props {
  match: Match
}

export default function CollapsibleScorecard({ match }: Props) {
  const holes = [1, 2, 3, 4, 5, 6, 7, 8, 9]

  if (!match || !match.homeTeam || !match.awayTeam) {
    return <div>Loading...</div>;
  }

  const homeTeamPlayers = match.homeTeam.players || []
  const awayTeamPlayers = match.awayTeam.players || []
  const allPlayers = [...homeTeamPlayers, ...awayTeamPlayers]

  // Calculate player gross and net scores
  const getPlayerScores = (player: any) => {
    const scores = holes.map(hole => {
      const score = match.scores?.find(s => s.playerId === player.id && s.hole === hole)
      return score?.strokes || 0
    })
    const gross = scores.reduce((sum, score) => sum + score, 0)
    // Use the correct course handicap calculation from lib/handicap.ts
    const courseHandicap = calculateCourseHandicap(player.handicapIndex)
    const net = Math.max(0, gross - courseHandicap)
    return { gross, net }
  }

  return (
    <div className="px-4 pb-4 relative z-10" data-component-name="CollapsibleScorecard">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-[#030f0f]/70 border-b border-[#00df82]/20">
              <th className="p-2 text-left text-white font-audiowide sticky left-0 bg-[#030f0f]/70 z-10 min-w-[120px]">Player</th>
              {holes.map(hole => (
                <th key={hole} className="p-2 text-center text-white font-audiowide">{hole}</th>
              ))}
              <th className="p-2 text-center text-white font-audiowide">Gross</th>
              <th className="p-2 text-center text-[#00df82] font-audiowide">Net</th>
            </tr>
          </thead>
          <tbody>
            {/* Home Team */}
            <tr className="border-b border-[#00df82]/10 bg-[#00df82]/5">
              <td className="p-2 text-left sticky left-0 bg-[#00df82]/5 z-10">
                <div className="text-white font-audiowide" data-component-name="CollapsibleScorecard">{match.homeTeam.name}</div>
                <div className="text-xs text-[#00df82]/70 mt-1" data-component-name="CollapsibleScorecard">Team Points</div>
              </td>
              {holes.map(hole => (
                <td key={hole} className="p-2 text-center">
                  <div className="flex flex-col items-center">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mb-1 bg-[#030f0f]/50 text-white/30">0</div>
                  </div>
                </td>
              ))}
              <td className="p-2 text-center">
                <div className="text-white font-bold">0.0</div>
              </td>
              <td className="p-2"></td>
            </tr>
            
            {homeTeamPlayers.map(player => {
              const { gross, net } = getPlayerScores(player)
              // Use the correct course handicap calculation from lib/handicap.ts
              const courseHandicap = calculateCourseHandicap(player.handicapIndex)
              return (
                <tr key={player.id} className="border-b border-[#00df82]/5">
                  <td className="p-2 text-left sticky left-0 bg-[#030f0f]/90 z-10">
                    <div className="text-white font-orbitron" data-component-name="CollapsibleScorecard">{player.name}</div>
                    <div className="text-xs text-[#00df82]/70 font-audiowide" data-component-name="CollapsibleScorecard">
                      <span>CHP: {courseHandicap}</span>
                    </div>
                  </td>
                  {holes.map(hole => {
                    const score = match.scores?.find(s => s.playerId === player.id && s.hole === hole)
                    const strokesGiven = getStrokesGivenForMatchup(player.handicapIndex, hole, allPlayers)
                    return (
                      <td key={hole} className="p-2 text-center text-white font-medium">
                        <div className="relative">
                          {score?.strokes || '-'}
                          {strokesGiven > 0 && (
                            <span className="absolute -top-1 -right-2 text-[#00df82] text-xs" data-component-name="CollapsibleScorecard">
                              {Array(strokesGiven).fill('*').join('')}
                            </span>
                          )}
                        </div>
                      </td>
                    )
                  })}
                  <td className="p-2 text-center">
                    <div className="text-white font-bold">{gross || 0}</div>
                  </td>
                  <td className="p-2 text-center text-[#00df82] font-bold">{net || 0}</td>
                </tr>
              )
            })}
            
            {/* Away Team */}
            <tr className="border-b border-[#00df82]/10 bg-[#00df82]/5">
              <td className="p-2 text-left sticky left-0 bg-[#00df82]/5 z-10">
                <div className="text-white font-audiowide" data-component-name="CollapsibleScorecard">{match.awayTeam.name}</div>
                <div className="text-xs text-[#00df82]/70 mt-1" data-component-name="CollapsibleScorecard">Team Points</div>
              </td>
              {holes.map(hole => (
                <td key={hole} className="p-2 text-center">
                  <div className="flex flex-col items-center">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mb-1 bg-[#030f0f]/50 text-white/30">0</div>
                  </div>
                </td>
              ))}
              <td className="p-2 text-center">
                <div className="text-white font-bold">0.0</div>
              </td>
              <td className="p-2"></td>
            </tr>
            
            {awayTeamPlayers.map(player => {
              const { gross, net } = getPlayerScores(player)
              // Use the correct course handicap calculation from lib/handicap.ts
              const courseHandicap = calculateCourseHandicap(player.handicapIndex)
              return (
                <tr key={player.id} className="border-b border-[#00df82]/5">
                  <td className="p-2 text-left sticky left-0 bg-[#030f0f]/90 z-10">
                    <div className="text-white font-orbitron" data-component-name="CollapsibleScorecard">{player.name}</div>
                    <div className="text-xs text-[#00df82]/70 font-audiowide" data-component-name="CollapsibleScorecard">
                      <span>CHP: {courseHandicap}</span>
                    </div>
                  </td>
                  {holes.map(hole => {
                    const score = match.scores?.find(s => s.playerId === player.id && s.hole === hole)
                    const strokesGiven = getStrokesGivenForMatchup(player.handicapIndex, hole, allPlayers)
                    return (
                      <td key={hole} className="p-2 text-center text-white font-medium">
                        <div className="relative">
                          {score?.strokes || '-'}
                          {strokesGiven > 0 && (
                            <span className="absolute -top-1 -right-2 text-[#00df82] text-xs" data-component-name="CollapsibleScorecard">
                              {Array(strokesGiven).fill('*').join('')}
                            </span>
                          )}
                        </div>
                      </td>
                    )
                  })}
                  <td className="p-2 text-center">
                    <div className="text-white font-bold">{gross || 0}</div>
                  </td>
                  <td className="p-2 text-center text-[#00df82] font-bold">{net || 0}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
