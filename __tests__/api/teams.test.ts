import request from 'supertest';
import { prisma } from '../../lib/prisma';
import { createTestTeam } from '../utils';
import { testBaseUrl } from '../../jest.setup';

describe('Teams API', () => {
  let testTeamId: string;

  // Clean up database before tests
  beforeAll(async () => {
    await prisma.team.deleteMany();
  });

  describe('GET /api/teams', () => {
    it('should return all teams', async () => {
      const response = await request(testBaseUrl).get('/api/teams');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('POST /api/teams', () => {
    it('should create a new team', async () => {
      const newTeam = {
        name: 'Test Team',
        players: []
      };

      const response = await request(testBaseUrl)
        .post('/api/teams')
        .send(newTeam);
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(newTeam.name);
      testTeamId = response.body.id;
    });
  });

  describe('PUT /api/teams', () => {
    it('should update an existing team', async () => {
      const updatedTeam = {
        name: 'Updated Test Team',
        players: []
      };

      const response = await request(testBaseUrl)
        .put('/api/teams')
        .send({
          id: testTeamId,
          ...updatedTeam
        });
      expect(response.status).toBe(200);
      expect(response.body.name).toBe(updatedTeam.name);
    });
  });

  describe('DELETE /api/teams', () => {
    it('should delete a team', async () => {
      const response = await request(testBaseUrl)
        .delete('/api/teams')
        .query({ id: testTeamId });
      expect(response.status).toBe(200);
    });
  });

  // Clean up database after tests
  afterAll(async () => {
    await prisma.team.deleteMany();
  });
}); 