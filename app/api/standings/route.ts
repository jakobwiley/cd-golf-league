import { NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'

interface Standing {
  teamId: string
  teamName: string
  matchesPlayed: number
  matchesWon: number
  matchesLost: number
  matchesTied: number
  points: number
}

export async function GET() {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    // Get all matches
    const { data: matches, error: matchesError } = await supabase
      .from('Match')
      .select(`
        id,
        status,
        homeTeamId,
        awayTeamId,
        homeTeamScore,
        awayTeamScore,
        homeTeam:homeTeamId (
          id,
          name
        ),
        awayTeam:awayTeamId (
          id,
          name
        )
      `)
      .eq('status', 'completed')

    if (matchesError) {
      console.error('Supabase error:', matchesError)
      return NextResponse.json(
        { error: 'Failed to fetch matches from database' },
        { status: 500 }
      )
    }

    if (!matches) {
      return NextResponse.json(
        { error: 'No matches found' },
        { status: 404 }
      )
    }

    // Get all teams
    const { data: teams, error: teamsError } = await supabase
      .from('Team')
      .select('id, name')

    if (teamsError) {
      console.error('Supabase error:', teamsError)
      return NextResponse.json(
        { error: 'Failed to fetch teams from database' },
        { status: 500 }
      )
    }

    if (!teams) {
      return NextResponse.json(
        { error: 'No teams found' },
        { status: 404 }
      )
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
        points: 0
      }
    })

    // Calculate standings
    matches.forEach(match => {
      const homeTeam = standings[match.homeTeamId]
      const awayTeam = standings[match.awayTeamId]

      if (homeTeam && awayTeam) {
        homeTeam.matchesPlayed++
        awayTeam.matchesPlayed++

        if (match.homeTeamScore > match.awayTeamScore) {
          homeTeam.matchesWon++
          homeTeam.points += 2
          awayTeam.matchesLost++
        } else if (match.homeTeamScore < match.awayTeamScore) {
          awayTeam.matchesWon++
          awayTeam.points += 2
          homeTeam.matchesLost++
        } else {
          homeTeam.matchesTied++
          homeTeam.points += 1
          awayTeam.matchesTied++
          awayTeam.points += 1
        }
      }
    })

    // Convert standings object to array and sort by points
    const standingsArray = Object.values(standings).sort((a, b) => {
      if (b.points !== a.points) {
        return b.points - a.points
      }
      // If points are equal, sort by matches won
      if (b.matchesWon !== a.matchesWon) {
        return b.matchesWon - a.matchesWon
      }
      // If matches won are equal, sort by matches played (fewer is better)
      return a.matchesPlayed - b.matchesPlayed
    })

    return NextResponse.json(standingsArray)
  } catch (error) {
    console.error('Error calculating standings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}