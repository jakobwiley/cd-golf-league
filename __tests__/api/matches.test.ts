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

describe('Matches API', () => {
  let testMatchId: string;

  describe('GET /api/matches', () => {
    it('should return all matches', async () => {
      const response = await axios.get(`${BASE_URL}/api/matches`);
      const serializedResponse = serializeResponse(response);
      expect(serializedResponse.status).toBe(200);
      expect(Array.isArray(serializedResponse.data)).toBe(true);
      
      // Check structure of matches data
      if (serializedResponse.data.length > 0) {
        const match = serializedResponse.data[0];
        expect(match).toHaveProperty('id');
        expect(match).toHaveProperty('date');
        expect(match).toHaveProperty('location');
        expect(match).toHaveProperty('status');
        expect(match).toHaveProperty('teams');
      }
    });
  });

  describe('POST /api/matches', () => {
    it('should create a new match', async () => {
      const newMatch = {
        date: new Date().toISOString(),
        location: 'Test Golf Course',
        status: 'scheduled',
        teams: []
      };

      const response = await axios.post(`${BASE_URL}/api/matches`, newMatch);
      const serializedResponse = serializeResponse(response);
      expect(serializedResponse.status).toBe(200);
      expect(serializedResponse.data).toHaveProperty('id');
      expect(serializedResponse.data.location).toBe(newMatch.location);
      testMatchId = serializedResponse.data.id;
    });
  });

  describe('PUT /api/matches', () => {
    it('should update an existing match', async () => {
      const updatedMatch = {
        date: new Date().toISOString(),
        location: 'Updated Golf Course',
        status: 'completed',
        teams: []
      };

      const response = await axios.put(`${BASE_URL}/api/matches`, {
        id: testMatchId,
        ...updatedMatch
      });
      const serializedResponse = serializeResponse(response);
      expect(serializedResponse.status).toBe(200);
      expect(serializedResponse.data.location).toBe(updatedMatch.location);
      expect(serializedResponse.data.status).toBe(updatedMatch.status);
    });
  });

  describe('DELETE /api/matches', () => {
    it('should delete a match', async () => {
      const response = await axios.delete(`${BASE_URL}/api/matches?id=${testMatchId}`);
      const serializedResponse = serializeResponse(response);
      expect(serializedResponse.status).toBe(200);
      expect(serializedResponse.data).toHaveProperty('message', 'Match deleted successfully');
    });
  });
}); 