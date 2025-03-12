import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'
import { z } from 'zod'

// Validation schema for player data
const playerSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  playerType: z.enum(['PRIMARY', 'SUB']),
  handicapIndex: z.number().min(0).max(54),
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
    console.log('Fetching all players');
    const players = await prisma.player.findMany({
      orderBy: {
        name: 'asc'
      },
      include: {
        team: true
      }
    });
    console.log(`Found ${players.length} players`);
    
    return NextResponse.json(players, {
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
  console.log('POST /api/players - Starting player creation process');
  
  try {
    // Parse the request body
    let body;
    try {
      body = await request.json();
      console.log('Request body:', JSON.stringify(body, null, 2));
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }
    
    const { name, teamId } = body;

    // Validate required fields
    if (!name) {
      console.log('Player name is required');
      return NextResponse.json(
        { error: 'Player name is required' },
        { status: 400 }
      );
    }

    if (!teamId) {
      console.log('Team ID is required');
      return NextResponse.json(
        { error: 'Team ID is required' },
        { status: 400 }
      );
    }

    // Check if team exists
    console.log(`Checking if team with ID ${teamId} exists`);
    let team;
    try {
      team = await prisma.team.findUnique({
        where: { id: teamId }
      });
    } catch (findError) {
      return handleError(findError, 'Error finding team');
    }

    if (!team) {
      console.log(`Team with ID ${teamId} not found`);
      return NextResponse.json(
        { error: `Team with ID ${teamId} not found` },
        { status: 404 }
      );
    }

    console.log(`Found team: ${team.name} (${team.id})`);
    console.log(`Creating player ${name} for team ${team.name}`);
    
    try {
      // Create the player with only the fields that are in the Prisma schema
      const player = await prisma.player.create({
        data: {
          name,
          teamId
        }
      });

      console.log('Player created successfully:', JSON.stringify(player, null, 2));
      
      return NextResponse.json(player, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
      });
    } catch (createError) {
      return handleError(createError, 'Error creating player in database');
    }
  } catch (error) {
    return handleError(error, 'Error creating player');
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

    const player = await prisma.player.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json(player)
  } catch (error) {
    console.error('Error updating player:', error)
    return NextResponse.json(
      { error: 'Failed to update player' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json(
      { error: 'Player ID is required' },
      { status: 400 }
    )
  }

  try {
    await prisma.player.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting player:', error)
    return NextResponse.json(
      { error: 'Failed to delete player' },
      { status: 500 }
    )
  }
} 