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
    
    // Log team details for debugging
    teams.forEach(team => {
      console.log(`Team: ${team.name}, ID: ${team.id}`)
    })

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
    
    // Log match details for debugging
    matches.forEach(match => {
      console.log(`Match ID: ${match.id}, Status: ${match.status}, Home Team: ${match.homeTeamId}, Away Team: ${match.awayTeamId}`)
    })
    
    // Check specifically for the Brew/Jake vs Clauss/Wade match
    const brewJakeMatch = matches.find((match: any) => match.id === 'd0b585dd-09e4-4171-b133-2f5376bcc59a')
    if (brewJakeMatch) {
      console.log('Standings API: Found Brew/Jake vs Clauss/Wade match:')
      console.log(`- ID: ${brewJakeMatch.id}`)
      console.log(`- Status: ${brewJakeMatch.status}`)
      console.log(`- Home Team ID: ${brewJakeMatch.homeTeamId}`)
      console.log(`- Away Team ID: ${brewJakeMatch.awayTeamId}`)
    } else {
      console.log('Standings API: Brew/Jake vs Clauss/Wade match not found')
    }

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
        return NextResponse.json(processStandings(teams, matches, emptyMatchPoints));
      }
      
      return NextResponse.json(
        { error: 'Failed to fetch match points from database', details: matchPointsError },
        { status: 500 }
      );
    }

    // Log match points for debugging
    console.log(`Standings API: Found ${matchPoints?.length || 0} total match points records`);
    
    // Filter for total points (where hole is null)
    const totalMatchPoints = matchPoints?.filter((mp: any) => mp.hole === null) || [];
    console.log(`Standings API: Found ${totalMatchPoints.length} total match points records (hole is null)`);
    
    // Log all total match points for debugging
    totalMatchPoints.forEach((mp: any) => {
      console.log(`Total Match Points - ID: ${mp.id}, Match ID: ${mp.matchId}, Home: ${mp.homePoints}, Away: ${mp.awayPoints}`)
    })
    
    // Log match points for specific match ID
    const specificMatchPoints = matchPoints?.filter((mp: any) => mp.matchId === 'd0b585dd-09e4-4171-b133-2f5376bcc59a') || [];
    console.log(`Standings API: Found ${specificMatchPoints.length} match points records for match ID d0b585dd-09e4-4171-b133-2f5376bcc59a`);
    
    if (specificMatchPoints.length > 0) {
      console.log('Specific match points:');
      specificMatchPoints.forEach((mp: any) => {
        console.log(`- ID: ${mp.id}, Hole: ${mp.hole === null ? 'NULL' : mp.hole}, Home: ${mp.homePoints}, Away: ${mp.awayPoints}`)
      });
    } else {
      console.log('No match points found for Brew/Jake vs Clauss/Wade match');
    }

    // Process the standings
    const standingsArray = processStandings(teams, matches, matchPoints);
    
    // Find teams in the standings array
    const brewJakeTeam = standingsArray.find((team: any) => team.teamName === 'Brew/Jake');
    const claussWadeTeam = standingsArray.find((team: any) => team.teamName === 'Clauss/Wade');
    
    if (brewJakeTeam) {
      console.log('Standings API: Final Brew/Jake team standings:');
      console.log(`- Matches played: ${brewJakeTeam.matchesPlayed}`);
      console.log(`- Matches won: ${brewJakeTeam.matchesWon}`);
      console.log(`- Matches lost: ${brewJakeTeam.matchesLost}`);
      console.log(`- League points: ${brewJakeTeam.leaguePoints}`);
    }
    
    if (claussWadeTeam) {
      console.log('Standings API: Final Clauss/Wade team standings:');
      console.log(`- Matches played: ${claussWadeTeam.matchesPlayed}`);
      console.log(`- Matches won: ${claussWadeTeam.matchesWon}`);
      console.log(`- Matches lost: ${claussWadeTeam.matchesLost}`);
      console.log(`- League points: ${claussWadeTeam.leaguePoints}`);
    }
    
    return NextResponse.json(standingsArray);
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
        const matchPointsForThisMatch = matchPoints.filter((mp: any) => mp.matchId === match.id && mp.hole === null);
        
        // Special logging for Brew/Jake vs Clauss/Wade match
        if (match.id === 'd0b585dd-09e4-4171-b133-2f5376bcc59a') {
          console.log(`Processing standings for Brew/Jake vs Clauss/Wade match (ID: ${match.id})`);
          console.log(`Found ${matchPointsForThisMatch.length} total match points records for this match`);
          
          if (matchPointsForThisMatch.length > 0) {
            matchPointsForThisMatch.forEach((mp: any) => {
              console.log(`- Match Points ID: ${mp.id}, Home: ${mp.homePoints}, Away: ${mp.awayPoints}, Hole: ${mp.hole === null ? 'NULL' : mp.hole}`);
            });
          }
        }
        
        if (matchPointsForThisMatch.length > 0) {
          // Sort by createdAt to get the most recent match points
          const sortedMatchPoints = matchPointsForThisMatch.sort((a: any, b: any) => {
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
          
          // Special logging for Brew/Jake vs Clauss/Wade match
          if (match.id === 'd0b585dd-09e4-4171-b133-2f5376bcc59a') {
            console.log('After processing Brew/Jake vs Clauss/Wade match:');
            console.log(`- Home team (${homeTeam.teamName}): Matches won = ${homeTeam.matchesWon}, League points = ${homeTeam.leaguePoints}`);
            console.log(`- Away team (${awayTeam.teamName}): Matches won = ${awayTeam.matchesWon}, League points = ${awayTeam.leaguePoints}`);
          }
        } else {
          // If no match points found, use default win/loss/tie logic
          // Find match points for this match
          const matchPointsRecords = matchPoints.filter((mp: any) => mp.matchId === match.id);
          
          // Special logging for Brew/Jake vs Clauss/Wade match
          if (match.id === 'd0b585dd-09e4-4171-b133-2f5376bcc59a') {
            console.log(`No total match points found for Brew/Jake vs Clauss/Wade match, found ${matchPointsRecords.length} individual hole records`);
            
            if (matchPointsRecords.length > 0) {
              matchPointsRecords.forEach((mp: any) => {
                console.log(`- Match Points ID: ${mp.id}, Home: ${mp.homePoints}, Away: ${mp.awayPoints}, Hole: ${mp.hole === null ? 'NULL' : mp.hole}`);
              });
            }
          }
          
          if (matchPointsRecords.length > 0) {
            // Sort by createdAt in descending order (most recent first)
            matchPointsRecords.sort((a: any, b: any) => 
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
              const nonZeroRecords = matchPointsRecords.filter((mp: any) => 
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
            
            // Special logging for Brew/Jake vs Clauss/Wade match
            if (match.id === 'd0b585dd-09e4-4171-b133-2f5376bcc59a') {
              console.log('After processing Brew/Jake vs Clauss/Wade match (using individual hole records):');
              console.log(`- Home team (${homeTeam.teamName}): Matches won = ${homeTeam.matchesWon}, League points = ${homeTeam.leaguePoints}`);
              console.log(`- Away team (${awayTeam.teamName}): Matches won = ${awayTeam.matchesWon}, League points = ${awayTeam.leaguePoints}`);
            }
          } else {
            // If no match points found at all, mark as a tie with 0 points
            console.log(`No match points found for match ${match.id}, marking as a tie with 0 points`);
            
            // Update weekly points with 0 points
            homeTeam.weeklyPoints.push({
              weekNumber: match.weekNumber || 0,
              points: 0,
              matchId: match.id,
              opponent: awayTeam.teamName,
              result: 'T'
            });
            
            awayTeam.weeklyPoints.push({
              weekNumber: match.weekNumber || 0,
              points: 0,
              matchId: match.id,
              opponent: homeTeam.teamName,
              result: 'T'
            });
            
            // Update ties
            homeTeam.matchesTied++;
            awayTeam.matchesTied++;
          }
        }
        
        // Update streak for both teams
        updateStreak(homeTeam, homeTeam.weeklyPoints[homeTeam.weeklyPoints.length - 1].result);
        updateStreak(awayTeam, awayTeam.weeklyPoints[awayTeam.weeklyPoints.length - 1].result);
      }
    }
  });

  // Calculate win percentage for each team
  Object.values(standings).forEach(team => {
    if (team.matchesPlayed > 0) {
      team.winPercentage = team.matchesWon / team.matchesPlayed;
    }
  });

  // Convert standings object to array and sort by league points (descending)
  const standingsArray = Object.values(standings).sort((a: any, b: any) => {
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
    
    // If still tied, sort alphabetically by team name
    return a.teamName.localeCompare(b.teamName);
  });

  return standingsArray;
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