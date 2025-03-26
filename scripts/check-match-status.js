/**
 * Script to check the status of a specific match in production
 * and verify if all holes have scores filled out
 */

const fetch = require('node-fetch');

// Match ID to check
const MATCH_ID = '97e38f37-b5cd-4604-a60d-8f08183345d2';

// Production URL
const PROD_URL = process.env.PROD_URL || 'https://cd-golf-league-2025-5hqeen0s3-jakes-projects-9070cd0b.vercel.app';

async function checkMatchStatus() {
  console.log(`🔍 Checking match status for ID: ${MATCH_ID}`);
  console.log(`🌐 Using production URL: ${PROD_URL}`);
  
  try {
    // Get match details
    const matchResponse = await fetch(`${PROD_URL}/api/matches/${MATCH_ID}`);
    
    if (!matchResponse.ok) {
      throw new Error(`Failed to fetch match: ${matchResponse.status} ${matchResponse.statusText}`);
    }
    
    const match = await matchResponse.json();
    
    console.log('\n📋 Match Details:');
    console.log(`- ID: ${match.id}`);
    console.log(`- Date: ${match.date}`);
    console.log(`- Status: ${match.status}`);
    console.log(`- Team 1: ${match.team1?.name || 'Unknown'}`);
    console.log(`- Team 2: ${match.team2?.name || 'Unknown'}`);
    
    // Get scores for the match
    const scoresResponse = await fetch(`${PROD_URL}/api/scores?matchId=${MATCH_ID}`);
    
    if (!scoresResponse.ok) {
      throw new Error(`Failed to fetch scores: ${scoresResponse.status} ${scoresResponse.statusText}`);
    }
    
    const scores = await scoresResponse.json();
    
    console.log('\n📊 Score Details:');
    
    // Group scores by player
    const playerScores = {};
    
    scores.forEach(score => {
      if (!playerScores[score.playerId]) {
        playerScores[score.playerId] = {
          playerName: score.player?.name || 'Unknown Player',
          scores: []
        };
      }
      
      playerScores[score.playerId].scores.push({
        hole: score.hole,
        score: score.score
      });
    });
    
    // Check if all players have scores for all 9 holes
    let allHolesFilled = true;
    const playerDetails = [];
    
    Object.keys(playerScores).forEach(playerId => {
      const player = playerScores[playerId];
      const holesFilled = player.scores.length;
      const missingHoles = 9 - holesFilled;
      
      console.log(`- ${player.playerName}: ${holesFilled}/9 holes filled`);
      
      if (holesFilled < 9) {
        allHolesFilled = false;
        
        // List missing holes
        const filledHoleNumbers = player.scores.map(s => s.hole);
        const missingHoleNumbers = [];
        
        for (let i = 1; i <= 9; i++) {
          if (!filledHoleNumbers.includes(i)) {
            missingHoleNumbers.push(i);
          }
        }
        
        console.log(`  Missing holes: ${missingHoleNumbers.join(', ')}`);
      }
      
      // Show scores for each hole
      console.log('  Scores by hole:');
      for (let i = 1; i <= 9; i++) {
        const holeScore = player.scores.find(s => s.hole === i);
        console.log(`    Hole ${i}: ${holeScore ? holeScore.score : 'Not filled'}`);
      }
      
      playerDetails.push({
        playerId,
        playerName: player.playerName,
        holesFilled,
        missingHoles: 9 - holesFilled
      });
    });
    
    console.log('\n🧮 Summary:');
    console.log(`- Match status: ${match.status}`);
    console.log(`- All holes filled: ${allHolesFilled ? 'Yes ✅' : 'No ❌'}`);
    
    if (match.status.toLowerCase() === 'completed' || match.status.toLowerCase() === 'finalized') {
      if (!allHolesFilled) {
        console.log('\n⚠️ ISSUE DETECTED: Match is marked as COMPLETED/FINALIZED but not all holes are filled!');
        console.log('This is causing players to appear in standings incorrectly.');
      } else {
        console.log('\n✅ Match status is consistent with score data.');
      }
    } else if (allHolesFilled) {
      console.log('\n⚠️ ISSUE DETECTED: All holes are filled but match is not marked as COMPLETED/FINALIZED!');
    } else {
      console.log('\n✅ Match status is consistent with score data.');
    }
    
    return {
      match,
      playerDetails,
      allHolesFilled,
      hasIssue: (match.status.toLowerCase() === 'completed' || match.status.toLowerCase() === 'finalized') && !allHolesFilled
    };
    
  } catch (error) {
    console.error('Error checking match status:', error);
    return { error: error.message };
  }
}

// Run the check if this script is executed directly
if (require.main === module) {
  checkMatchStatus()
    .then(result => {
      if (result.error) {
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('Unexpected error:', error);
      process.exit(1);
    });
}

module.exports = { checkMatchStatus };
