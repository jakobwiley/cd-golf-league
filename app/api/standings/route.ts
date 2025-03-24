import { NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'

interface Standing {
  teamId: string
  teamName: string
  matchesPlayed: number
  matchesWon: number
  matchesLost: number
  matchesTied: number
  leaguePoints: number
  weeklyPoints: {
    weekNumber: number
    points: number
    matchId: string
    opponent: string
    result: 'W' | 'L' | 'T'
  }[]
  totalHomePoints: number
  totalAwayPoints: number
  winPercentage: number
  streak: {
    type: 'W' | 'L' | 'T'
    count: number
  }
}

export async function GET() {
  try {
    console.log('Standings API: Starting request')
    
    if (!supabase) {
      console.error('Standings API: Supabase client not initialized')
      throw new Error('Supabase client not initialized')
    }

    // Get all teams first - this is less likely to fail
    console.log('Standings API: Fetching teams')
    const { data: teams, error: teamsError } = await supabase
      .from('Team')
      .select('id, name')

    if (teamsError) {
      console.error('Standings API: Supabase error fetching teams:', teamsError)
      return NextResponse.json(
        { error: 'Failed to fetch teams from database', details: teamsError },
        { status: 500 }
      )
    }

    if (!teams || teams.length === 0) {
      console.log('Standings API: No teams found')
      // Return empty array instead of error for no teams
      return NextResponse.json([])
    }

    console.log(`Standings API: Successfully fetched ${teams.length} teams`)

    // Fetch matches with correct columns
    console.log('Standings API: Fetching matches')
    const { data: matches, error: matchesError } = await supabase
      .from('Match')
      .select(`
        id,
        date,
        weekNumber,
        status,
        homeTeamId,
        awayTeamId
      `)
      .order('weekNumber', { ascending: true })

    if (matchesError) {
      console.error('Standings API: Supabase error fetching matches:', matchesError)
      
      // Initialize empty standings with the teams we have
      // This way we can at least show the teams even if we can't get match data
      const emptyStandings = teams.map(team => ({
        teamId: team.id,
        teamName: team.name,
        matchesPlayed: 0,
        matchesWon: 0,
        matchesLost: 0,
        matchesTied: 0,
        leaguePoints: 0,
        weeklyPoints: [],
        totalHomePoints: 0,
        totalAwayPoints: 0,
        winPercentage: 0,
        streak: {
          type: 'T' as 'W' | 'L' | 'T',
          count: 0
        }
      }));
      
      console.log('Standings API: Returning empty standings for all teams due to match fetch error');
      return NextResponse.json(emptyStandings);
    }

    if (!matches) {
      console.log('Standings API: No matches found')
      // Return empty standings with team names if no matches
      const emptyStandings = teams.map(team => ({
        teamId: team.id,
        teamName: team.name,
        matchesPlayed: 0,
        matchesWon: 0,
        matchesLost: 0,
        matchesTied: 0,
        leaguePoints: 0,
        weeklyPoints: [],
        totalHomePoints: 0,
        totalAwayPoints: 0,
        winPercentage: 0,
        streak: {
          type: 'T' as 'W' | 'L' | 'T',
          count: 0
        }
      }));
      
      return NextResponse.json(emptyStandings);
    }

    console.log(`Standings API: Successfully fetched ${matches.length} matches`)

    // Get match points for all completed matches
    console.log('Standings API: Fetching match points');
    const { data: matchPoints, error: matchPointsError } = await supabase
      .from('MatchPoints')
      .select(`
        id,
        matchId,
        teamId,
        hole,
        homePoints,
        awayPoints,
        points,
        createdAt
      `);

    if (matchPointsError) {
      console.error('Standings API: Error fetching match points:', matchPointsError);
      // If the table doesn't exist, continue without match points
      if (matchPointsError.code === '42P01' || matchPointsError.message.includes('does not exist')) {
        console.warn('MatchPoints table does not exist, continuing with empty match points');
        // Continue with empty match points array
        const emptyMatchPoints: any[] = [];
        return processStandings(teams, matches, emptyMatchPoints);
      }
      
      return NextResponse.json(
        { error: 'Failed to fetch match points from database', details: matchPointsError },
        { status: 500 }
      );
    }

    // Log match points for debugging
    console.log(`Standings API: Found ${matchPoints?.length || 0} total match points records`);
    
    // Filter for total points (where hole is null)
    const totalMatchPoints = matchPoints?.filter(mp => mp.hole === null) || [];
    console.log(`Standings API: Found ${totalMatchPoints.length} total match points records (hole is null)`);
    
    // Log match points for specific match ID
    const specificMatchPoints = matchPoints?.filter(mp => mp.matchId === 'd0b585dd-09e4-4171-b133-2f5376bcc59a') || [];
    console.log(`Standings API: Found ${specificMatchPoints.length} match points records for match ID d0b585dd-09e4-4171-b133-2f5376bcc59a`);
    console.log('Specific match points:', JSON.stringify(specificMatchPoints, null, 2));

    return processStandings(teams, matches, matchPoints);
  } catch (error) {
    console.error('Standings API: Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// Helper function to process standings with or without match points
function processStandings(teams: any[], matches: any[], matchPoints: any[]) {
  // Initialize standings object
  const standings: Record<string, Standing> = {};
  
  // Initialize standings for each team
  teams.forEach(team => {
    standings[team.id] = {
      teamId: team.id,
      teamName: team.name,
      matchesPlayed: 0,
      matchesWon: 0,
      matchesLost: 0,
      matchesTied: 0,
      leaguePoints: 0,
      weeklyPoints: [],
      totalHomePoints: 0,
      totalAwayPoints: 0,
      winPercentage: 0,
      streak: {
        type: 'T',
        count: 0
      }
    };
  });

  // Process completed matches
  matches.forEach(match => {
    if (match.status === 'FINALIZED' || 
        match.status === 'COMPLETED' ||
        match.status?.toLowerCase() === 'finalized' ||
        match.status?.toLowerCase() === 'completed') {
      // Get the home and away teams
      const homeTeam = standings[match.homeTeamId];
      const awayTeam = standings[match.awayTeamId];
      
      if (homeTeam && awayTeam) {
        // Increment matches played
        homeTeam.matchesPlayed++;
        awayTeam.matchesPlayed++;
        
        // Process match points for this match
        const matchPointsForThisMatch = matchPoints.filter(mp => mp.matchId === match.id && mp.hole === null);
        
        if (matchPointsForThisMatch.length > 0) {
          // Sort by createdAt to get the most recent match points
          const sortedMatchPoints = matchPointsForThisMatch.sort((a, b) => {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          });
          
          const mostRecentMatchPoints = sortedMatchPoints[0];
          console.log(`Match ${match.id}: Home Points = ${mostRecentMatchPoints.homePoints}, Away Points = ${mostRecentMatchPoints.awayPoints}`);
          
          // Update team standings with the actual match points
          homeTeam.leaguePoints += mostRecentMatchPoints.homePoints;
          homeTeam.totalHomePoints += mostRecentMatchPoints.homePoints;
          
          awayTeam.leaguePoints += mostRecentMatchPoints.awayPoints;
          awayTeam.totalAwayPoints += mostRecentMatchPoints.awayPoints;
          
          // Determine match result
          let homeResult: 'W' | 'L' | 'T' = 'T';
          let awayResult: 'W' | 'L' | 'T' = 'T';
          
          if (mostRecentMatchPoints.homePoints > mostRecentMatchPoints.awayPoints) {
            homeTeam.matchesWon += 1;
            awayTeam.matchesLost += 1;
            homeResult = 'W' as 'W';
            awayResult = 'L' as 'L';
          } else if (mostRecentMatchPoints.homePoints < mostRecentMatchPoints.awayPoints) {
            homeTeam.matchesLost += 1;
            awayTeam.matchesWon += 1;
            homeResult = 'L' as 'L';
            awayResult = 'W' as 'W';
          } else {
            homeTeam.matchesTied += 1;
            awayTeam.matchesTied += 1;
          }
          
          // Add weekly points
          homeTeam.weeklyPoints.push({
            weekNumber: match.weekNumber || 0,
            points: mostRecentMatchPoints.homePoints,
            matchId: match.id,
            opponent: awayTeam.teamName,
            result: homeResult
          });
          
          awayTeam.weeklyPoints.push({
            weekNumber: match.weekNumber || 0,
            points: mostRecentMatchPoints.awayPoints,
            matchId: match.id,
            opponent: homeTeam.teamName,
            result: awayResult
          });
        } else {
          // If no match points found, use default win/loss/tie logic
          // Find match points for this match
          const matchPointsRecords = matchPoints.filter(mp => mp.matchId === match.id);
          
          if (matchPointsRecords.length > 0) {
            // Sort by createdAt in descending order (most recent first)
            matchPointsRecords.sort((a, b) => 
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            
            // Use the most recent record
            const mostRecentRecord = matchPointsRecords[0];
            let homePoints = mostRecentRecord.homePoints || 0;
            let awayPoints = mostRecentRecord.awayPoints || 0;
            let homeResult: 'W' | 'L' | 'T' = 'T';
            let awayResult: 'W' | 'L' | 'T' = 'T';
            
            if (homePoints === 0 && awayPoints === 0) {
              // If the most recent record has 0-0 points, look for the most recent non-zero record
              const nonZeroRecords = matchPointsRecords.filter(mp => 
                (mp.homePoints > 0 || mp.awayPoints > 0)
              );
              
              if (nonZeroRecords.length > 0) {
                const mostRecentNonZeroRecord = nonZeroRecords[0];
                console.log(`Most recent record has 0-0 points. Using most recent non-zero record:`, mostRecentNonZeroRecord);
                homePoints = mostRecentNonZeroRecord.homePoints || 0;
                awayPoints = mostRecentNonZeroRecord.awayPoints || 0;
              }
            }
            
            console.log(`Match ${match.id}: Home Points = ${homePoints}, Away Points = ${awayPoints}`);
            
            // Determine match result and update team statistics
            if (homePoints > awayPoints) {
              homeTeam.matchesWon++;
              homeResult = 'W' as 'W';
              awayTeam.matchesLost++;
              awayResult = 'L' as 'L';
            } else if (homePoints < awayPoints) {
              homeTeam.matchesLost++;
              homeResult = 'L' as 'L';
              awayTeam.matchesWon++;
              awayResult = 'W' as 'W';
            } else {
              homeTeam.matchesTied++;
              homeResult = 'T' as 'T';
              awayTeam.matchesTied++;
              awayResult = 'T' as 'T';
            }
            
            // Update league points (sum of match points)
            homeTeam.leaguePoints += homePoints;
            awayTeam.leaguePoints += awayPoints;
            
            // Update total points
            homeTeam.totalHomePoints += homePoints;
            awayTeam.totalAwayPoints += awayPoints;
            
            // Update weekly points
            homeTeam.weeklyPoints.push({
              weekNumber: match.weekNumber || 0,
              points: homePoints,
              matchId: match.id,
              opponent: awayTeam.teamName,
              result: homeResult
            });
            
            awayTeam.weeklyPoints.push({
              weekNumber: match.weekNumber || 0,
              points: awayPoints,
              matchId: match.id,
              opponent: homeTeam.teamName,
              result: awayResult
            });
          }
          
          // Update streaks
          updateStreak(homeTeam, homeTeam.weeklyPoints[homeTeam.weeklyPoints.length - 1]?.result || 'T');
          updateStreak(awayTeam, awayTeam.weeklyPoints[awayTeam.weeklyPoints.length - 1]?.result || 'T');
        }
      }
    }
  });
  
  // Calculate win percentages
  Object.values(standings).forEach(team => {
    if (team.matchesPlayed > 0) {
      team.winPercentage = (team.matchesWon + (team.matchesTied * 0.5)) / team.matchesPlayed;
    }
  });
  
  // Convert standings object to array and sort by league points (descending)
  const standingsArray = Object.values(standings).sort((a, b) => {
    // Sort by league points (descending)
    if (b.leaguePoints !== a.leaguePoints) {
      return b.leaguePoints - a.leaguePoints;
    }
    
    // If league points are tied, sort by win percentage (descending)
    if (b.winPercentage !== a.winPercentage) {
      return b.winPercentage - a.winPercentage;
    }
    
    // If win percentage is tied, sort by total points (descending)
    const aTotalPoints = a.totalHomePoints + a.totalAwayPoints;
    const bTotalPoints = b.totalHomePoints + b.totalAwayPoints;
    if (bTotalPoints !== aTotalPoints) {
      return bTotalPoints - aTotalPoints;
    }
    
    // If total points are tied, sort by team name (alphabetical)
    return a.teamName.localeCompare(b.teamName);
  });
  
  console.log(`Standings API: Returning standings for ${standingsArray.length} teams`);
  return NextResponse.json(standingsArray);
}

// Helper function to update team streak
function updateStreak(team: Standing, result: 'W' | 'L' | 'T') {
  if (team.streak.type === result) {
    team.streak.count++;
  } else {
    team.streak.type = result;
    team.streak.count = 1;
  }
}