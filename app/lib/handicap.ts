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

// Country Drive Golf Course (Ashland, NE) - Blue Tees
const COURSE_RATING = 70.9
const SLOPE_RATING = 125
const PAR = 72

export function calculateCourseHandicap(handicapIndex: number): number {
  // Course Handicap = Handicap Index × (Slope Rating ÷ 113) + (Course Rating - Par)
  return Math.round(
    handicapIndex * (SLOPE_RATING / 113) + (COURSE_RATING - PAR)
  )
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