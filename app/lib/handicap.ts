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
const COURSE_RATING = 34.0;  // 9-hole course rating
const SLOPE_RATING = 107;    // 9-hole slope rating
const PAR = 36;             // 9-hole par

// Calculate course handicap for a player using USGA 9-hole formula
export function calculateCourseHandicap(handicapIndex: number): number {
  if (typeof handicapIndex !== 'number' || isNaN(handicapIndex)) {
    return 0;
  }
  
  // First, take half of the 18-hole Handicap Index and round to one decimal
  const halfHandicapIndex = Math.round((handicapIndex / 2) * 10) / 10;
  
  // Calculate 9-hole Course Handicap using the USGA formula:
  // (Handicap Index / 2) × (9-hole Slope Rating / 113) + (9-hole Course Rating - 9-hole Par)
  const nineHoleCH = halfHandicapIndex * (SLOPE_RATING / 113) + (COURSE_RATING - PAR);
  
  // Round to nearest whole number per USGA recommendation
  return Math.round(nineHoleCH);
}

export function calculateStrokesReceived(playerHandicap: number, opponentHandicap: number) {
  // Calculate difference in handicaps
  const handicapDiff = playerHandicap - opponentHandicap
  
  // In match play, the better player gives strokes to the higher handicap player
  // The number of strokes given is 100% of the difference in handicaps
  return Math.round(Math.max(0, handicapDiff))
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