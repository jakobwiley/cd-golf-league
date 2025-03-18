import { PrismaClient, Prisma } from '@prisma/client';
import request from 'supertest';
import { testBaseUrl, testDatabaseUrl } from '../../jest.setup';

const prisma = new PrismaClient();

describe('Database API Tests', () => {
  beforeAll(async () => {
    // Ensure we're using the test database
    if (!testDatabaseUrl?.includes('test')) {
      throw new Error('Test database URL must contain "test" to prevent accidental data loss');
    }
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    // Clear all tables before each test
    await prisma.matchScore.deleteMany();
    await prisma.matchPoints.deleteMany();
    await prisma.matchPlayer.deleteMany();
    await prisma.match.deleteMany();
    await prisma.player.deleteMany();
    await prisma.team.deleteMany();
  });

  describe('Team Creation', () => {
    it('should create a team successfully', async () => {
      const response = await request(testBaseUrl)
        .post('/api/teams')
        .send({ name: 'Test Team' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('Test Team');
    });

    it('should not create a team with duplicate name', async () => {
      // Create first team
      await request(testBaseUrl)
        .post('/api/teams')
        .send({ name: 'Test Team' });

      // Try to create duplicate team
      const response = await request(testBaseUrl)
        .post('/api/teams')
        .send({ name: 'Test Team' });

      expect(response.status).toBe(400);
    });
  });

  describe('Match Creation', () => {
    let homeTeamId: string;
    let awayTeamId: string;

    beforeEach(async () => {
      // Create test teams
      const homeTeam = await prisma.team.create({
        data: {
          id: crypto.randomUUID(),
          name: 'Home Team'
        }
      });
      const awayTeam = await prisma.team.create({
        data: {
          id: crypto.randomUUID(),
          name: 'Away Team'
        }
      });
      homeTeamId = homeTeam.id;
      awayTeamId = awayTeam.id;
    });

    it('should create a match successfully', async () => {
      const response = await request(testBaseUrl)
        .post('/api/matches')
        .send({
          date: new Date().toISOString(),
          weekNumber: 1,
          startingHole: 1,
          homeTeamId,
          awayTeamId,
          status: 'SCHEDULED'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body.homeTeamId).toBe(homeTeamId);
      expect(response.body.awayTeamId).toBe(awayTeamId);
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
      const team = await prisma.team.create({
        data: {
          id: crypto.randomUUID(),
          name: 'Test Team'
        }
      });
      teamId = team.id;

      // Create primary player
      const primaryPlayer = await prisma.player.create({
        data: {
          id: crypto.randomUUID(),
          name: 'Primary Player',
          playerType: 'PRIMARY',
          handicapIndex: 10,
          teamId
        }
      });
      primaryPlayerId = primaryPlayer.id;

      // Create substitute player
      const substitutePlayer = await prisma.player.create({
        data: {
          id: crypto.randomUUID(),
          name: 'Substitute Player',
          playerType: 'SUBSTITUTE',
          handicapIndex: 12,
          teamId
        }
      });
      substitutePlayerId = substitutePlayer.id;

      // Create test match
      const match = await prisma.match.create({
        data: {
          id: crypto.randomUUID(),
          date: new Date().toISOString(),
          weekNumber: 1,
          startingHole: 1,
          homeTeamId: teamId,
          awayTeamId: teamId,
          status: 'SCHEDULED'
        }
      });
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