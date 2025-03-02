import { GHIN } from 'ghin'

const ghin = new GHIN()

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

export async function getPlayerInfo(ghinNumber: string): Promise<PlayerInfo> {
  try {
    const golfer = await ghin.getGolfer(ghinNumber)
    
    if (!golfer) {
      throw new Error('Golfer not found')
    }

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
  } catch (error) {
    console.error('Error fetching GHIN data:', error)
    throw error
  }
}

export async function getHandicapHistory(ghinNumber: string) {
  try {
    const history = await ghin.getHandicapHistory(ghinNumber)
    return history
  } catch (error) {
    console.error('Error fetching handicap history:', error)
    throw error
  }
}

export async function getScoreHistory(ghinNumber: string) {
  try {
    const scores = await ghin.getScoreHistory(ghinNumber)
    return scores
  } catch (error) {
    console.error('Error fetching score history:', error)
    throw error
  }
}

export async function validateGHINNumber(ghinNumber: string): Promise<boolean> {
  try {
    const golfer = await ghin.getGolfer(ghinNumber)
    return !!golfer
  } catch (error) {
    return false
  }
} 