const fetch = require('node-fetch');

// URLs to test
const PROD_URL = 'https://cd-golf-league-2025.vercel.app';
const API_ENDPOINTS = [
  '/api/match-points',
  '/api/scores',
  '/api/matches'
];

async function testApiAccess() {
  console.log('Testing API access in production environment...');
  console.log(`Production URL: ${PROD_URL}`);
  
  // Get a valid match ID first
  try {
    console.log('\nFetching a valid match ID...');
    const matchesResponse = await fetch(`${PROD_URL}/api/matches`);
    const matches = await matchesResponse.json();
    
    if (matches && matches.length > 0) {
      const testMatch = matches[0];
      console.log(`Using match ID: ${testMatch.id}`);
      
      // Test match-points with the valid ID
      console.log('\nTesting GET /api/match-points with valid match ID...');
      const matchPointsResponse = await fetch(`${PROD_URL}/api/match-points?matchId=${testMatch.id}`);
      console.log(`Status: ${matchPointsResponse.status} ${matchPointsResponse.statusText}`);
      
      const matchPointsData = await matchPointsResponse.text();
      console.log(`Response body (first 200 chars): ${matchPointsData.substring(0, 200)}...`);
      
      // Test POST to match-points
      console.log('\nTesting POST to /api/match-points...');
      const postData = {
        matchId: testMatch.id,
        holePoints: {
          "1": { home: 1, away: 0 },
          "2": { home: 1, away: 0 },
          "3": { home: 1, away: 0 }
        },
        totalPoints: { home: 3, away: 0 }
      };
      
      const postResponse = await fetch(`${PROD_URL}/api/match-points`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36'
        },
        body: JSON.stringify(postData)
      });
      
      console.log(`Status: ${postResponse.status} ${postResponse.statusText}`);
      const postResponseText = await postResponse.text();
      console.log(`Response body: ${postResponseText}`);
      
      // Test scores API
      console.log('\nTesting POST to /api/scores...');
      const scoreData = {
        scores: [
          {
            matchId: testMatch.id,
            playerId: "test-player-id",
            hole: 3,
            score: 4
          }
        ]
      };
      
      const scoresResponse = await fetch(`${PROD_URL}/api/scores`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36'
        },
        body: JSON.stringify(scoreData)
      });
      
      console.log(`Status: ${scoresResponse.status} ${scoresResponse.statusText}`);
      const scoresResponseText = await scoresResponse.text();
      console.log(`Response body: ${scoresResponseText}`);
    } else {
      console.log('No matches found');
    }
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
}

testApiAccess().catch(console.error);
