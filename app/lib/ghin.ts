import axios from 'axios'

const GHIN_API_BASE_URL = 'https://api.ghin.com/api/v1'

interface GHINCredentials {
  clientId: string
  clientSecret: string
  apiKey: string
}

interface HandicapInfo {
  handicapIndex: string
  lowHandicapIndex: string
  highHandicapIndex: string
  lastUpdated: string
}

interface PlayerInfo {
  ghinNumber: string
  firstName: string
  lastName: string
  club: string
  handicapInfo: HandicapInfo
}

class GHINService {
  private token: string | null = null
  private credentials: GHINCredentials

  constructor(credentials: GHINCredentials) {
    this.credentials = credentials
  }

  private async getToken(): Promise<string> {
    if (this.token) return this.token

    try {
      const response = await axios.post(`${GHIN_API_BASE_URL}/oauth/token`, {
        grant_type: 'client_credentials',
        client_id: this.credentials.clientId,
        client_secret: this.credentials.clientSecret,
      })

      this.token = response.data.access_token
      return this.token
    } catch (error) {
      console.error('Error getting GHIN token:', error)
      throw new Error('Failed to authenticate with GHIN API')
    }
  }

  private async makeRequest(endpoint: string, method: string = 'GET', data?: any) {
    const token = await this.getToken()
    
    try {
      const response = await axios({
        method,
        url: `${GHIN_API_BASE_URL}${endpoint}`,
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-API-KEY': this.credentials.apiKey,
          'Content-Type': 'application/json',
        },
        data,
      })
      
      return response.data
    } catch (error) {
      console.error(`Error making GHIN API request to ${endpoint}:`, error)
      throw error
    }
  }

  async getPlayerInfo(ghinNumber: string): Promise<PlayerInfo> {
    try {
      const data = await this.makeRequest(`/golfers/${ghinNumber}`)
      
      return {
        ghinNumber: data.golfer_id,
        firstName: data.first_name,
        lastName: data.last_name,
        club: data.club_name,
        handicapInfo: {
          handicapIndex: data.handicap_index,
          lowHandicapIndex: data.low_handicap_index,
          highHandicapIndex: data.high_handicap_index,
          lastUpdated: data.revision_date,
        },
      }
    } catch (error) {
      console.error('Error fetching player info:', error)
      throw new Error('Failed to fetch player information from GHIN')
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
}

// Create and export a singleton instance
const ghinService = new GHINService({
  clientId: process.env.GHIN_CLIENT_ID || '',
  clientSecret: process.env.GHIN_CLIENT_SECRET || '',
  apiKey: process.env.GHIN_API_KEY || '',
})

export default ghinService 