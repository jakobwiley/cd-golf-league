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

describe('Schedule API', () => {
  let testScheduleId: string;

  describe('GET /api/schedule', () => {
    it('should return the current schedule', async () => {
      const response = await axios.get(`${BASE_URL}/api/schedule`);
      const serializedResponse = serializeResponse(response);
      expect(serializedResponse.status).toBe(200);
      expect(Array.isArray(serializedResponse.data)).toBe(true);
      
      // Check structure of schedule data
      if (serializedResponse.data.length > 0) {
        const match = serializedResponse.data[0];
        expect(match).toHaveProperty('id');
        expect(match).toHaveProperty('date');
        expect(match).toHaveProperty('location');
        expect(match).toHaveProperty('status');
      }
    });
  });

  describe('POST /api/schedule', () => {
    it('should create a new schedule entry', async () => {
      const newSchedule = {
        date: new Date().toISOString(),
        location: 'Test Golf Course',
        teams: ['team1', 'team2'],
        status: 'scheduled'
      };

      const response = await axios.post(`${BASE_URL}/api/schedule`, newSchedule);
      const serializedResponse = serializeResponse(response);
      expect(serializedResponse.status).toBe(200);
      expect(serializedResponse.data).toHaveProperty('id');
      expect(serializedResponse.data.location).toBe(newSchedule.location);
      testScheduleId = serializedResponse.data.id;
    });
  });

  describe('PUT /api/schedule', () => {
    it('should update a schedule entry', async () => {
      const updatedSchedule = {
        date: new Date().toISOString(),
        location: 'Updated Golf Course',
        teams: ['team1', 'team2'],
        status: 'completed'
      };

      const response = await axios.put(`${BASE_URL}/api/schedule`, {
        id: testScheduleId,
        ...updatedSchedule
      });
      const serializedResponse = serializeResponse(response);
      expect(serializedResponse.status).toBe(200);
      expect(serializedResponse.data.location).toBe(updatedSchedule.location);
      expect(serializedResponse.data.status).toBe(updatedSchedule.status);
    });
  });

  describe('DELETE /api/schedule', () => {
    it('should delete a schedule entry', async () => {
      const response = await axios.delete(`${BASE_URL}/api/schedule?id=${testScheduleId}`);
      const serializedResponse = serializeResponse(response);
      expect(serializedResponse.status).toBe(200);
      expect(serializedResponse.data).toHaveProperty('message', 'Schedule entry deleted successfully');
    });
  });
}); 