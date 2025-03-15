import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'
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

export async function GET(request: Request) {
  try {
    const players = await prisma.player.findMany({
      include: {
        team: true,
      },
      orderBy: {
        name: 'asc',
      },
    })

    return NextResponse.json({
      players,
    })
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
    const data = await request.json();
    console.log('Creating player with data:', data);
    
    // Validate required fields
    if (!data.name) {
      return NextResponse.json(
        { error: 'Player name is required' },
        { status: 400 }
      );
    }
    
    if (!data.teamId) {
      return NextResponse.json(
        { error: 'Team ID is required' },
        { status: 400 }
      );
    }
    
    // Check if team exists
    const team = await prisma.team.findUnique({
      where: { id: data.teamId }
    });
    
    if (!team) {
      return NextResponse.json(
        { error: `Team with ID ${data.teamId} not found` },
        { status: 404 }
      );
    }
    
    // Create the player
    const player = await prisma.player.create({
      data: {
        name: data.name,
        handicapIndex: parseFloat(data.handicapIndex) || 0, // Ensure handicapIndex is a number
        playerType: data.playerType || 'PRIMARY',
        teamId: data.teamId
      },
      include: {
        team: true
      }
    });
    
    return NextResponse.json(player);
  } catch (error) {
    console.error('Error creating player:', error);
    return NextResponse.json(
      { error: 'Failed to create player' },
      { status: 500 }
    );
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

    const player = await prisma.player.update({
      where: { id },
      data: updateData,
      include: {
        team: true
      }
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
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Player ID is required' },
        { status: 400 }
      );
    }
    
    await prisma.player.delete({
      where: { id }
    });
    
    return NextResponse.json({ message: 'Player deleted successfully' });
  } catch (error) {
    console.error('Error deleting player:', error);
    return NextResponse.json(
      { error: 'Failed to delete player' },
      { status: 500 }
    );
  }
} 