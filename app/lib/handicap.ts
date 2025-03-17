import { Player } from '@prisma/client';

// Hole handicaps (difficulty rating) for Country Drive Golf Course
export const holeHandicaps = {
  1: 1,  // hardest hole
  2: 9,  // easiest hole
  3: 3,  // 3rd hardest hole
  4: 7,  // 7th hardest hole
  5: 4,  // 4th hardest hole
  6: 6,  // 6th hardest hole
  7: 8,  // 8th hardest hole
  8: 2,  // 2nd hardest hole
  9: 5   // 5th hardest hole
}

// Country Drive Golf Course (Ashland, NE) - Official 9-hole Ratings
const COURSE_RATING = 71.2;
const SLOPE_RATING = 125;
const PAR = 36             // 9-hole par

// Calculate course handicap for a player
export function calculateCourseHandicap(handicapIndex: number): number {
  return Math.round(handicapIndex * (SLOPE_RATING / 113));
}

export function calculateStrokesReceived(playerHandicap: number, opponentHandicap: number) {
  // Calculate difference in handicaps
  const handicapDiff = playerHandicap - opponentHandicap
  
  // In match play, the better player gives strokes to the higher handicap player
  // The number of strokes given is 100% of the difference in handicaps
  return Math.round(Math.max(0, handicapDiff))
}

// Get strokes given for a player on a specific hole
export function getStrokesGivenForMatchup(handicapIndex: number, hole: number, allPlayers: Player[]): number {
  const courseHandicap = calculateCourseHandicap(handicapIndex);
  
  // Find the lowest handicap in the match
  const lowestHandicap = Math.min(...allPlayers.map(p => calculateCourseHandicap(p.handicapIndex)));
  
  // Calculate strokes given (difference between player's handicap and lowest handicap)
  const strokesGiven = courseHandicap - lowestHandicap;
  
  // Hole handicaps (1-9, where 1 is the hardest hole and 9 is the easiest)
  const holeHandicaps = {
    1: 4, // 4th hardest hole
    2: 7, // 7th hardest hole
    3: 2, // 2nd hardest hole
    4: 5, // 5th hardest hole
    5: 1, // Hardest hole
    6: 9, // Easiest hole
    7: 3, // 3rd hardest hole
    8: 6, // 6th hardest hole
    9: 8  // 8th hardest hole
  };
  
  // If player gets strokes on this hole
  if (strokesGiven > 0 && holeHandicaps[hole as keyof typeof holeHandicaps] <= strokesGiven) {
    return 1;
  }
  
  return 0;
}

export function getStrokesOnHole(playerHandicap: number, opponentHandicap: number, holeNumber: number) {
  const strokesReceived = calculateStrokesReceived(playerHandicap, opponentHandicap)
  const holeHandicap = holeHandicaps[holeNumber as keyof typeof holeHandicaps]
  
  // Player gets a stroke on this hole if the hole's handicap rating is less than or equal to
  // the number of strokes they receive
  return strokesReceived >= holeHandicap ? 1 : 0
}

export function calculateNetScore(grossScore: number, playerHandicap: number, opponentHandicap: number, holeNumber: number) {
  const strokes = getStrokesOnHole(playerHandicap, opponentHandicap, holeNumber)
  return grossScore - strokes
}

// Validate handicap index format and range
export function validateHandicapIndex(handicapIndex: string): boolean {
  const numericValue = parseFloat(handicapIndex)
  return !isNaN(numericValue) && numericValue >= -10 && numericValue <= 54
} 