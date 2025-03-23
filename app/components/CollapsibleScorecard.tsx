'use client'

import React from 'react'
import { Match as AppMatch, Score as AppScore } from '../types'
import { calculateCourseHandicap, holeHandicaps } from '../lib/handicap'
import { ChevronDown, ChevronUp } from 'lucide-react'

// Define a more flexible score type that can handle both API and app formats
interface FlexibleScore {
  id: string
  matchId: string
  playerId: string
  hole: number
  score?: number | null
  strokes?: number | null
  putts?: number
  fairway?: boolean
  createdAt?: string
  updatedAt?: string
}

// Extend the Match type to use our FlexibleScore
interface Match extends Omit<AppMatch, 'scores'> {
  scores?: FlexibleScore[]
}

// Add the correct getStrokesGivenForMatchup function directly in this component
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
  // Always keep the scorecard visible
  const isOpen = true;
  const holes = Array.from({ length: 9 }, (_, i) => i + 1)

  if (!match || !match.homeTeam || !match.awayTeam) {
    return <div>Loading...</div>;
  }

  const homeTeamPlayers = match.homeTeam.players || []
  const awayTeamPlayers = match.awayTeam.players || []
  const allPlayers = [...homeTeamPlayers, ...awayTeamPlayers]

  // Calculate player gross and net scores
  const getPlayerScores = (player: any) => {
    const scores = holes.map(hole => {
      // Find the score for this player and hole
      const score = match.scores?.find((s: FlexibleScore) => s.playerId === player.id && s.hole === hole)
      // API returns 'score' property but our app type uses 'strokes'
      return score ? (score.score !== undefined ? score.score : score.strokes) || 0 : 0
    })
    const gross = scores.reduce((sum, score) => sum + score, 0)
    // Use the correct course handicap calculation from lib/handicap.ts
    const courseHandicap = calculateCourseHandicap(player.handicapIndex)
    const net = Math.max(0, gross - courseHandicap)
    return { gross, net }
  }

  // Get player net score for a specific hole
  const getPlayerNetScore = (player: any, hole: number) => {
    const score = match.scores?.find((s: FlexibleScore) => s.playerId === player.id && s.hole === hole)
    if (!score || (score.score === undefined && score.strokes === undefined)) return null;
    
    const scoreValue = score.score !== undefined ? score.score : score.strokes;
    if (scoreValue === null) return null;
    
    const strokesGiven = getStrokesGivenForMatchup(player.handicapIndex, hole, allPlayers);
    return (scoreValue || 0) - strokesGiven;
  }

  // Calculate hole points for each team
  const calculateHolePoints = () => {
    const holePoints: { [hole: number]: { home: number, away: number } } = {};
    let totalHomePoints = 0;
    let totalAwayPoints = 0;
    
    holes.forEach(hole => {
      // Get net scores for home team players
      const homeNetScores = homeTeamPlayers
        .map(player => {
          const netScore = getPlayerNetScore(player, hole);
          return netScore !== null ? { playerId: player.id, netScore } : null;
        })
        .filter(score => score !== null) as { playerId: string, netScore: number }[];
      
      // Get net scores for away team players
      const awayNetScores = awayTeamPlayers
        .map(player => {
          const netScore = getPlayerNetScore(player, hole);
          return netScore !== null ? { playerId: player.id, netScore } : null;
        })
        .filter(score => score !== null) as { playerId: string, netScore: number }[];
      
      // If either team doesn't have scores, no points are awarded
      if (homeNetScores.length === 0 || awayNetScores.length === 0) {
        holePoints[hole] = { home: 0, away: 0 };
        return;
      }
      
      // Find the lowest net score for each team
      const lowestHomeNetScore = Math.min(...homeNetScores.map(s => s.netScore));
      const lowestAwayNetScore = Math.min(...awayNetScores.map(s => s.netScore));
      
      // Determine the winner
      if (lowestHomeNetScore < lowestAwayNetScore) {
        holePoints[hole] = { home: 1, away: 0 };
        totalHomePoints += 1;
      } else if (lowestAwayNetScore < lowestHomeNetScore) {
        holePoints[hole] = { home: 0, away: 1 };
        totalAwayPoints += 1;
      } else {
        // Tie - each team gets 0.5 points
        holePoints[hole] = { home: 0.5, away: 0.5 };
        totalHomePoints += 0.5;
        totalAwayPoints += 0.5;
      }
    });
    
    return { holePoints, totalHomePoints, totalAwayPoints };
  }
  
  // Calculate points for all holes
  const { holePoints, totalHomePoints, totalAwayPoints } = calculateHolePoints();

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
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold mb-1 ${
                      holePoints[hole]?.home > 0 
                        ? 'bg-[#00df82]/20 text-[#00df82]' 
                        : 'bg-[#030f0f]/50 text-white/30'
                    }`}>
                      {holePoints[hole]?.home || 0}
                    </div>
                  </div>
                </td>
              ))}
              <td className="p-2 text-center">
                <div className="text-white font-bold">{totalHomePoints.toFixed(1)}</div>
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
                    const score = match.scores?.find((s: FlexibleScore) => s.playerId === player.id && s.hole === hole)
                    const strokesGiven = getStrokesGivenForMatchup(player.handicapIndex, hole, allPlayers)
                    return (
                      <td key={hole} className="p-2 text-center text-white font-medium">
                        <div className="relative">
                          {score ? (score.score !== undefined ? score.score : score.strokes) || '-' : '-'}
                          {strokesGiven > 0 && (
                            <span className="absolute -top-1 -right-1 text-xs text-[#00df82]">•</span>
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
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold mb-1 ${
                      holePoints[hole]?.away > 0 
                        ? 'bg-[#00df82]/20 text-[#00df82]' 
                        : 'bg-[#030f0f]/50 text-white/30'
                    }`}>
                      {holePoints[hole]?.away || 0}
                    </div>
                  </div>
                </td>
              ))}
              <td className="p-2 text-center">
                <div className="text-white font-bold">{totalAwayPoints.toFixed(1)}</div>
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
                    const score = match.scores?.find((s: FlexibleScore) => s.playerId === player.id && s.hole === hole)
                    const strokesGiven = getStrokesGivenForMatchup(player.handicapIndex, hole, allPlayers)
                    return (
                      <td key={hole} className="p-2 text-center text-white font-medium">
                        <div className="relative">
                          {score ? (score.score !== undefined ? score.score : score.strokes) || '-' : '-'}
                          {strokesGiven > 0 && (
                            <span className="absolute -top-1 -right-1 text-xs text-[#00df82]">•</span>
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
