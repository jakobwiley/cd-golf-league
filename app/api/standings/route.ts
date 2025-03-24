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
    try {
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
        // If the table doesn't exist, return standings without match points
        if (matchPointsError.code === '42P01' || matchPointsError.message.includes('does not exist')) {
          console.warn('MatchPoints table does not exist, returning standings without match points');
          // Return standings without match points
          const standings: Record<string, Standing> = {}
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
            }
          });
          const standingsArray = Object.values(standings);
          console.log(`Standings API: Returning standings for ${standingsArray.length} teams`)
          return NextResponse.json(standingsArray);
        }
        
        return NextResponse.json(
          { error: 'Failed to fetch match points from database', details: matchPointsError },
          { status: 500 }
        );
      }
    } catch (error) {
      console.error('Standings API: Error fetching match points:', error);
      return NextResponse.json(
        { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
        { status: 500 }
      );
    }

    console.log(`Standings API: Found ${matchPoints?.length || 0} match points records`);

    // Group match points by matchId to handle multiple records
    const matchPointsByMatchId: Record<string, any[]> = {};
    if (matchPoints && matchPoints.length > 0) {
      // Group by matchId
      matchPoints.forEach(mp => {
        if (!matchPointsByMatchId[mp.matchId]) {
          matchPointsByMatchId[mp.matchId] = [];
        }
        matchPointsByMatchId[mp.matchId].push(mp);
      });
    }

    // Initialize standings for all teams
    const standings: Record<string, Standing> = {}
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
      }
    })

    // Calculate standings
    const completedMatches = matches.filter(match => 
      match.status?.toLowerCase() === 'completed' || 
      match.status?.toLowerCase() === 'finalized' ||
      match.status === 'COMPLETED'
    );
    console.log(`Standings API: Processing ${completedMatches.length} completed matches`)
    
    completedMatches.forEach(match => {
      const homeTeam = standings[match.homeTeamId]
      const awayTeam = standings[match.awayTeamId]

      if (homeTeam && awayTeam) {
        homeTeam.matchesPlayed++
        awayTeam.matchesPlayed++
        
        // Determine match result and update team statistics
        let homeResult: 'W' | 'L' | 'T' = 'T'; // Initialize with default value
        let awayResult: 'W' | 'L' | 'T' = 'T'; // Initialize with default value
        
        if (matchPointsByMatchId[match.id] && matchPointsByMatchId[match.id].length > 0) {
          console.log(`Looking for match points for match ID: ${match.id}`);
          
          // Sort by createdAt (newest first)
          matchPointsByMatchId[match.id].sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          
          // Get the most recent record
          const mostRecentRecord = matchPointsByMatchId[match.id][0];
          console.log(`Using most recent record:`, mostRecentRecord);
          
          // Check if the most recent record has non-zero points
          if (mostRecentRecord.homePoints > 0 || mostRecentRecord.awayPoints > 0) {
            const homePoints = mostRecentRecord.homePoints || 0;
            const awayPoints = mostRecentRecord.awayPoints || 0;
            
            console.log(`Match ${match.id}: Home Points = ${homePoints}, Away Points = ${awayPoints}`);
            
            // Determine match result and update team statistics
            if (homePoints > awayPoints) {
              homeTeam.matchesWon++;
              homeResult = 'W';
              awayTeam.matchesLost++;
              awayResult = 'L';
            } else if (homePoints < awayPoints) {
              homeTeam.matchesLost++;
              homeResult = 'L';
              awayTeam.matchesWon++;
              awayResult = 'W';
            } else {
              homeTeam.matchesTied++;
              homeResult = 'T';
              awayTeam.matchesTied++;
              awayResult = 'T';
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
          } else {
            // If the most recent record has 0-0 points, look for the most recent non-zero record
            const nonZeroRecords = matchPointsByMatchId[match.id].filter(mp => 
              (mp.homePoints > 0 || mp.awayPoints > 0)
            );
            
            if (nonZeroRecords.length > 0) {
              const mostRecentNonZeroRecord = nonZeroRecords[0];
              console.log(`Most recent record has 0-0 points. Using most recent non-zero record:`, mostRecentNonZeroRecord);
              const homePoints = mostRecentNonZeroRecord.homePoints || 0;
              const awayPoints = mostRecentNonZeroRecord.awayPoints || 0;
              
              console.log(`Match ${match.id}: Home Points = ${homePoints}, Away Points = ${awayPoints}`);
              
              // Determine match result and update team statistics
              if (homePoints > awayPoints) {
                homeTeam.matchesWon++;
                homeResult = 'W';
                awayTeam.matchesLost++;
                awayResult = 'L';
              } else if (homePoints < awayPoints) {
                homeTeam.matchesLost++;
                homeResult = 'L';
                awayTeam.matchesWon++;
                awayResult = 'W';
              } else {
                homeTeam.matchesTied++;
                homeResult = 'T';
                awayTeam.matchesTied++;
                awayResult = 'T';
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
          }
        }
        
        // Update streak
        updateStreak(homeTeam, homeResult);
        updateStreak(awayTeam, awayResult);
      }
    })

    // Calculate win percentages and sort weekly points
    Object.values(standings).forEach(team => {
      if (team.matchesPlayed > 0) {
        team.winPercentage = (team.matchesWon / team.matchesPlayed) * 100;
      }
      
      // Sort weekly points by week number
      team.weeklyPoints.sort((a, b) => a.weekNumber - b.weekNumber);
    });

    // Convert standings object to array and sort by leaguePoints
    const standingsArray = Object.values(standings).sort((a, b) => {
      if (b.leaguePoints !== a.leaguePoints) {
        return b.leaguePoints - a.leaguePoints;
      }
      // If leaguePoints are equal, sort by matches won
      if (b.matchesWon !== a.matchesWon) {
        return b.matchesWon - a.matchesWon;
      }
      // If matches won are equal, sort by win percentage
      if (b.winPercentage !== a.winPercentage) {
        return b.winPercentage - a.winPercentage;
      }
      // If win percentage is equal, sort by matches played (fewer is better)
      return a.matchesPlayed - b.matchesPlayed;
    });

    console.log(`Standings API: Returning standings for ${standingsArray.length} teams`)
    return NextResponse.json(standingsArray);
  } catch (error) {
    console.error('Standings API: Error calculating standings:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
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