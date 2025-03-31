/**
 * This script adds an extra point to the match winner for all completed matches.
 * It checks the total points for each match and adds 1 point to the team with the higher score.
 * 
 * To run against production:
 * NEXT_PUBLIC_SUPABASE_URL=<production-url> SUPABASE_SERVICE_ROLE_KEY=<production-key> node scripts/fix-match-winner-points.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Check if we're running against production
const isProd = supabaseUrl.includes('production') || process.env.NODE_ENV === 'production';
console.log(`Running against ${isProd ? 'PRODUCTION' : 'DEVELOPMENT'} environment`);

async function main() {
  try {
    console.log('Fetching completed matches...');
    
    // Get all completed matches
    const { data: matches, error: matchesError } = await supabase
      .from('Match')
      .select('id, homeTeamId, awayTeamId, status, date, homeTeam:homeTeamId(name), awayTeam:awayTeamId(name)')
      .eq('status', 'COMPLETED');
    
    if (matchesError) {
      throw new Error(`Error fetching matches: ${matchesError.message}`);
    }
    
    console.log(`Found ${matches.length} completed matches`);
    
    let updatedCount = 0;
    
    // Process each match
    for (const match of matches) {
      console.log(`\nProcessing match ${match.id}: ${match.homeTeam?.name} vs ${match.awayTeam?.name} (${match.date})`);
      
      // Get match points for this match
      const { data: matchPoints, error: matchPointsError } = await supabase
        .from('MatchPoints')
        .select('*')
        .eq('matchId', match.id)
        .is('hole', null); // Get total points (not hole-specific points)
      
      if (matchPointsError) {
        console.error(`Error fetching match points for match ${match.id}: ${matchPointsError.message}`);
        continue;
      }
      
      if (!matchPoints || matchPoints.length === 0) {
        console.log(`No match points found for match ${match.id}, skipping...`);
        continue;
      }
      
      // Process match points
      for (const points of matchPoints) {
        console.log(`Current points - Home: ${points.homePoints}, Away: ${points.awayPoints}`);
        
        // Determine the winner and add an extra point
        let homePoints = points.homePoints;
        let awayPoints = points.awayPoints;
        let updated = false;
        
        // Check if total points is 9 (no winner point added yet) or 10 (winner point already added)
        const totalPoints = homePoints + awayPoints;
        
        if (totalPoints === 9) {
          // Winner point not added yet - determine winner and add point
          if (homePoints > awayPoints) {
            homePoints += 1;
            updated = true;
            console.log(`Home team won - adding extra point. New points - Home: ${homePoints}, Away: ${awayPoints}`);
          } 
          else if (awayPoints > homePoints) {
            awayPoints += 1;
            updated = true;
            console.log(`Away team won - adding extra point. New points - Home: ${homePoints}, Away: ${awayPoints}`);
          }
          else {
            console.log(`Match tied - no extra point added.`);
          }
        } else if (totalPoints === 10) {
          // Check if the winner point is assigned to the correct team
          if (homePoints > awayPoints && homePoints - awayPoints === 1) {
            console.log(`Winner point already correctly assigned to home team.`);
          } 
          else if (awayPoints > homePoints && awayPoints - homePoints === 1) {
            console.log(`Winner point already correctly assigned to away team.`);
          }
          else if (homePoints === awayPoints) {
            // Tied match should have 9 total points, not 10
            console.log(`Match appears to be tied but has 10 points - fixing...`);
            if (homePoints > 4.5) {
              homePoints -= 0.5;
              awayPoints -= 0.5;
              updated = true;
            }
          }
          else {
            // Winner point assigned to wrong team
            console.log(`Winner point appears to be assigned to wrong team - fixing...`);
            if (homePoints > awayPoints + 1) {
              // Home has too many points
              homePoints -= 1;
              awayPoints += 1;
              updated = true;
            } else if (awayPoints > homePoints + 1) {
              // Away has too many points
              awayPoints -= 1;
              homePoints += 1;
              updated = true;
            }
          }
        } else {
          console.log(`Unusual total points (${totalPoints}) - should be 9 or 10. Fixing...`);
          // Try to fix unusual point totals
          if (Math.abs(homePoints - awayPoints) <= 1) {
            // Points are close, probably just need to normalize to 9 or 10 total
            const originalHome = homePoints;
            const originalAway = awayPoints;
            
            if (homePoints > awayPoints) {
              // Home team winning
              homePoints = 5;
              awayPoints = 4;
              updated = true;
            } else if (awayPoints > homePoints) {
              // Away team winning
              homePoints = 4;
              awayPoints = 5;
              updated = true;
            } else {
              // Tied
              homePoints = 4.5;
              awayPoints = 4.5;
              updated = true;
            }
            console.log(`Normalized points from Home: ${originalHome}, Away: ${originalAway} to Home: ${homePoints}, Away: ${awayPoints}`);
          }
        }
        
        // Update the match points if needed
        if (updated) {
          const { error: updateError } = await supabase
            .from('MatchPoints')
            .update({
              homePoints: homePoints,
              awayPoints: awayPoints,
              updatedAt: new Date().toISOString()
            })
            .eq('id', points.id);
          
          if (updateError) {
            console.error(`Error updating match points for match ${match.id}: ${updateError.message}`);
          } else {
            console.log(`✅ Successfully updated match points for match ${match.id}`);
            updatedCount++;
          }
        } else {
          console.log(`No update needed for match ${match.id}`);
        }
      }
    }
    
    console.log(`\n✅ Added winner points to ${updatedCount} matches`);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
