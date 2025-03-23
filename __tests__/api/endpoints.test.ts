import request from 'supertest';
import { NextApiRequest, NextApiResponse } from 'next';

// Base URL for testing
const baseUrl = process.env.TEST_BASE_URL || 'http://localhost:3000';

describe('API Endpoints', () => {
  // Test the teams endpoint
  describe('GET /api/teams', () => {
    it('returns a list of teams', async () => {
      const response = await request(baseUrl).get('/api/teams');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('teams');
      expect(Array.isArray(response.body.teams)).toBe(true);
    });
  });

  // Test the players endpoint
  describe('GET /api/players', () => {
    it('returns a list of players', async () => {
      const response = await request(baseUrl).get('/api/players');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('players');
      expect(Array.isArray(response.body.players)).toBe(true);
    });

    it('returns players for a specific team when teamId is provided', async () => {
      // First get a valid team ID
      const teamsResponse = await request(baseUrl).get('/api/teams');
      const teamId = teamsResponse.body.teams[0]?.id;
      
      if (teamId) {
        const response = await request(baseUrl).get(`/api/players?teamId=${teamId}`);
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('players');
        expect(Array.isArray(response.body.players)).toBe(true);
        
        // All returned players should belong to the specified team
        response.body.players.forEach((player: any) => {
          expect(player.teamId).toBe(teamId);
        });
      } else {
        console.warn('No teams found to test player filtering');
      }
    });
  });

  // Test the matches endpoint
  describe('GET /api/matches', () => {
    it('returns a list of matches', async () => {
      const response = await request(baseUrl).get('/api/matches');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('matches');
      expect(Array.isArray(response.body.matches)).toBe(true);
    });

    it('returns a specific match when matchId is provided', async () => {
      // First get a valid match ID
      const matchesResponse = await request(baseUrl).get('/api/matches');
      const matchId = matchesResponse.body.matches[0]?.id;
      
      if (matchId) {
        const response = await request(baseUrl).get(`/api/matches/${matchId}`);
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('match');
        expect(response.body.match.id).toBe(matchId);
      } else {
        console.warn('No matches found to test match retrieval');
      }
    });
  });

  // Test the scores endpoint
  describe('GET /api/scores', () => {
    it('returns scores for a match when matchId is provided', async () => {
      // First get a valid match ID
      const matchesResponse = await request(baseUrl).get('/api/matches');
      const matchId = matchesResponse.body.matches[0]?.id;
      
      if (matchId) {
        const response = await request(baseUrl).get(`/api/scores?matchId=${matchId}`);
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('scores');
      } else {
        console.warn('No matches found to test scores retrieval');
      }
    });
  });

  // Test the standings endpoint
  describe('GET /api/standings', () => {
    it('returns the current standings', async () => {
      const response = await request(baseUrl).get('/api/standings');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('standings');
      expect(Array.isArray(response.body.standings)).toBe(true);
    });
  });

  // Test error handling
  describe('Error Handling', () => {
    it('returns 404 for non-existent endpoints', async () => {
      const response = await request(baseUrl).get('/api/nonexistent-endpoint');
      
      expect(response.status).toBe(404);
    });

    it('returns 404 for non-existent match', async () => {
      const response = await request(baseUrl).get('/api/matches/nonexistent-id');
      
      expect(response.status).toBe(404);
    });
  });
});
