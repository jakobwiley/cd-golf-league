import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'
import { Prisma } from '@prisma/client'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name } = body

    if (!name) {
      return NextResponse.json(
        { error: 'Team name is required' },
        { status: 400 }
      )
    }

    const team = await prisma.team.update({
      where: { id: params.id },
      data: { name },
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

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // First check if the team exists
    const team = await prisma.team.findUnique({
      where: { id: params.id },
      include: { players: true }
    })

    if (!team) {
      return NextResponse.json(
        { error: 'Team not found' },
        { status: 404 }
      )
    }

    // Use a transaction to ensure both operations complete or neither does
    const deletedTeam = await prisma.$transaction(async (tx) => {
      // Delete players if they exist
      if (team.players.length > 0) {
        await tx.player.deleteMany({
          where: { teamId: params.id }
        })
      }

      // Delete the team
      return await tx.team.delete({
        where: { id: params.id }
      })
    })

    return NextResponse.json(deletedTeam)
  } catch (error) {
    console.error('Error deleting team:', error)
    
    // Handle specific Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          { error: 'Team not found' },
          { status: 404 }
        )
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to delete team' },
      { status: 500 }
    )
  }
} 