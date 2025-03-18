import { NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'
import { z } from 'zod'

// Validation schema for player data
const playerSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  playerType: z.enum(['PRIMARY', 'SUB']).default('PRIMARY'),
  handicapIndex: z.number().min(-10).max(54).default(0),
  teamId: z.string().optional()
})

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

export async function GET() {
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
      .order('name', { ascending: true })

    if (error) {
      throw error
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching players:', error)
    return NextResponse.json(
      { error: 'Failed to fetch players' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.teamId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if team exists
    const { data: team, error: teamError } = await supabase
      .from('Team')
      .select('id')
      .eq('id', body.teamId)
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

    // Create player
    const { data, error } = await supabase
      .from('Player')
      .insert([{
        name: body.name,
        handicapIndex: body.handicapIndex || 0,
        teamId: body.teamId,
        playerType: body.playerType || 'PRIMARY',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }])
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
    console.error('Error creating player:', error)
    return NextResponse.json(
      { error: 'Failed to create player' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const { id, ...updateData } = await request.json()

    if (!id) {
      return NextResponse.json(
        { error: 'Player ID is required' },
        { status: 400 }
      )
    }

    // Ensure handicapIndex is a number
    if (updateData.handicapIndex !== undefined) {
      updateData.handicapIndex = parseFloat(updateData.handicapIndex);
    }

    const { data, error } = await supabase
      .from('Player')
      .update([updateData])
      .eq('id', id)
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

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Player ID is required' },
        { status: 400 }
      );
    }
    
    const { error } = await supabase
      .from('Player')
      .delete()
      .eq('id', id)

    if (error) {
      throw error
    }
    
    return NextResponse.json({ message: 'Player deleted successfully' });
  } catch (error) {
    console.error('Error deleting player:', error);
    return NextResponse.json(
      { error: 'Failed to delete player' },
      { status: 500 }
    );
  }
}

// Export handlers for testing
export const handler = {
  GET,
  POST,
  PUT,
  DELETE,
  OPTIONS
} 