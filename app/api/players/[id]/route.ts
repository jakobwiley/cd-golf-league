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
    const id = params.id
    console.log(`Fetching player with ID: ${id}`)

    const player = await prisma.player.findUnique({
      where: { id },
      include: { team: true }
    })

    if (!player) {
      console.log(`Player with ID ${id} not found`)
      return NextResponse.json(
        { error: 'Player not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(player)
  } catch (error) {
    console.error('Error fetching player:', error)
    return NextResponse.json(
      { error: 'Failed to fetch player' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const data = await request.json()
    console.log(`Updating player with ID: ${id}`, data)

    // Check if player exists
    const player = await prisma.player.findUnique({
      where: { id }
    })

    if (!player) {
      console.log(`Player with ID ${id} not found`)
      return NextResponse.json(
        { error: 'Player not found' },
        { status: 404 }
      )
    }

    // If handicap is provided, update handicapIndex
    if (data.handicap !== undefined) {
      data.handicapIndex = data.handicap
      delete data.handicap
    }

    // Update the player
    const updatedPlayer = await prisma.player.update({
      where: { id },
      data,
      include: { team: true }
    })

    return NextResponse.json(updatedPlayer)
  } catch (error) {
    console.error('Error updating player:', error)
    return NextResponse.json(
      { error: 'Failed to update player' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    console.log(`Deleting player with ID: ${id}`)

    // Check if player exists
    const player = await prisma.player.findUnique({
      where: { id }
    })

    if (!player) {
      console.log(`Player with ID ${id} not found`)
      return NextResponse.json(
        { error: 'Player not found' },
        { status: 404 }
      )
    }

    // Delete the player
    await prisma.player.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Player deleted successfully' })
  } catch (error) {
    console.error('Error deleting player:', error)
    return NextResponse.json(
      { error: 'Failed to delete player' },
      { status: 500 }
    )
  }
} 