import axios from 'axios';
import { TEST_BASE_URL } from '../jest.setup';

describe('Weekly Schedule API', () => {
  it('should return the correct weekly schedule', async () => {
    const response = await axios.get(`${TEST_BASE_URL}/api/schedule`);
    
    expect(response.status).toBe(200);
    expect(response.data).toBeDefined();
    
    // Validate schedule structure
    const schedule = response.data;
    expect(schedule).toHaveProperty('week');
    expect(schedule).toHaveProperty('matches');
    
    // Validate matches
    const matches = schedule.matches;
    expect(Array.isArray(matches)).toBe(true);
    
    // Each match should have required properties
    matches.forEach(match => {
      expect(match).toHaveProperty('id');
      expect(match).toHaveProperty('date');
      expect(match).toHaveProperty('players');
      expect(match).toHaveProperty('scores');
    });
  });

  it('should return matches for a specific week', async () => {
    const week = 1; // Test with week 1
    const response = await axios.get(`${TEST_BASE_URL}/api/schedule?week=${week}`);
    
    expect(response.status).toBe(200);
    expect(response.data.week).toBe(week);
  });

  it('should handle invalid week numbers', async () => {
    try {
      await axios.get(`${TEST_BASE_URL}/api/schedule?week=999`);
      fail('Should have thrown an error');
    } catch (error) {
      expect(error.response.status).toBe(400);
    }
  });
}); 