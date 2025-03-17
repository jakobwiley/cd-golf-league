import axios from 'axios';

const BASE_URL = global.TEST_BASE_URL;

describe('Teams API', () => {
  let testTeamId: string;

  describe('GET /api/teams', () => {
    it('should return all teams', async () => {
      const response = await axios.get(`${BASE_URL}/api/teams`);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
    });
  });

  describe('POST /api/teams', () => {
    it('should create a new team', async () => {
      const newTeam = {
        name: 'Test Team',
        players: []
      };

      const response = await axios.post(`${BASE_URL}/api/teams`, newTeam);
      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty('id');
      expect(response.data.name).toBe(newTeam.name);
      testTeamId = response.data.id;
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

      expect(response.status).toBe(200);
      expect(response.data.name).toBe(updatedTeam.name);
    });
  });

  describe('DELETE /api/teams', () => {
    it('should delete a team', async () => {
      const response = await axios.delete(`${BASE_URL}/api/teams?id=${testTeamId}`);
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('message', 'Team deleted successfully');
    });
  });
}); 