import { NextResponse } from 'next/server'

const GHIN_API_BASE_URL = 'https://api.ghin.com/api/v1'
const GHIN_TOKEN = 'bG92ZTpiYXNlNjQ='

interface HandicapInfo {
  handicapIndex: string
  lastUpdated: string
  association: string
}

interface PlayerInfo {
  firstName: string
  lastName: string
  email?: string
  gender?: string
  club?: string
  handicapInfo: HandicapInfo
}

async function fetchGHINData(ghinNumber: string): Promise<PlayerInfo> {
  const response = await fetch(
    `${GHIN_API_BASE_URL}/golfers/search?golfer_id=${ghinNumber}&status=Active&from_ghin=true&per_page=1`,
    {
      headers: {
        'Authorization': `Bearer ${GHIN_TOKEN}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    }
  )

  if (!response.ok) {
    throw new Error(`GHIN API error: ${response.statusText}`)
  }

  const data = await response.json()
  console.log('GHIN API Response:', data) // For debugging

  if (!data.golfers?.[0]) {
    throw new Error('Golfer not found')
  }

  const golfer = data.golfers[0]
  return {
    firstName: golfer.FirstName,
    lastName: golfer.LastName,
    email: golfer.Email,
    gender: golfer.Gender,
    club: golfer.ClubName,
    handicapInfo: {
      handicapIndex: golfer.HandicapIndex,
      lastUpdated: golfer.RevisionDate,
      association: golfer.Association,
    },
  }
}

async function fetchHandicapHistory(ghinNumber: string) {
  const response = await fetch(
    `${GHIN_API_BASE_URL}/golfers/${ghinNumber}/handicap_history`,
    {
      headers: {
        'Authorization': `Bearer ${GHIN_TOKEN}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    }
  )

  if (!response.ok) {
    throw new Error(`GHIN API error: ${response.statusText}`)
  }

  return response.json()
}

async function fetchScoreHistory(ghinNumber: string) {
  const response = await fetch(
    `${GHIN_API_BASE_URL}/golfers/${ghinNumber}/scores/all`,
    {
      headers: {
        'Authorization': `Bearer ${GHIN_TOKEN}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    }
  )

  if (!response.ok) {
    throw new Error(`GHIN API error: ${response.statusText}`)
  }

  return response.json()
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const ghinNumber = searchParams.get('ghinNumber')
  const type = searchParams.get('type') || 'info'

  if (!ghinNumber) {
    return NextResponse.json(
      { error: 'GHIN number is required' },
      { status: 400 }
    )
  }

  try {
    let data
    switch (type) {
      case 'handicap_history':
        data = await fetchHandicapHistory(ghinNumber)
        break
      case 'scores':
        data = await fetchScoreHistory(ghinNumber)
        break
      default:
        data = await fetchGHINData(ghinNumber)
    }
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching GHIN data:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch GHIN data' },
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

    try {
      await fetchGHINData(ghinNumber)
      return NextResponse.json({ isValid: true })
    } catch (error) {
      return NextResponse.json({ isValid: false })
    }
  } catch (error) {
    console.error('Error validating GHIN number:', error)
    return NextResponse.json(
      { error: 'Failed to validate GHIN number' },
      { status: 500 }
    )
  }
} 