/**
 * Test script to verify match points API in the preview deployment
 * 
 * This script tests the match-points API endpoint in the preview deployment
 * to ensure that CORS issues have been fixed and match points can be saved correctly.
 * 
 * Usage:
 * node test-preview-match-points.js [preview-url] [match-id]
 * 
 * Example:
 * node test-preview-match-points.js https://your-preview-url.vercel.app 123e4567-e89b-12d3-a456-426614174000
 */

// Parse command line arguments
const args = process.argv.slice(2);
const previewUrl = args[0] || process.env.PREVIEW_URL || 'https://cd-golf-league-2025-4nwx1n8zf-jakes-projects-9070cd0b.vercel.app';
const matchId = args[1] || process.env.MATCH_ID || 'c0143847-3724-4aab-a7c1-8ccce93ab92f'; // Valid match ID

// Configuration
const apiEndpoint = `${previewUrl}/api/match-points`;

// Test data
const testData = {
  matchId: matchId,
  totalPoints: {
    home: 10,
    away: 8
  },
  holePoints: {
    "1": { home: 1, away: 0 },
    "2": { home: 0.5, away: 0.5 },
    "3": { home: 0, away: 1 },
    "4": { home: 1, away: 0 },
    "5": { home: 1, away: 0 },
    "6": { home: 0, away: 1 },
    "7": { home: 1, away: 0 },
    "8": { home: 0.5, away: 0.5 },
    "9": { home: 1, away: 0 }
  }
};

// Function to test saving match points
async function testSaveMatchPoints() {
  console.log(`Testing match points API at: ${apiEndpoint}`);
  console.log('Test data:', JSON.stringify(testData, null, 2));
  
  try {
    console.log('Sending POST request...');
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': previewUrl
      },
      body: JSON.stringify(testData)
    });
    
    console.log(`Response status: ${response.status}`);
    console.log('Response headers:', Object.fromEntries([...response.headers.entries()]));
    
    // Get response body as text first
    const responseText = await response.text();
    
    // Try to parse as JSON if possible
    try {
      const data = JSON.parse(responseText);
      console.log('Response data:', JSON.stringify(data, null, 2));
      
      if (response.ok) {
        console.log('✅ Test passed: Successfully saved match points');
      } else {
        console.log('❌ Test failed: Could not save match points');
      }
      
      return { success: response.ok, data };
    } catch (jsonError) {
      console.log('Response text (not JSON):', responseText);
      console.log('❌ Test failed: Response was not valid JSON');
      return { success: false, error: jsonError, text: responseText };
    }
  } catch (error) {
    console.error('❌ Test failed with error:', error);
    return { success: false, error };
  }
}

// Function to test retrieving match points
async function testGetMatchPoints() {
  const url = `${apiEndpoint}?matchId=${matchId}`;
  console.log(`Testing GET match points from: ${url}`);
  
  try {
    console.log('Sending GET request...');
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Origin': previewUrl
      }
    });
    
    console.log(`Response status: ${response.status}`);
    console.log('Response headers:', Object.fromEntries([...response.headers.entries()]));
    
    // Get response body as text first
    const responseText = await response.text();
    
    // Try to parse as JSON if possible
    try {
      const data = JSON.parse(responseText);
      console.log('Response data:', JSON.stringify(data, null, 2));
      
      if (response.ok) {
        console.log('✅ Test passed: Successfully retrieved match points');
      } else {
        console.log('❌ Test failed: Could not retrieve match points');
      }
      
      return { success: response.ok, data };
    } catch (jsonError) {
      console.log('Response text (not JSON):', responseText);
      console.log('❌ Test failed: Response was not valid JSON');
      return { success: false, error: jsonError, text: responseText };
    }
  } catch (error) {
    console.error('❌ Test failed with error:', error);
    return { success: false, error };
  }
}

// Run the tests
async function runTests() {
  console.log('=== Testing Match Points API in Preview Deployment ===');
  console.log(`Preview URL: ${previewUrl}`);
  console.log(`Match ID: ${matchId}`);
  console.log('=== Starting tests ===\n');
  
  // Test saving match points
  console.log('Test 1: Saving match points');
  const saveResult = await testSaveMatchPoints();
  console.log('\n');
  
  // Test retrieving match points
  console.log('Test 2: Retrieving match points');
  const getResult = await testGetMatchPoints();
  console.log('\n');
  
  // Summary
  console.log('=== Test Summary ===');
  console.log(`Save Match Points: ${saveResult.success ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`Get Match Points: ${getResult.success ? '✅ PASSED' : '❌ FAILED'}`);
  console.log('=====================');
}

// Execute the tests
runTests().catch(error => {
  console.error('Error running tests:', error);
  process.exit(1);
});
