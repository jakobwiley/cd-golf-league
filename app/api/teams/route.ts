import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'
import { z } from 'zod'
import { SocketEvents } from '../../../lib/socket'
import { corsResponse, corsOptionsResponse } from '../../../lib/api-utils'

const PlayerSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  ghinNumber: z.string().min(1, 'GHIN number is required'),
})

const TeamSchema = z.object({
  name: z.string().min(1, 'Team name is required'),
  players: z.array(PlayerSchema).min(2, 'Team must have at least 2 players'),
})

// Function to emit team updated event
async function emitTeamUpdated(teamId: string) {
  try {
    // Get the Socket.io server instance
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/socket`, {
      method: 'GET',
    })
    
    if (!res.ok) {
      console.error('Failed to get Socket.io server instance')
      return
    }
    
    // Emit the team updated event
    const socketIo = (global as any).socketIo
    if (socketIo) {
      console.log(`Emitting ${SocketEvents.TEAM_UPDATED} event for team ${teamId}`)
      socketIo.emit(SocketEvents.TEAM_UPDATED, { teamId })
    } else {
      console.warn('Socket.io server not initialized')
    }
  } catch (error) {
    console.error('Error emitting team updated event:', error)
  }
}

export async function OPTIONS() {
  return corsOptionsResponse()
}

export async function GET() {
  try {
    const teams = await prisma.team.findMany({
      include: {
        players: {
          orderBy: {
            name: 'asc',
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    })

    return corsResponse(teams)
  } catch (error) {
    console.error('Error fetching teams:', error)
    return corsResponse(
      { error: 'Failed to fetch teams' },
      500
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name } = body

    if (!name) {
      return corsResponse(
        { error: 'Team name is required' },
        400
      )
    }

    const team = await prisma.team.create({
      data: {
        name,
      },
    })

    // Emit Socket.IO event for real-time updates
    await emitTeamUpdated(team.id)

    return corsResponse(team)
  } catch (error) {
    console.error('Error creating team:', error)
    return corsResponse(
      { error: 'Failed to create team' },
      500
    )
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, name } = body

    if (!id) {
      return corsResponse(
        { error: 'Team ID is required' },
        400
      )
    }

    if (!name) {
      return corsResponse(
        { error: 'Team name is required' },
        400
      )
    }

    const team = await prisma.team.update({
      where: {
        id,
      },
      data: {
        name,
      },
    })

    // Emit Socket.IO event for real-time updates
    await emitTeamUpdated(team.id)

    return corsResponse(team)
  } catch (error) {
    console.error('Error updating team:', error)
    return corsResponse(
      { error: 'Failed to update team' },
      500
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return corsResponse(
        { error: 'Team ID is required' },
        400
      )
    }

    // Store the team ID before deletion
    const teamId = id

    await prisma.team.delete({
      where: {
        id,
      },
    })

    // Emit Socket.IO event for real-time updates
    await emitTeamUpdated(teamId)

    return corsResponse({ success: true })
  } catch (error) {
    console.error('Error deleting team:', error)
    return corsResponse(
      { error: 'Failed to delete team' },
      500
    )
  }
} 