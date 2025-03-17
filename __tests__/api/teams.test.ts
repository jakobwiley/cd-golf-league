import axios from 'axios';
import { prisma } from '../../lib/prisma';
import { getResponseData, createTestTeam } from '../utils';

const BASE_URL = global.TEST_BASE_URL;

describe('Teams API', () => {
  let testTeamId: string;

  // Clean up database before tests
  beforeAll(async () => {
    await prisma.team.deleteMany();
  });

  describe('GET /api/teams', () => {
    it('should return all teams', async () => {
      const response = await axios.get(`${BASE_URL}/api/teams`);
      const data = getResponseData(response);
      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
    });
  });

  describe('POST /api/teams', () => {
    it('should create a new team', async () => {
      const newTeam = {
        name: 'Test Team',
        players: []
      };

      const response = await axios.post(`${BASE_URL}/api/teams`, newTeam);
      const data = getResponseData(response);
      expect(response.status).toBe(201);
      expect(data).toHaveProperty('id');
      expect(data.name).toBe(newTeam.name);
      testTeamId = data.id;
    });
  });

  describe('PUT /api/teams', () => {
    it('should update an existing team', async () => {
      const updatedTeam = {
        name: 'Updated Test Team',
        players: []
      };

      const response = await axios.put(`${BASE_URL}/api/teams`, {
        id: testTeamId,
        ...updatedTeam
      });
      const data = getResponseData(response);
      expect(response.status).toBe(200);
      expect(data.name).toBe(updatedTeam.name);
    });
  });

  describe('DELETE /api/teams', () => {
    it('should delete a team', async () => {
      const response = await axios.delete(`${BASE_URL}/api/teams?id=${testTeamId}`);
      expect(response.status).toBe(200);
    });
  });

  // Clean up database after tests
  afterAll(async () => {
    await prisma.team.deleteMany();
  });
}); 