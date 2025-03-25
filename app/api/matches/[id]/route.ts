import { supabase } from '../../../../lib/supabase'
import { z } from 'zod'
import { NextResponse } from 'next/server'

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

const matchUpdateSchema = z.object({
  date: z.string().optional(),
  weekNumber: z.number().optional(),
  startingHole: z.number().optional(),
  homeTeamId: z.string().optional(),
  awayTeamId: z.string().optional(),
  status: z.enum(['scheduled', 'in_progress', 'completed', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED'])
    .transform(value => value.toLowerCase())
    .optional(),
  homePoints: z.number().optional(),
  awayPoints: z.number().optional()
})

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
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
      .eq('id', params.id)
      .single()

    if (error) {
      throw error
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Match not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching match:', error)
    return NextResponse.json(
      { error: 'Failed to fetch match' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const validatedData = matchUpdateSchema.parse(body)

    // Check if match exists
    const { data: existingMatch, error: existingMatchError } = await supabase
      .from('Match')
      .select('id, homeTeamId, awayTeamId')
      .eq('id', params.id)
      .single()

    if (existingMatchError) {
      throw existingMatchError
    }

    if (!existingMatch) {
      return NextResponse.json(
        { error: 'Match not found' },
        { status: 404 }
      )
    }

    // If teams are being updated, check if they exist
    if (validatedData.homeTeamId || validatedData.awayTeamId) {
      const homeTeamId = validatedData.homeTeamId || existingMatch.homeTeamId
      const awayTeamId = validatedData.awayTeamId || existingMatch.awayTeamId

      // Check if teams exist
      const { data: teams, error: teamsError } = await supabase
        .from('Team')
        .select('id')
        .in('id', [homeTeamId, awayTeamId])

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

    const { data, error } = await supabase
      .from('Match')
      .update({
        ...(validatedData.date && { date: validatedData.date }),
        ...(validatedData.weekNumber && { weekNumber: validatedData.weekNumber }),
        ...(validatedData.homeTeamId && { homeTeamId: validatedData.homeTeamId }),
        ...(validatedData.awayTeamId && { awayTeamId: validatedData.awayTeamId }),
        ...(validatedData.startingHole && { startingHole: validatedData.startingHole }),
        ...(validatedData.status && { status: validatedData.status }),
        ...(validatedData.homePoints !== undefined && { homePoints: validatedData.homePoints }),
        ...(validatedData.awayPoints !== undefined && { awayPoints: validatedData.awayPoints }),
        updatedAt: new Date().toISOString()
      })
      .eq('id', params.id)
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
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating match:', error)
    return NextResponse.json(
      { error: 'Failed to update match' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check if match exists
    const { data: match, error: matchError } = await supabase
      .from('Match')
      .select('id, status')
      .eq('id', params.id)
      .single()

    if (matchError) {
      throw matchError
    }

    if (!match) {
      return NextResponse.json(
        { error: 'Match not found' },
        { status: 404 }
      )
    }

    // Don't allow deletion of matches that are in progress or completed
    if (match.status !== 'SCHEDULED') {
      return NextResponse.json(
        { error: 'Cannot delete a match that is in progress or completed' },
        { status: 400 }
      )
    }

    // Delete match
    const { error: deleteError } = await supabase
      .from('Match')
      .delete()
      .eq('id', params.id)

    if (deleteError) {
      throw deleteError
    }

    return NextResponse.json({ message: 'Match deleted successfully' })
  } catch (error) {
    console.error('Error deleting match:', error)
    return NextResponse.json(
      { error: 'Failed to delete match' },
      { status: 500 }
    )
  }
}