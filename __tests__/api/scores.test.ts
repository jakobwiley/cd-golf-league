import axios from 'axios';

const BASE_URL = global.TEST_BASE_URL;

// Custom serializer to handle circular references
const serializeResponse = (response: any) => {
  const seen = new WeakSet();
  return JSON.parse(JSON.stringify(response, (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return '[Circular]';
      }
      seen.add(value);
    }
    return value;
  }));
};

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
      expect(serializedResponse.status).toBe(200);
      expect(serializedResponse.data).toHaveProperty('id');
      expect(serializedResponse.data.matchId).toBe(newScore.matchId);
      testScoreId = serializedResponse.data.id;
    });
  });

  describe('PUT /api/scores', () => {
    it('should update an existing score', async () => {
      const updatedScore = {
        id: testScoreId,
        matchId: 'test-match-id',
        playerId: 'test-player-id',
        score: 71,
        date: new Date().toISOString()
      };
      
      const response = await axios.put(`${BASE_URL}/api/scores`, updatedScore);
      const serializedResponse = serializeResponse(response);
      expect(serializedResponse.status).toBe(200);
      expect(serializedResponse.data.score).toBe(updatedScore.score);
    });
  });

  describe('DELETE /api/scores', () => {
    it('should delete a score', async () => {
      const response = await axios.delete(`${BASE_URL}/api/scores?id=${testScoreId}`);
      const serializedResponse = serializeResponse(response);
      expect(serializedResponse.status).toBe(200);
      expect(serializedResponse.data).toHaveProperty('message', 'Score deleted successfully');
    });
  });
}); 