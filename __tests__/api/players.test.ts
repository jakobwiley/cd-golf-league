import axios from 'axios';
import { serializeResponse } from '../utils';

const BASE_URL = global.TEST_BASE_URL;

describe('Players API', () => {
  let testPlayerId: string;

  describe('GET /api/players', () => {
    it('should return all players', async () => {
      const response = await axios.get(`${BASE_URL}/api/players`);
      const serializedResponse = serializeResponse(response);
      expect(serializedResponse.status).toBe(200);
      expect(Array.isArray(serializedResponse.data)).toBe(true);
      
      // Check structure of players data
      if (serializedResponse.data.length > 0) {
        const player = serializedResponse.data[0];
        expect(player).toHaveProperty('id');
        expect(player).toHaveProperty('name');
        expect(player).toHaveProperty('email');
        expect(player).toHaveProperty('teamId');
      }
    });
  });

  describe('POST /api/players', () => {
    it('should create a new player', async () => {
      const newPlayer = {
        name: 'Test Player',
        email: 'test@example.com',
        teamId: 'test-team-id'
      };
      
      const response = await axios.post(`${BASE_URL}/api/players`, newPlayer);
      const serializedResponse = serializeResponse(response);
      expect(serializedResponse.status).toBe(201);
      expect(serializedResponse.data).toHaveProperty('id');
      testPlayerId = serializedResponse.data.id;
    });
  });

  describe('GET /api/players/:id', () => {
    it('should return a specific player', async () => {
      const response = await axios.get(`${BASE_URL}/api/players/${testPlayerId}`);
      const serializedResponse = serializeResponse(response);
      expect(serializedResponse.status).toBe(200);
      expect(serializedResponse.data).toHaveProperty('id', testPlayerId);
    });
  });

  describe('PUT /api/players/:id', () => {
    it('should update a player', async () => {
      const updatedPlayer = {
        name: 'Updated Test Player'
      };
      
      const response = await axios.put(`${BASE_URL}/api/players/${testPlayerId}`, updatedPlayer);
      const serializedResponse = serializeResponse(response);
      expect(serializedResponse.status).toBe(200);
      expect(serializedResponse.data.name).toBe('Updated Test Player');
    });
  });

  describe('DELETE /api/players/:id', () => {
    it('should delete a player', async () => {
      const response = await axios.delete(`${BASE_URL}/api/players/${testPlayerId}`);
      const serializedResponse = serializeResponse(response);
      expect(serializedResponse.status).toBe(200);
    });
  });
}); 