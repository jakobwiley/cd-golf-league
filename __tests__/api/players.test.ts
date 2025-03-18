import { prisma } from '../../lib/prisma'
import { createTestTeam } from '../utils'
import { handler } from '../../app/api/players/route'

describe('Players API', () => {
  let testTeam: any

  beforeEach(async () => {
    // Clean up test data
    await prisma.player.deleteMany()
    await prisma.team.deleteMany()
    
    // Create a test team
    testTeam = await createTestTeam(prisma)
    console.log('Created test team:', testTeam)
  })

  afterAll(async () => {
    // Clean up test data
    await prisma.player.deleteMany()
    await prisma.team.deleteMany()
  })

  describe('POST /api/players', () => {
    it('should create a new player', async () => {
      const requestBody = {
        name: 'Test Player',
        handicapIndex: 10,
        teamId: testTeam.id,
        playerType: 'PRIMARY'
      }
      console.log('Request body:', requestBody)

      const req = new Request('http://localhost:3007/api/players', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      const response = await handler.POST(req)
      const data = await response.json()
      console.log('Response:', { status: response.status, data })

      expect(response.status).toBe(200)
      expect(data).toHaveProperty('id')
      expect(data.name).toBe('Test Player')
      expect(data.handicapIndex).toBe(10)
      expect(data.playerType).toBe('PRIMARY')
      expect(data.teamId).toBe(testTeam.id)
    })

    it('should create a substitute player', async () => {
      const requestBody = {
        name: 'Test Sub',
        handicapIndex: 15,
        teamId: testTeam.id,
        playerType: 'SUB'
      }
      console.log('Request body:', requestBody)

      const req = new Request('http://localhost:3007/api/players', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      const response = await handler.POST(req)
      const data = await response.json()
      console.log('Response:', { status: response.status, data })

      expect(response.status).toBe(200)
      expect(data).toHaveProperty('id')
      expect(data.name).toBe('Test Sub')
      expect(data.handicapIndex).toBe(15)
      expect(data.playerType).toBe('SUB')
      expect(data.teamId).toBe(testTeam.id)
    })

    it('should return 400 for missing required fields', async () => {
      const req = new Request('http://localhost:3007/api/players', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Test Player'
        }),
      })

      const response = await handler.POST(req)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Missing required fields')
    })
  })
}) 