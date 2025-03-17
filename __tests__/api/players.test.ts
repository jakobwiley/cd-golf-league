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
        expect(player).toHaveProperty('handicap');
        expect(player).toHaveProperty('teamId');
      }
    });
  });

  describe('POST /api/players', () => {
    it('should create a new player', async () => {
      const newPlayer = {
        name: 'Test Player',
        handicap: 10,
        teamId: null
      };

      const response = await axios.post(`${BASE_URL}/api/players`, newPlayer);
      const serializedResponse = serializeResponse(response);
      expect(serializedResponse.status).toBe(200);
      expect(serializedResponse.data).toHaveProperty('id');
      expect(serializedResponse.data.name).toBe(newPlayer.name);
      testPlayerId = serializedResponse.data.id;
    });
  });

  describe('PUT /api/players', () => {
    it('should update an existing player', async () => {
      const updatedPlayer = {
        name: 'Updated Test Player',
        handicap: 12,
        teamId: null
      };

      const response = await axios.put(`${BASE_URL}/api/players`, {
        id: testPlayerId,
        ...updatedPlayer
      });
      const serializedResponse = serializeResponse(response);
      expect(serializedResponse.status).toBe(200);
      expect(serializedResponse.data.name).toBe(updatedPlayer.name);
      expect(serializedResponse.data.handicap).toBe(updatedPlayer.handicap);
    });
  });

  describe('DELETE /api/players', () => {
    it('should delete a player', async () => {
      const response = await axios.delete(`${BASE_URL}/api/players?id=${testPlayerId}`);
      const serializedResponse = serializeResponse(response);
      expect(serializedResponse.status).toBe(200);
      expect(serializedResponse.data).toHaveProperty('message', 'Player deleted successfully');
    });
  });
}); 