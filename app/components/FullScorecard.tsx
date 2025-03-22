'use client'

import React from 'react'
import { Match } from '../types'
import { calculateCourseHandicap, getStrokesGivenForMatchup } from '../utils/handicap'

interface Props {
  match: Match
}

export default function FullScorecard({ match }: Props) {
  const holes = [1, 2, 3, 4, 5, 6, 7, 8, 9]

  if (!match || !match.homeTeam || !match.awayTeam) {
    return <div>Loading...</div>;
  }

  const homeTeamPlayers = match.homeTeam.players || []
  const awayTeamPlayers = match.awayTeam.players || []
  const allPlayers = [...homeTeamPlayers, ...awayTeamPlayers]

  // Find lowest handicap player
  const lowestHandicap = Math.min(...allPlayers.map(p => p.handicapIndex))

  // Calculate team points
  const getTeamPoints = (hole: number, teamPlayers: any[]) => {
    return 0 // Team points are displayed but calculated elsewhere
  }

  // Calculate player gross and net scores
  const getPlayerScores = (player: any) => {
    const scores = holes.map(hole => {
      const score = match.scores?.find(s => s.playerId === player.id && s.hole === hole)
      return score?.strokes || 0
    })
    const gross = scores.reduce((sum, score) => sum + score, 0)
    const chp = calculateCourseHandicap(player.handicapIndex)
    const net = Math.max(0, gross - chp)
    return { gross, net }
  }

  // Get strokes given for a hole based on handicap difference
  const getStrokesForHole = (playerHandicap: number, hole: number) => {
    const handicapDiff = calculateCourseHandicap(playerHandicap) - calculateCourseHandicap(lowestHandicap)
    if (handicapDiff <= 0) return 0

    // Double handicap diff for 9 holes
    const adjustedHandicapDiff = handicapDiff * 2

    // Hole handicaps for 9-hole play (1-9)
    const holeHandicaps = {
      1: 7,
      2: 3,
      3: 1,
      4: 9,
      5: 5,
      6: 2,
      7: 8,
      8: 4,
      9: 6
    }

    const holeHandicap = holeHandicaps[hole as keyof typeof holeHandicaps]
    return adjustedHandicapDiff >= holeHandicap ? 1 : 0
  }

  return (
    <div className="relative overflow-hidden rounded-xl backdrop-blur-sm bg-[#030f0f]/70 border border-[#00df82]/20" data-component-name="FullScorecard">
      <div className="overflow-x-auto">
        <table className="w-full text-white" data-component-name="FullScorecard">
          <thead>
            <tr className="border-b border-[#00df82]/20">
              <th className="text-left p-4 font-audiowide" data-component-name="FullScorecard">Player</th>
              {holes.map(hole => (
                <th key={hole} className="p-4 font-audiowide text-center">{hole}</th>
              ))}
              <th className="p-4 font-audiowide text-center">Gross</th>
              <th className="p-4 font-audiowide text-center text-[#00df82]">Net</th>
            </tr>
          </thead>
          <tbody className="bg-[#030f0f]">
            {/* Home Team */}
            <tr className="border-b border-[#00df82]/20">
              <td className="p-4 font-audiowide text-[#00df82]" data-component-name="FullScorecard">{match.homeTeam.name}</td>
              {holes.map(hole => (
                <td key={hole} className="p-4 text-center">{getTeamPoints(hole, homeTeamPlayers)}</td>
              ))}
              <td className="p-4 text-center">0.0</td>
              <td className="p-4 text-center text-[#00df82]">0.0</td>
            </tr>
            <tr className="border-b border-[#00df82]/20 bg-[#00df82]/5">
              <td className="p-4 text-sm text-[#00df82]" data-component-name="FullScorecard">Team Points</td>
              {holes.map(hole => (
                <td key={hole} className="p-4 text-center text-sm text-[#00df82]">{getTeamPoints(hole, homeTeamPlayers)}</td>
              ))}
              <td className="p-4"></td>
              <td className="p-4"></td>
            </tr>
            {homeTeamPlayers.map(player => {
              const { gross, net } = getPlayerScores(player)
              const chp = calculateCourseHandicap(player.handicapIndex)
              return (
                <tr key={player.id} className="border-b border-[#00df82]/20 bg-[#030f0f]" data-component-name="FullScorecard">
                  <td className="p-4" data-component-name="FullScorecard">
                    <div>{player.name}</div>
                    <div className="text-[#00df82] text-sm">CHP: {chp}</div>
                  </td>
                  {holes.map(hole => {
                    const score = match.scores?.find(s => s.playerId === player.id && s.hole === hole)
                    const strokes = score?.strokes || 0
                    const strokesGiven = getStrokesForHole(player.handicapIndex, hole)
                    return (
                      <td key={hole} className="p-4 text-center relative" data-component-name="FullScorecard">
                        {strokes || '-'}
                        {strokesGiven > 0 && (
                          <span className="absolute -top-1 -right-1 text-[#00df82] text-xs">*</span>
                        )}
                      </td>
                    )
                  })}
                  <td className="p-4 text-center" data-component-name="FullScorecard">{gross || 0}</td>
                  <td className="p-4 text-center text-[#00df82]" data-component-name="FullScorecard">{net || 0}</td>
                </tr>
              )
            })}

            {/* Away Team */}
            <tr className="border-b border-[#00df82]/20">
              <td className="p-4 font-audiowide text-[#00df82]" data-component-name="FullScorecard">{match.awayTeam.name}</td>
              {holes.map(hole => (
                <td key={hole} className="p-4 text-center">{getTeamPoints(hole, awayTeamPlayers)}</td>
              ))}
              <td className="p-4 text-center">0.0</td>
              <td className="p-4 text-center text-[#00df82]">0.0</td>
            </tr>
            <tr className="border-b border-[#00df82]/20 bg-[#00df82]/5">
              <td className="p-4 text-sm text-[#00df82]" data-component-name="FullScorecard">Team Points</td>
              {holes.map(hole => (
                <td key={hole} className="p-4 text-center text-sm text-[#00df82]">{getTeamPoints(hole, awayTeamPlayers)}</td>
              ))}
              <td className="p-4"></td>
              <td className="p-4"></td>
            </tr>
            {awayTeamPlayers.map(player => {
              const { gross, net } = getPlayerScores(player)
              const chp = calculateCourseHandicap(player.handicapIndex)
              return (
                <tr key={player.id} className="border-b border-[#00df82]/20 bg-[#030f0f]" data-component-name="FullScorecard">
                  <td className="p-4" data-component-name="FullScorecard">
                    <div>{player.name}</div>
                    <div className="text-[#00df82] text-sm">CHP: {chp}</div>
                  </td>
                  {holes.map(hole => {
                    const score = match.scores?.find(s => s.playerId === player.id && s.hole === hole)
                    const strokes = score?.strokes || 0
                    const strokesGiven = getStrokesForHole(player.handicapIndex, hole)
                    return (
                      <td key={hole} className="p-4 text-center relative" data-component-name="FullScorecard">
                        {strokes || '-'}
                        {strokesGiven > 0 && (
                          <span className="absolute -top-1 -right-1 text-[#00df82] text-xs">*</span>
                        )}
                      </td>
                    )
                  })}
                  <td className="p-4 text-center" data-component-name="FullScorecard">{gross || 0}</td>
                  <td className="p-4 text-center text-[#00df82]" data-component-name="FullScorecard">{net || 0}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
