import request from 'supertest';
import { testBaseUrl } from '../jest.setup';

describe('Players API', () => {
  it('should return all players', async () => {
    const response = await request(testBaseUrl).get('/api/players');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should return a specific player by ID', async () => {
    // First get all players to get a valid ID
    const playersResponse = await request(testBaseUrl).get('/api/players');
    const playerId = playersResponse.body[0].id;

    const response = await request(testBaseUrl).get(`/api/players/${playerId}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(playerId);
  });

  it('should handle invalid player IDs', async () => {
    const response = await request(testBaseUrl).get('/api/players/999');
    expect(response.status).toBe(404);
  });

  it('should return players for a specific team', async () => {
    // First get all teams to get a valid team ID
    const teamsResponse = await request(testBaseUrl).get('/api/teams');
    const teamId = teamsResponse.body[0].id;

    const response = await request(testBaseUrl).get(`/api/teams/${teamId}/players`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
}); 