import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { name, handicapIndex, playerType } = body

    if (!name || handicapIndex === undefined || !playerType) {
      return NextResponse.json(
        { error: 'Name, handicap index, and player type are required' },
        { status: 400 }
      )
    }

    const player = await prisma.player.update({
      where: { id },
      data: {
        name,
        handicapIndex,
        playerType
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

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

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