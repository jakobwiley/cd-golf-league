import { NextResponse } from 'next/server'
import ghinService from '@/app/lib/ghin'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const ghinNumber = searchParams.get('ghinNumber')

  if (!ghinNumber) {
    return NextResponse.json(
      { error: 'GHIN number is required' },
      { status: 400 }
    )
  }

  try {
    const playerInfo = await ghinService.getPlayerInfo(ghinNumber)
    return NextResponse.json(playerInfo)
  } catch (error) {
    console.error('Error fetching GHIN data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch GHIN data' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { ghinNumber } = await request.json()
    
    if (!ghinNumber) {
      return NextResponse.json(
        { error: 'GHIN number is required' },
        { status: 400 }
      )
    }

    const isValid = await ghinService.validateGHINNumber(ghinNumber)
    return NextResponse.json({ isValid })
  } catch (error) {
    console.error('Error validating GHIN number:', error)
    return NextResponse.json(
      { error: 'Failed to validate GHIN number' },
      { status: 500 }
    )
  }
} 