/**
 * Calculate course handicap based on handicap index
 * For 9 holes at Country Drive, we use the official USGA formula for 9-hole course handicap:
 * (Handicap Index / 2) × (9-hole Slope Rating / 113) + (9-hole Course Rating - 9-hole Par)
 * 
 * Per USGA: "If determining a 9-hole Course Handicap, take one half of the 18-hole Handicap Index 
 * (rounded to one decimal). Then use the 9-hole Course Rating, 9-hole Slope Rating and 9-hole Par"
 */
export function calculateCourseHandicap(handicapIndex: number): number {
  // 9-hole course rating and slope for Country Drive
  const COURSE_RATING = 34.0;  // 9-hole course rating
  const SLOPE_RATING = 107;    // 9-hole slope rating
  const PAR = 36;              // 9-hole par
  
  // First, take half of the 18-hole Handicap Index and round to one decimal
  const halfHandicapIndex = Math.round((handicapIndex / 2) * 10) / 10;
  
  // Calculate 9-hole Course Handicap using the correct formula
  const nineHoleCH = halfHandicapIndex * (SLOPE_RATING / 113) + (COURSE_RATING - PAR);
  
  // Round to nearest whole number
  return Math.round(nineHoleCH);
} 