import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

// Helper function to add CORS headers
function corsResponse(data: any, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

// Handle CORS preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

export async function GET() {
  try {
    const teams = await prisma.team.findMany({
      include: {
        players: true,
      },
    })
    return corsResponse(teams)
  } catch (error) {
    console.error('Error fetching teams:', error)
    return corsResponse({ error: 'Failed to fetch teams' }, 500)
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const team = await prisma.team.create({
      data: {
        name: data.name,
        players: {
          create: data.players || [],
        },
      },
      include: {
        players: true,
      },
    })
    return corsResponse(team, 201)
  } catch (error) {
    console.error('Error creating team:', error)
    return corsResponse({ error: 'Failed to create team' }, 500)
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json()
    const team = await prisma.team.update({
      where: { id: data.id },
      data: {
        name: data.name,
        players: {
          deleteMany: {},
          create: data.players || [],
        },
      },
      include: {
        players: true,
      },
    })
    return corsResponse(team)
  } catch (error) {
    console.error('Error updating team:', error)
    return corsResponse({ error: 'Failed to update team' }, 500)
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return corsResponse({ error: 'Team ID is required' }, 400)
    }
    await prisma.team.delete({
      where: { id },
    })
    return corsResponse({ message: 'Team deleted successfully' })
  } catch (error) {
    console.error('Error deleting team:', error)
    return corsResponse({ error: 'Failed to delete team' }, 500)
  }
} 