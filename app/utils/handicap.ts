import { Player } from '../types'

export function calculateCourseHandicap(handicapIndex: number): number {
  // Round to nearest whole number
  return Math.round(handicapIndex)
}

export function getStrokesGivenForMatchup(playerHandicap: number, hole: number, allPlayers: Player[]): number {
  // Get the lowest handicap in the match
  const lowestHandicap = Math.min(...allPlayers.map(p => p.handicapIndex))
  
  // Calculate strokes given based on difference from lowest handicap
  const handicapDiff = calculateCourseHandicap(playerHandicap) - calculateCourseHandicap(lowestHandicap)
  
  // If player has the lowest handicap, they don't get any strokes
  if (handicapDiff <= 0) return 0
  
  // Determine if this hole gets a stroke based on handicap difference
  // For 9 holes, we double the handicap difference to distribute strokes
  const adjustedHandicapDiff = handicapDiff * 2
  
  // Holes are typically handicapped 1-18, but for 9 holes we need to adjust
  // Odd numbered holes are typically harder and get strokes first
  const holeHandicaps = {
    1: 7,  // Adjusted from 7 for 9-hole play
    2: 3,  // Adjusted from 3 for 9-hole play
    3: 1,  // Adjusted from 1 for 9-hole play
    4: 9,  // Adjusted from 9 for 9-hole play
    5: 5,  // Adjusted from 5 for 9-hole play
    6: 2,  // Adjusted from 2 for 9-hole play
    7: 8,  // Adjusted from 8 for 9-hole play
    8: 4,  // Adjusted from 4 for 9-hole play
    9: 6   // Adjusted from 6 for 9-hole play
  }
  
  // Get the handicap rating for this hole
  const holeHandicap = holeHandicaps[hole as keyof typeof holeHandicaps]
  
  // Player gets a stroke on this hole if their adjusted handicap difference
  // is greater than or equal to the hole's handicap rating
  return adjustedHandicapDiff >= holeHandicap ? 1 : 0
}
