import axios from 'axios';
import { TEST_BASE_URL } from '../jest.setup';

describe('Players API', () => {
  it('should return all players', async () => {
    const response = await axios.get(`${TEST_BASE_URL}/api/players`);
    
    expect(response.status).toBe(200);
    expect(response.data).toBeDefined();
    
    // Validate players array
    const players = response.data;
    expect(Array.isArray(players)).toBe(true);
    
    // Each player should have required properties
    players.forEach(player => {
      expect(player).toHaveProperty('id');
      expect(player).toHaveProperty('name');
      expect(player).toHaveProperty('teamId');
      expect(player).toHaveProperty('handicap');
    });
  });

  it('should return a specific player by ID', async () => {
    // First get all players to get a valid ID
    const playersResponse = await axios.get(`${TEST_BASE_URL}/api/players`);
    const playerId = playersResponse.data[0].id;
    
    const response = await axios.get(`${TEST_BASE_URL}/api/players/${playerId}`);
    
    expect(response.status).toBe(200);
    expect(response.data.id).toBe(playerId);
  });

  it('should handle invalid player IDs', async () => {
    try {
      await axios.get(`${TEST_BASE_URL}/api/players/999`);
      fail('Should have thrown an error');
    } catch (error) {
      expect(error.response.status).toBe(404);
    }
  });

  it('should return players for a specific team', async () => {
    // First get all teams to get a valid team ID
    const teamsResponse = await axios.get(`${TEST_BASE_URL}/api/teams`);
    const teamId = teamsResponse.data[0].id;
    
    const response = await axios.get(`${TEST_BASE_URL}/api/teams/${teamId}/players`);
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
    response.data.forEach(player => {
      expect(player.teamId).toBe(teamId);
    });
  });
}); 