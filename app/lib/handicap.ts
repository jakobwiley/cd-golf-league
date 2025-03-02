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

// Country Drive Golf Course (Ashland, NE) - Official Ratings
const COURSE_RATING = 68.0  // Official course rating
const SLOPE_RATING = 107    // Official slope rating
const PAR = 72             // Total par for 18 holes

export function calculateCourseHandicap(handicapIndex: number): number {
  // 1. Calculate 18-hole Course Handicap: (Handicap Index × Slope Rating ÷ 113) + (Course Rating - Par)
  const eighteenHoleCH = handicapIndex * (SLOPE_RATING / 113) + (COURSE_RATING - PAR)
  
  // 2. For 9-holes, take half and round to nearest whole number
  return Math.round(eighteenHoleCH / 2)
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