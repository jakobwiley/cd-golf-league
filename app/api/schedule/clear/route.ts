import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

export async function DELETE() {
  try {
    const result = await prisma.match.deleteMany({})
    
    return NextResponse.json({ 
      message: 'All matches deleted successfully',
      count: result.count
    })
  } catch (error) {
    console.error('Error deleting matches:', error)
    return NextResponse.json(
      { error: 'Failed to delete matches' },
      { status: 500 }
    )
  }
} 