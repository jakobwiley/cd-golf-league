import { NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'

interface Match {
  id: string
  date: string
  weekNumber: number
  startingHole: number
  status: string
  homeTeamId: string
  awayTeamId: string
  homeTeam: {
    id: string
    name: string
  }
  awayTeam: {
    id: string
    name: string
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('Match')
      .select(`
        id,
        date,
        weekNumber,
        startingHole,
        status,
        homeTeamId,
        awayTeamId,
        homeTeam:homeTeamId (
          id,
          name
        ),
        awayTeam:awayTeamId (
          id,
          name
        )
      `)
      .order('weekNumber', { ascending: true })

    if (error) {
      throw error
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching matches:', error)
    return NextResponse.json(
      { error: 'Failed to fetch matches' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.homeTeamId || !body.awayTeamId || !body.weekNumber || !body.startingHole) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if teams exist
    const { data: teams, error: teamsError } = await supabase
      .from('Team')
      .select('id')
      .in('id', [body.homeTeamId, body.awayTeamId])

    if (teamsError) {
      throw teamsError
    }

    if (!teams || teams.length !== 2) {
      return NextResponse.json(
        { error: 'One or both teams not found' },
        { status: 404 }
      )
    }

    // Create match
    const { data, error } = await supabase
      .from('Match')
      .insert([{
        date: body.date || new Date().toISOString(),
        weekNumber: body.weekNumber,
        startingHole: body.startingHole,
        homeTeamId: body.homeTeamId,
        awayTeamId: body.awayTeamId,
        status: 'SCHEDULED',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }])
      .select(`
        id,
        date,
        weekNumber,
        startingHole,
        status,
        homeTeamId,
        awayTeamId,
        homeTeam:homeTeamId (
          id,
          name
        ),
        awayTeam:awayTeamId (
          id,
          name
        )
      `)
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error creating match:', error)
    return NextResponse.json(
      { error: 'Failed to create match' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.id) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if match exists
    const { data: match, error: matchError } = await supabase
      .from('Match')
      .select('id')
      .eq('id', body.id)

    if (matchError) {
      throw matchError
    }

    if (!match || match.length === 0) {
      return NextResponse.json(
        { error: 'Match not found' },
        { status: 404 }
      )
    }

    // If teams are being updated, check if they exist
    if (body.homeTeamId || body.awayTeamId) {
      const { data: teams, error: teamsError } = await supabase
        .from('Team')
        .select('id')
        .in('id', [body.homeTeamId, body.awayTeamId])

      if (teamsError) {
        throw teamsError
      }

      if (!teams || teams.length !== 2) {
        return NextResponse.json(
          { error: 'One or both teams not found' },
          { status: 404 }
        )
      }
    }

    // Update match
    const { data, error } = await supabase
      .from('Match')
      .update([{
        id: body.id,
        date: body.date,
        weekNumber: body.weekNumber,
        startingHole: body.startingHole,
        homeTeamId: body.homeTeamId,
        awayTeamId: body.awayTeamId,
        status: body.status,
        updatedAt: new Date().toISOString()
      }])
      .select(`
        id,
        date,
        weekNumber,
        startingHole,
        status,
        homeTeamId,
        awayTeamId,
        homeTeam:homeTeamId (
          id,
          name
        ),
        awayTeam:awayTeamId (
          id,
          name
        )
      `)
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error updating match:', error)
    return NextResponse.json(
      { error: 'Failed to update match' },
      { status: 500 }
    )
  }
}