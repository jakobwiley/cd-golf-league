import { PrismaClient, Prisma } from '@prisma/client';
import request from 'supertest';
import { testBaseUrl, testDatabaseUrl } from '../../jest.setup';
import { createTestTeam, createTestPlayer, createTestMatch, clearDatabase } from '../utils'

const prisma = new PrismaClient();

describe('Database API Tests', () => {
  beforeAll(async () => {
    // Ensure we're using the test database
    if (!testDatabaseUrl?.includes('test')) {
      throw new Error('Test database URL must contain "test" to prevent accidental data loss');
    }
  });

  beforeEach(async () => {
    await clearDatabase()
  })

  afterAll(async () => {
    await clearDatabase()
    await prisma.$disconnect();
  });

  describe('Team Creation', () => {
    it('should create a team successfully', async () => {
      const team = await createTestTeam('Test Team')
      expect(team.name).toBe('Test Team')
      expect(team.id).toBeDefined()
    });

    it('should not create a team with duplicate name', async () => {
      // Create first team
      await createTestTeam('Test Team')

      // Try to create duplicate team
      const response = await request(testBaseUrl)
        .post('/api/teams')
        .send({ name: 'Test Team' });

      expect(response.status).toBe(400);
    });
  });

  describe('Player Creation', () => {
    it('should create a player successfully', async () => {
      const team = await createTestTeam()
      const player = await createTestPlayer(team.id, 'Test Player', 10)
      
      expect(player.name).toBe('Test Player')
      expect(player.handicapIndex).toBe(10)
      expect(player.teamId).toBe(team.id)
    });
  });

  describe('Match Creation', () => {
    it('should create a match successfully', async () => {
      const homeTeam = await createTestTeam('Home Team')
      const awayTeam = await createTestTeam('Away Team')
      const match = await createTestMatch(homeTeam.id, awayTeam.id)
      
      expect(match.homeTeamId).toBe(homeTeam.id)
      expect(match.awayTeamId).toBe(awayTeam.id)
      expect(match.status).toBe('SCHEDULED')
    });

    it('should not create a match with invalid team IDs', async () => {
      const response = await request(testBaseUrl)
        .post('/api/matches')
        .send({
          date: new Date().toISOString(),
          weekNumber: 1,
          startingHole: 1,
          homeTeamId: 'invalid-id',
          awayTeamId: 'invalid-id',
          status: 'SCHEDULED'
        });

      expect(response.status).toBe(400);
    });
  });

  describe('Schedule Setup', () => {
    it('should set up the complete schedule', async () => {
      const response = await request(testBaseUrl)
        .get('/api/direct-setup-schedule');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      
      // Verify match structure
      const match = response.body[0];
      expect(match).toHaveProperty('id');
      expect(match).toHaveProperty('weekNumber');
      expect(match).toHaveProperty('startingHole');
      expect(match).toHaveProperty('homeTeam');
      expect(match).toHaveProperty('awayTeam');
    });
  });

  describe('Player Substitution', () => {
    let teamId: string;
    let primaryPlayerId: string;
    let substitutePlayerId: string;
    let matchId: string;

    beforeEach(async () => {
      // Create test team
      const team = await createTestTeam()
      teamId = team.id;

      // Create primary player
      const primaryPlayer = await createTestPlayer(teamId, 'Primary Player', 10)
      primaryPlayerId = primaryPlayer.id;

      // Create substitute player
      const substitutePlayer = await createTestPlayer(teamId, 'Substitute Player', 12)
      substitutePlayerId = substitutePlayer.id;

      // Create test match
      const match = await createTestMatch(teamId, teamId)
      matchId = match.id;
    });

    it('should create a player substitution', async () => {
      const response = await request(testBaseUrl)
        .post('/api/match-players')
        .send({
          matchId,
          playerId: substitutePlayerId,
          substituteFor: primaryPlayerId,
          isSubstitute: true
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body.isSubstitute).toBe(true);
      expect(response.body.substituteFor).toBe(primaryPlayerId);
    });

    it('should not allow duplicate player assignments', async () => {
      // Create first assignment
      await request(testBaseUrl)
        .post('/api/match-players')
        .send({
          matchId,
          playerId: substitutePlayerId,
          substituteFor: primaryPlayerId,
          isSubstitute: true
        });

      // Try to create duplicate assignment
      const response = await request(testBaseUrl)
        .post('/api/match-players')
        .send({
          matchId,
          playerId: substitutePlayerId,
          substituteFor: primaryPlayerId,
          isSubstitute: true
        });

      expect(response.status).toBe(400);
    });
  });
}); 