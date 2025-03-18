import { NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'

// Helper function to add CORS headers
function corsResponse(data: any, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

// Handle CORS preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

export async function GET() {
  try {
    const { data, error } = await supabase
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
      .order('name', { ascending: true })

    if (error) {
      throw error
    }

    return corsResponse(data)
  } catch (error) {
    console.error('Error fetching teams:', error)
    return corsResponse({ error: 'Failed to fetch teams' }, 500)
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.name) {
      return corsResponse({ error: 'Team name is required' }, 400)
    }

    // Create team
    const { data, error } = await supabase
      .from('Team')
      .insert([{
        name: body.name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }])
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

    return corsResponse(data, 201)
  } catch (error) {
    console.error('Error creating team:', error)
    return corsResponse({ error: 'Failed to create team' }, 500)
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json()
    const { id, name, players } = data

    // Validate required fields
    if (!id || !name) {
      return corsResponse({ error: 'Team ID and name are required' }, 400)
    }

    // Update team
    const { data: team, error } = await supabase
      .from('Team')
      .update([{
        id,
        name,
        updatedAt: new Date().toISOString()
      }])
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

    // Update players
    if (players) {
      await supabase
        .from('Player')
        .delete()
        .eq('teamId', id)

      await supabase
        .from('Player')
        .insert(players.map(player => ({
          ...player,
          teamId: id
        })))
    }

    return corsResponse(team)
  } catch (error) {
    console.error('Error updating team:', error)
    return corsResponse({ error: 'Failed to update team' }, 500)
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return corsResponse({ error: 'Team ID is required' }, 400)
    }
    await supabase
      .from('Team')
      .delete()
      .eq('id', id)
    return corsResponse({ message: 'Team deleted successfully' })
  } catch (error) {
    console.error('Error deleting team:', error)
    return corsResponse({ error: 'Failed to delete team' }, 500)
  }
}