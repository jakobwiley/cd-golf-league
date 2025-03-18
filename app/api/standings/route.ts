import { NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'

export async function GET() {
  try {
    // First, get all teams
    const { data: teams, error: teamsError } = await supabase
      .from('Team')
      .select('id, name')

    if (teamsError) throw teamsError

    // Get all matches and their points
    const { data: matches, error: matchesError } = await supabase
      .from('Match')
      .select(`
        id,
        weekNumber,
        homeTeamId,
        awayTeamId,
        MatchPoints (
          teamId,
          points
        )
      `)
      .eq('status', 'COMPLETED')

    if (matchesError) throw matchesError

    // Calculate standings for each team
    const standings = teams.map(team => {
      const teamMatches = matches.filter(match => 
        match.homeTeamId === team.id || match.awayTeamId === team.id
      )

      // Group points by week
      const weeklyPoints = {}
      teamMatches.forEach(match => {
        const points = match.MatchPoints?.find(p => p.teamId === team.id)?.points || 0
        if (!weeklyPoints[match.weekNumber]) {
          weeklyPoints[match.weekNumber] = 0
        }
        weeklyPoints[match.weekNumber] += points
      })

      // Convert weekly points to array format
      const weeklyPointsArray = Object.entries(weeklyPoints).map(([week, points]) => ({
        weekNumber: parseInt(week),
        points: Number(points)
      }))

      // Calculate total points
      const totalPoints = weeklyPointsArray.reduce((sum, week) => sum + week.points, 0)

      return {
        id: team.id,
        name: team.name,
        totalPoints,
        matchesPlayed: teamMatches.length,
        weeklyPoints: weeklyPointsArray
      }
    })

    // Sort by total points (descending)
    standings.sort((a, b) => b.totalPoints - a.totalPoints)

    return NextResponse.json(standings)
  } catch (error) {
    console.error('Error calculating standings:', error)
    return NextResponse.json(
      { error: 'Failed to calculate standings' },
      { status: 500 }
    )
  }
}