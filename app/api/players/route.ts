import { NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'
import { z } from 'zod'
import { randomUUID } from 'crypto'

// Validation schema for player data
const playerSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  playerType: z.enum(['PRIMARY', 'SUBSTITUTE']).default('PRIMARY'),
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

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const teamId = url.searchParams.get('teamId');
    const playerType = url.searchParams.get('playerType');
    
    // Build the query
    let query = supabase
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
      .order('name');
    
    // Apply filters if provided
    if (teamId) {
      query = query.eq('teamId', teamId);
    }
    
    if (playerType) {
      query = query.eq('playerType', playerType);
    }
    
    // Execute the query
    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({ 
      players: data 
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  } catch (error) {
    return handleError(error, 'Error fetching players');
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('Received player data:', body);

    // Validate the input data
    try {
      playerSchema.parse(body);
    } catch (validationError: any) {
      console.error('Validation error:', validationError);
      return NextResponse.json(
        { error: 'Invalid player data', details: validationError.errors },
        { status: 400 }
      );
    }

    // Check if team exists
    const { data: team, error: teamError } = await supabase
      .from('Team')
      .select('id')
      .eq('id', body.teamId)
      .single()

    if (teamError) {
      console.error('Team lookup error:', teamError);
      if (teamError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Team not found' },
          { status: 404 }
        );
      }
      throw teamError;
    }

    // Generate a UUID for the new player
    const playerId = body.id || randomUUID();
    
    console.log('Creating player with ID:', playerId);

    // Create player using the service role client (which has admin privileges)
    const { data, error } = await supabase
      .from('Player')
      .insert([{
        id: playerId,
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
      console.error('Supabase error:', error);
      throw error
    }

    return NextResponse.json(data)
  } catch (error) {
    return handleError(error, 'Error creating player');
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()

    if (!body.id) {
      return NextResponse.json(
        { error: 'Player ID is required' },
        { status: 400 }
      )
    }

    // Check if player exists
    const { data: existingPlayer, error: playerError } = await supabase
      .from('Player')
      .select('id')
      .eq('id', body.id)
      .single()

    if (playerError) {
      throw playerError
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
        name: body.name,
        handicapIndex: body.handicapIndex || 0,
        teamId: body.teamId,
        playerType: body.playerType || 'PRIMARY',
        updatedAt: new Date().toISOString()
      })
      .eq('id', body.id)
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json(data)
  } catch (error) {
    return handleError(error, 'Error updating player');
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Player ID is required' },
        { status: 400 }
      )
    }

    // Delete player
    const { error } = await supabase
      .from('Player')
      .delete()
      .eq('id', id)

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return handleError(error, 'Error deleting player');
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