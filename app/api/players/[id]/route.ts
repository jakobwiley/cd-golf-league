import { NextResponse } from 'next/server'
import { supabase } from '../../../../lib/supabase'

// Helper function to handle errors
function handleError(error: any, message: string) {
  console.error(`${message}:`, error);
  return NextResponse.json(
    { 
      error: message, 
      details: String(error),
      stack: error.stack
    },
    { 
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    }
  );
}

// Handle OPTIONS requests for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabase
      .from('Player')
      .select(`
        id,
        name,
        handicapIndex,
        teamId,
        playerType,
        Team (
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
        { error: 'Player not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching player:', error)
    return NextResponse.json(
      { error: 'Failed to fetch player' },
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

    // Check if player exists
    const { data: existingPlayer, error: existingPlayerError } = await supabase
      .from('Player')
      .select('id')
      .eq('id', params.id)
      .single()

    if (existingPlayerError) {
      throw existingPlayerError
    }

    if (!existingPlayer) {
      return NextResponse.json(
        { error: 'Player not found' },
        { status: 404 }
      )
    }

    // Update player
    const { data, error } = await supabase
      .from('Player')
      .update({
        ...body,
        updatedAt: new Date().toISOString()
      })
      .eq('id', params.id)
      .select(`
        id,
        name,
        handicapIndex,
        teamId,
        playerType,
        Team (
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
    console.error('Error updating player:', error)
    return NextResponse.json(
      { error: 'Failed to update player' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Reuse PATCH logic for PUT requests
  return PATCH(request, { params });
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await supabase
      .from('Player')
      .delete()
      .eq('id', params.id)

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting player:', error)
    return NextResponse.json(
      { error: 'Failed to delete player' },
      { status: 500 }
    )
  }
}