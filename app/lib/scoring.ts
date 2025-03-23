import { Match } from '../types';
import { calculateCourseHandicap, holeHandicaps } from './handicap';

// Get strokes given for a matchup
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

// Get player net score for a specific hole
const getPlayerNetScore = (player: any, hole: number, allPlayers: any[], scores: any[]) => {
  const score = scores?.find(s => s.playerId === player.id && s.hole === hole);
  if (!score || (score.score === undefined && score.strokes === undefined)) return null;
  
  const scoreValue = score.score !== undefined ? score.score : score.strokes;
  if (scoreValue === null) return null;
  
  const strokesGiven = getStrokesGivenForMatchup(player.handicapIndex, hole, allPlayers);
  return (scoreValue || 0) - strokesGiven;
}

// Calculate hole points for a match
export const calculateHolePoints = (match: Match) => {
  const holes = Array.from({ length: 9 }, (_, i) => i + 1);
  const homeTeamPlayers = match.homeTeam?.players || [];
  const awayTeamPlayers = match.awayTeam?.players || [];
  const allPlayers = [...homeTeamPlayers, ...awayTeamPlayers];
  const scores = match.scores || [];

  const holePoints: { [hole: number]: { home: number, away: number } } = {};
  let totalHomePoints = 0;
  let totalAwayPoints = 0;
  
  holes.forEach(hole => {
    // Get net scores for home team players
    const homeNetScores = homeTeamPlayers
      .map(player => {
        const netScore = getPlayerNetScore(player, hole, allPlayers, scores);
        return netScore !== null ? { playerId: player.id, netScore } : null;
      })
      .filter(score => score !== null) as { playerId: string, netScore: number }[];
    
    // Get net scores for away team players
    const awayNetScores = awayTeamPlayers
      .map(player => {
        const netScore = getPlayerNetScore(player, hole, allPlayers, scores);
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
