import axios from 'axios';
import { serializeResponse } from '../utils';

const BASE_URL = global.TEST_BASE_URL;

describe('Scores API', () => {
  let testScoreId: string;

  describe('GET /api/scores', () => {
    it('should return all scores', async () => {
      const response = await axios.get(`${BASE_URL}/api/scores`);
      const serializedResponse = serializeResponse(response);
      expect(serializedResponse.status).toBe(200);
      expect(Array.isArray(serializedResponse.data)).toBe(true);
      
      // Check structure of scores data
      if (serializedResponse.data.length > 0) {
        const score = serializedResponse.data[0];
        expect(score).toHaveProperty('matchId');
        expect(score).toHaveProperty('playerId');
        expect(score).toHaveProperty('score');
        expect(score).toHaveProperty('date');
      }
    });
  });

  describe('POST /api/scores', () => {
    it('should create a new score', async () => {
      const newScore = {
        matchId: 'test-match-id',
        playerId: 'test-player-id',
        score: 72,
        date: new Date().toISOString()
      };
      
      const response = await axios.post(`${BASE_URL}/api/scores`, newScore);
      const serializedResponse = serializeResponse(response);
      expect(serializedResponse.status).toBe(201);
      expect(serializedResponse.data).toHaveProperty('id');
      testScoreId = serializedResponse.data.id;
    });
  });

  describe('GET /api/scores/:id', () => {
    it('should return a specific score', async () => {
      const response = await axios.get(`${BASE_URL}/api/scores/${testScoreId}`);
      const serializedResponse = serializeResponse(response);
      expect(serializedResponse.status).toBe(200);
      expect(serializedResponse.data).toHaveProperty('id', testScoreId);
    });
  });

  describe('PUT /api/scores/:id', () => {
    it('should update a score', async () => {
      const updatedScore = {
        score: 75
      };
      
      const response = await axios.put(`${BASE_URL}/api/scores/${testScoreId}`, updatedScore);
      const serializedResponse = serializeResponse(response);
      expect(serializedResponse.status).toBe(200);
      expect(serializedResponse.data.score).toBe(75);
    });
  });

  describe('DELETE /api/scores/:id', () => {
    it('should delete a score', async () => {
      const response = await axios.delete(`${BASE_URL}/api/scores/${testScoreId}`);
      const serializedResponse = serializeResponse(response);
      expect(serializedResponse.status).toBe(200);
    });
  });
}); 