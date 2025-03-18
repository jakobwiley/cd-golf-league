import { NextResponse } from 'next/server'
import { supabase } from '../../../../lib/supabase'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Get team with players
    const { data: team, error: teamError } = await supabase
      .from('Team')
      .select(`
        id,
        name,
        Player (
          id,
          name,
          handicapIndex,
          playerType
        )
      `)
      .eq('id', params.id)
      .single()

    if (teamError) {
      throw teamError
    }

    if (!team) {
      return NextResponse.json(
        { error: 'Team not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(team)
  } catch (error) {
    console.error('Error fetching team:', error)
    return NextResponse.json(
      { error: 'Failed to fetch team' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    // Check if team exists
    const { data: existingTeam, error: existingTeamError } = await supabase
      .from('Team')
      .select('id')
      .eq('id', params.id)
      .single()

    if (existingTeamError) {
      throw existingTeamError
    }

    if (!existingTeam) {
      return NextResponse.json(
        { error: 'Team not found' },
        { status: 404 }
      )
    }

    // Update team
    const { data, error } = await supabase
      .from('Team')
      .update({
        ...body,
        updatedAt: new Date().toISOString()
      })
      .eq('id', params.id)
      .select(`
        id,
        name,
        Player (
          id,
          name,
          handicapIndex,
          playerType
        )
      `)
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error updating team:', error)
    return NextResponse.json(
      { error: 'Failed to update team' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check if team exists
    const { data: team, error: teamError } = await supabase
      .from('Team')
      .select('id')
      .eq('id', params.id)
      .single()

    if (teamError) {
      throw teamError
    }

    if (!team) {
      return NextResponse.json(
        { error: 'Team not found' },
        { status: 404 }
      )
    }

    // Delete players if they exist
    const { error: playersError } = await supabase
      .from('Player')
      .delete()
      .eq('teamId', params.id)

    if (playersError) {
      throw playersError
    }

    // Delete team
    const { error } = await supabase
      .from('Team')
      .delete()
      .eq('id', params.id)

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting team:', error)
    return NextResponse.json(
      { error: 'Failed to delete team' },
      { status: 500 }
    )
  }
}