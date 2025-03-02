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

export async function GET() {
  try {
    const players = await prisma.player.findMany({
      orderBy: {
        name: 'asc'
      },
      include: {
        team: true
      }
    })
    return NextResponse.json(players)
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
    const { name, handicapIndex, playerType, teamId } = body

    if (!name || handicapIndex === undefined || !playerType || !teamId) {
      return NextResponse.json(
        { error: 'Name, handicap index, player type, and team ID are required' },
        { status: 400 }
      )
    }

    const player = await prisma.player.create({
      data: {
        name,
        handicapIndex,
        playerType,
        teamId
      }
    })

    return NextResponse.json(player)
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