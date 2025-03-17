import axios from 'axios';
import { serializeResponse } from '../utils';

const BASE_URL = global.TEST_BASE_URL;

describe('Matches API', () => {
  let testMatchId: string;

  describe('GET /api/matches', () => {
    it('should return all matches', async () => {
      const response = await axios.get(`${BASE_URL}/api/matches`);
      const serializedResponse = serializeResponse(response);
      expect(serializedResponse.status).toBe(200);
      expect(Array.isArray(serializedResponse.data)).toBe(true);
      
      // Check structure of match data
      if (serializedResponse.data.length > 0) {
        const match = serializedResponse.data[0];
        expect(match).toHaveProperty('id');
        expect(match).toHaveProperty('date');
        expect(match).toHaveProperty('homeTeamId');
        expect(match).toHaveProperty('awayTeamId');
        expect(match).toHaveProperty('course');
        expect(match).toHaveProperty('status');
      }
    });
  });

  describe('POST /api/matches', () => {
    it('should create a new match', async () => {
      const newMatch = {
        date: new Date().toISOString(),
        homeTeamId: 'test-home-team',
        awayTeamId: 'test-away-team',
        course: 'Test Golf Course',
        status: 'scheduled'
      };
      
      const response = await axios.post(`${BASE_URL}/api/matches`, newMatch);
      const serializedResponse = serializeResponse(response);
      expect(serializedResponse.status).toBe(201);
      expect(serializedResponse.data).toHaveProperty('id');
      testMatchId = serializedResponse.data.id;
    });
  });

  describe('GET /api/matches/:id', () => {
    it('should return a specific match', async () => {
      const response = await axios.get(`${BASE_URL}/api/matches/${testMatchId}`);
      const serializedResponse = serializeResponse(response);
      expect(serializedResponse.status).toBe(200);
      expect(serializedResponse.data).toHaveProperty('id', testMatchId);
    });
  });

  describe('PUT /api/matches/:id', () => {
    it('should update a match', async () => {
      const updatedMatch = {
        status: 'completed'
      };
      
      const response = await axios.put(`${BASE_URL}/api/matches/${testMatchId}`, updatedMatch);
      const serializedResponse = serializeResponse(response);
      expect(serializedResponse.status).toBe(200);
      expect(serializedResponse.data.status).toBe('completed');
    });
  });

  describe('DELETE /api/matches/:id', () => {
    it('should delete a match', async () => {
      const response = await axios.delete(`${BASE_URL}/api/matches/${testMatchId}`);
      const serializedResponse = serializeResponse(response);
      expect(serializedResponse.status).toBe(200);
    });
  });
}); 