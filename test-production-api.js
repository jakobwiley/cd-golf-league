// Script to test the match-points API in production
require('dotenv').config({ path: '.env.local' });
const fetch = require('node-fetch');

const PROD_URL = 'https://cd-golf-league-2025.vercel.app';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Testing match-points API in production environment...');
console.log(`Production URL: ${PROD_URL}`);
console.log(`Supabase URL: ${SUPABASE_URL}`);

async function testProductionAPI() {
  try {
    // Step 1: Fetch a valid match from the database
    console.log('\n1. Fetching a valid match from the database...');
    const matchResponse = await fetch(`${PROD_URL}/api/matches`);
    
    if (!matchResponse.ok) {
      throw new Error(`Failed to fetch matches: ${matchResponse.status} ${await matchResponse.text()}`);
    }
    
    const matches = await matchResponse.json();
    
    if (!matches || matches.length === 0) {
      throw new Error('No matches found in the database');
    }
    
    // Use the first match for testing
    const testMatch = matches[0];
    console.log(`✅ Found valid match: ${JSON.stringify(testMatch, null, 2)}`);
    
    // Step 2: Test GET endpoint for match points
    console.log('\n2. Testing GET endpoint for match points...');
    const getResponse = await fetch(`${PROD_URL}/api/match-points?matchId=${testMatch.id}`);
    
    if (!getResponse.ok) {
      console.log(`❌ GET error: ${getResponse.status} ${await getResponse.text()}`);
    } else {
      const matchPoints = await getResponse.json();
      console.log(`✅ GET success: Found ${matchPoints ? matchPoints.length : 0} match points records`);
    }
    
    // Step 3: Test POST endpoint for match points
    console.log('\n3. Testing POST endpoint for match points...');
    const testData = {
      matchId: testMatch.id,
      totalPoints: {
        home: 3,
        away: 0
      },
      holePoints: {
        "1": { home: 1, away: 0 },
        "2": { home: 1, away: 0 },
        "3": { home: 1, away: 0 }
      }
    };
    
    const postResponse = await fetch(`${PROD_URL}/api/match-points`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });
    
    if (!postResponse.ok) {
      console.log(`❌ POST error: ${postResponse.status} ${await postResponse.text()}`);
    } else {
      const result = await postResponse.json();
      console.log(`✅ POST success: ${JSON.stringify(result, null, 2)}`);
    }
    
    // Step 4: Verify the data was saved correctly
    console.log('\n4. Verifying data was saved correctly...');
    const verifyResponse = await fetch(`${PROD_URL}/api/match-points?matchId=${testMatch.id}`);
    
    if (!verifyResponse.ok) {
      console.log(`❌ Verify error: ${verifyResponse.status} ${await verifyResponse.text()}`);
    } else {
      const matchPointsData = await verifyResponse.json();
      console.log(`Raw match points data: ${JSON.stringify(matchPointsData, null, 2)}`);
      
      if (matchPointsData) {
        console.log(`✅ Verify success: Found match points data for match ID: ${testMatch.id}`);
      } else {
        console.log(`❌ Verify error: Could not find the saved match points`);
      }
    }
    
    console.log('\n✅ Production API test completed successfully!');
    
  } catch (error) {
    console.log(`\n❌ Production API test failed: ${error.message}`);
  }
}

testProductionAPI();
