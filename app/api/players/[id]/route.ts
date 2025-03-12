import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'
import { Prisma } from '@prisma/client'

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
    console.log(`Fetching player with ID: ${params.id}`);
    
    const player = await prisma.player.findUnique({
      where: { id: params.id },
      include: { team: true }
    });
    
    if (!player) {
      console.log(`Player with ID ${params.id} not found`);
      return NextResponse.json(
        { error: 'Player not found' },
        { status: 404 }
      );
    }
    
    console.log(`Found player: ${player.name}`);
    
    return NextResponse.json(player, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  } catch (error) {
    return handleError(error, 'Error fetching player');
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`Attempting to update player with ID: ${params.id}`);
    
    const body = await request.json()
    const { name, teamId } = body

    if (!name) {
      return NextResponse.json(
        { error: 'Player name is required' },
        { status: 400 }
      )
    }

    const player = await prisma.player.update({
      where: { id: params.id },
      data: { 
        name,
        teamId
      },
    })

    console.log(`Successfully updated player: ${player.name}`);
    
    return NextResponse.json(player, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  } catch (error) {
    return handleError(error, 'Error updating player');
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`Attempting to delete player with ID: ${params.id}`);
    
    // First check if the player exists
    const player = await prisma.player.findUnique({
      where: { id: params.id },
      include: { team: true }
    })

    if (!player) {
      console.log(`Player with ID ${params.id} not found`);
      return NextResponse.json(
        { error: 'Player not found' },
        { status: 404 }
      )
    }

    console.log(`Found player: ${player.name} from team ${player.team?.name || 'Unknown'}`);

    // Delete the player
    const deletedPlayer = await prisma.player.delete({
      where: { id: params.id }
    })

    console.log(`Successfully deleted player: ${deletedPlayer.name}`);
    
    return NextResponse.json(deletedPlayer, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  } catch (error) {
    console.error('Error deleting player:', error)
    
    // Handle specific Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          { error: 'Player not found' },
          { status: 404 }
        )
      }
    }
    
    return handleError(error, 'Error deleting player');
  }
} 