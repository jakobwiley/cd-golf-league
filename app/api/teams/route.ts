import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'
import { z } from 'zod'

const PlayerSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  ghinNumber: z.string().min(1, 'GHIN number is required'),
})

const TeamSchema = z.object({
  name: z.string().min(1, 'Team name is required'),
  players: z.array(PlayerSchema).min(2, 'Team must have at least 2 players'),
})

export async function GET() {
  try {
    const teams = await prisma.team.findMany({
      include: {
        players: true,
      },
    })
    return NextResponse.json(teams)
  } catch (error) {
    console.error('Error fetching teams:', error)
    return NextResponse.json(
      { error: 'Failed to fetch teams' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = TeamSchema.parse(body)

    const team = await prisma.team.create({
      data: {
        name: validatedData.name,
        players: {
          create: validatedData.players,
        },
      },
      include: {
        players: true,
      },
    })

    return NextResponse.json(team)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors },
        { status: 400 }
      )
    }
    console.error('Error creating team:', error)
    return NextResponse.json(
      { error: 'Failed to create team' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const { id, ...updateData } = await request.json()
    const validatedData = TeamSchema.parse(updateData)

    // Update team and handle player changes
    const team = await prisma.team.update({
      where: { id },
      data: {
        name: validatedData.name,
        players: {
          deleteMany: {}, // Remove existing players
          create: validatedData.players, // Add new players
        },
      },
      include: {
        players: true,
      },
    })

    return NextResponse.json(team)
  } catch (error) {
    console.error('Error updating team:', error)
    return NextResponse.json(
      { error: 'Failed to update team' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json(
      { error: 'Team ID is required' },
      { status: 400 }
    )
  }

  try {
    await prisma.team.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting team:', error)
    return NextResponse.json(
      { error: 'Failed to delete team' },
      { status: 500 }
    )
  }
} 