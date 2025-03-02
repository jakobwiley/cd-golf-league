import axios from 'axios'

const GHIN_API_BASE_URL = 'https://api.ghin.com/api/v1'

interface HandicapInfo {
  handicapIndex: string
  lowHandicapIndex: string
  highHandicapIndex: string
  lastUpdated: string
  association: string
  status: string
}

interface PlayerInfo {
  ghinNumber: string
  firstName: string
  lastName: string
  club: string
  handicapInfo: HandicapInfo
  email?: string
  gender?: string
}

class GHINService {
  private async makeRequest(endpoint: string, method: string = 'GET', data?: any) {
    try {
      const response = await axios({
        method,
        url: `${GHIN_API_BASE_URL}${endpoint}`,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        data,
      })
      
      return response.data
    } catch (error: any) {
      console.error(`Error making GHIN API request to ${endpoint}:`, error)
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        throw new Error(`GHIN API Error: ${error.response.data.message || 'Unknown error'}`)
      } else if (error.request) {
        // The request was made but no response was received
        throw new Error('No response received from GHIN API')
      } else {
        // Something happened in setting up the request that triggered an Error
        throw new Error(`Error setting up GHIN request: ${error.message}`)
      }
    }
  }

  async getPlayerInfo(ghinNumber: string): Promise<PlayerInfo> {
    try {
      const response = await this.makeRequest(`/golfers/${ghinNumber}`)
      const data = response.golfer || response

      if (!data) {
        throw new Error('No golfer data found')
      }
      
      return {
        ghinNumber: data.ghin || data.golfer_id,
        firstName: data.first_name,
        lastName: data.last_name,
        club: data.club_name,
        email: data.email,
        gender: data.gender,
        handicapInfo: {
          handicapIndex: data.handicap_index,
          lowHandicapIndex: data.low_hi || data.low_handicap_index,
          highHandicapIndex: data.high_hi || data.high_handicap_index,
          lastUpdated: data.revision_date,
          association: data.association_name,
          status: data.status,
        },
      }
    } catch (error) {
      console.error('Error fetching player info:', error)
      throw error
    }
  }

  async validateGHINNumber(ghinNumber: string): Promise<boolean> {
    try {
      await this.getPlayerInfo(ghinNumber)
      return true
    } catch (error) {
      return false
    }
  }

  async getHandicapHistory(ghinNumber: string) {
    try {
      const response = await this.makeRequest(`/golfers/${ghinNumber}/handicap_history`)
      return response.handicap_history || []
    } catch (error) {
      console.error('Error fetching handicap history:', error)
      throw error
    }
  }

  async getScoreHistory(ghinNumber: string) {
    try {
      const response = await this.makeRequest(`/golfers/${ghinNumber}/scores`)
      return response.scores || []
    } catch (error) {
      console.error('Error fetching score history:', error)
      throw error
    }
  }
}

// Create and export a singleton instance
const ghinService = new GHINService()

export default ghinService 