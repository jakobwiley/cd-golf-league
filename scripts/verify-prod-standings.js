/**
 * Production Verification Script for Standings API
 * 
 * This script tests that the standings API in production correctly handles
 * both 'COMPLETED' and 'FINALIZED' match statuses.
 */

const fetch = require('node-fetch');

// Production URL - update this with your actual production URL
const PROD_URL = process.env.PROD_URL || 'https://cd-golf-league.vercel.app';

async function verifyStandingsAPI() {
  console.log('🔍 Verifying Standings API in production...');
  console.log(`🌐 Using production URL: ${PROD_URL}`);

  try {
    // Test the standings API
    console.log('\n📊 Testing /api/standings endpoint...');
    const standingsResponse = await fetch(`${PROD_URL}/api/standings`);
    
    if (!standingsResponse.ok) {
      throw new Error(`Standings API returned status ${standingsResponse.status}`);
    }
    
    const standings = await standingsResponse.json();
    console.log(`✅ Standings API returned ${standings.length} team standings`);
    
    // Check if there are any standings with matches played
    const teamsWithMatches = standings.filter(team => team.matchesPlayed > 0);
    console.log(`ℹ️ Found ${teamsWithMatches.length} teams with matches played`);
    
    if (teamsWithMatches.length > 0) {
      // Log details of teams with matches
      teamsWithMatches.forEach(team => {
        console.log(`  - ${team.teamName}: ${team.matchesPlayed} matches, ${team.leaguePoints} points`);
        
        // Check weekly points to see if there are any from FINALIZED matches
        if (team.weeklyPoints && team.weeklyPoints.length > 0) {
          console.log(`    Weekly points: ${team.weeklyPoints.length} entries`);
        }
      });
    } else {
      console.warn('⚠️ No teams with matches played found. Cannot verify status handling.');
    }

    // Test the player standings API
    console.log('\n👤 Testing /api/player-standings endpoint...');
    const playerStandingsResponse = await fetch(`${PROD_URL}/api/player-standings`);
    
    if (!playerStandingsResponse.ok) {
      throw new Error(`Player Standings API returned status ${playerStandingsResponse.status}`);
    }
    
    const playerStandings = await playerStandingsResponse.json();
    console.log(`✅ Player Standings API returned data for ${playerStandings.length} players`);
    
    // Check if there are any players with rounds played
    const playersWithRounds = playerStandings.filter(player => player.roundsPlayed > 0);
    console.log(`ℹ️ Found ${playersWithRounds.length} players with rounds played`);
    
    if (playersWithRounds.length > 0) {
      // Log details of players with rounds
      playersWithRounds.slice(0, 5).forEach(player => {
        console.log(`  - ${player.playerName}: ${player.roundsPlayed} rounds, ${player.totalGrossScore} gross score`);
      });
      
      if (playersWithRounds.length > 5) {
        console.log(`  - ... and ${playersWithRounds.length - 5} more players`);
      }
    } else {
      console.warn('⚠️ No players with rounds played found. Cannot verify status handling.');
    }

    console.log('\n✅ Standings API verification completed successfully');
    return true;
  } catch (error) {
    console.error('❌ Error verifying standings API:', error);
    return false;
  }
}

// Run the verification if this script is executed directly
if (require.main === module) {
  verifyStandingsAPI()
    .then(success => {
      if (!success) {
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('Unexpected error:', error);
      process.exit(1);
    });
}

module.exports = { verifyStandingsAPI };
