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

describe('Standings API', () => {
  describe('GET /api/standings', () => {
    it('should return current standings', async () => {
      const response = await axios.get(`${BASE_URL}/api/standings`);
      const serializedResponse = serializeResponse(response);
      expect(serializedResponse.status).toBe(200);
      expect(Array.isArray(serializedResponse.data)).toBe(true);
      
      // Check structure of standings data
      if (serializedResponse.data.length > 0) {
        const standing = serializedResponse.data[0];
        expect(standing).toHaveProperty('teamId');
        expect(standing).toHaveProperty('teamName');
        expect(standing).toHaveProperty('wins');
        expect(standing).toHaveProperty('losses');
        expect(standing).toHaveProperty('points');
      }
    });
  });

  describe('GET /api/standings/history', () => {
    it('should return standings history', async () => {
      const response = await axios.get(`${BASE_URL}/api/standings/history`);
      const serializedResponse = serializeResponse(response);
      expect(serializedResponse.status).toBe(200);
      expect(Array.isArray(serializedResponse.data)).toBe(true);
      
      // Check structure of history data
      if (serializedResponse.data.length > 0) {
        const historyEntry = serializedResponse.data[0];
        expect(historyEntry).toHaveProperty('date');
        expect(historyEntry).toHaveProperty('standings');
        expect(Array.isArray(historyEntry.standings)).toBe(true);
      }
    });
  });
}); 