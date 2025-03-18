import { PrismaClient } from '@prisma/client';
// Import the data files
const teams = require('./data/teams').default;
const players = require('./data/players').default;
const schedule = require('./data/schedule').default;

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Starting Supabase database seeding...');
    
    // Create teams
    console.log('Creating teams...');
    for (const team of teams) {
      await prisma.team.create({
        data: {
          id: team.id,
          name: team.name
        }
      });
    }
    console.log(`Created ${teams.length} teams.`);

    // Create players
    console.log('Creating players...');
    for (const player of players) {
      await prisma.player.create({
        data: {
          name: player.name,
          handicapIndex: player.handicapIndex,
          teamId: player.teamId,
          playerType: 'PRIMARY'
        }
      });
    }
    console.log(`Created ${players.length} players.`);

    // Create matches from schedule
    console.log('Creating matches...');
    let matchCount = 0;
    
    for (const week of schedule) {
      for (const match of week.matches) {
        await prisma.match.create({
          data: {
            weekNumber: week.weekNumber,
            date: week.date,
            homeTeamId: match.homeTeamId,
            awayTeamId: match.awayTeamId,
            startingHole: match.startingHole,
            status: 'SCHEDULED'
          }
        });
        matchCount++;
      }
    }
    console.log(`Created ${matchCount} matches.`);

    console.log('Seed data created successfully!');
  } catch (error) {
    console.error('Error in seed script:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// If running this script directly
if (require.main === module) {
  main()
    .catch((e) => {
      console.error('Error seeding data:', e);
      process.exit(1);
    });
}

export default main; 