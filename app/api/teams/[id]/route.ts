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
    console.log(`Attempting to delete team with ID: ${params.id}`);
    
    // First check if the team exists
    const team = await prisma.team.findUnique({
      where: { id: params.id },
      include: { players: true }
    })

    if (!team) {
      console.log(`Team with ID ${params.id} not found`);
      return NextResponse.json(
        { error: 'Team not found' },
        { status: 404 }
      )
    }

    console.log(`Found team: ${team.name} with ${team.players.length} players`);

    try {
      // Delete players if they exist
      if (team.players && team.players.length > 0) {
        console.log(`Deleting ${team.players.length} players from team ${team.name}`);
        await prisma.player.deleteMany({
          where: { teamId: params.id }
        })
      }

      // Delete the team
      const deletedTeam = await prisma.team.delete({
        where: { id: params.id }
      })

      console.log(`Successfully deleted team: ${deletedTeam.name}`);
      return NextResponse.json(deletedTeam)
    } catch (deleteError) {
      console.error('Error during deletion process:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete team or its players' },
        { status: 500 }
      )
    }
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