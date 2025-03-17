const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    // First, clear existing data if tables exist
    try {
      await prisma.matchScore.deleteMany()
    } catch (e) {
      console.log('MatchScore table does not exist yet');
    }
    try {
      await prisma.matchPoints.deleteMany()
    } catch (e) {
      console.log('MatchPoints table does not exist yet');
    }
    try {
      await prisma.matchPlayer.deleteMany()
    } catch (e) {
      console.log('MatchPlayer table does not exist yet');
    }
    try {
      await prisma.match.deleteMany()
    } catch (e) {
      console.log('Match table does not exist yet');
    }
    try {
      await prisma.player.deleteMany()
    } catch (e) {
      console.log('Player table does not exist yet');
    }
    try {
      await prisma.team.deleteMany()
    } catch (e) {
      console.log('Team table does not exist yet');
    }

    // Create teams
    const teams = [
      { id: 'team1', name: 'Team 1' },
      { id: 'team2', name: 'Team 2' },
      { id: 'team3', name: 'Team 3' },
      { id: 'team4', name: 'Team 4' },
      { id: 'team5', name: 'Team 5' },
      { id: 'team6', name: 'Team 6' },
      { id: 'team7', name: 'Team 7' },
      { id: 'team8', name: 'Team 8' },
      { id: 'team9', name: 'Team 9' },
      { id: 'team10', name: 'Team 10' }
    ];

    for (const team of teams) {
      await prisma.team.create({
        data: {
          id: team.id,
          name: team.name
        }
      });
    }

    // Create players (2 per team)
    for (const team of teams) {
      for (let i = 1; i <= 2; i++) {
        await prisma.player.create({
          data: {
            name: `${team.name} Player ${i}`,
            teamId: team.id,
            handicapIndex: Math.random() * 20,
            playerType: 'PRIMARY'
          }
        });
      }
    }

    // Create matches for week 1
    const startDate = new Date('2024-04-01');
    const startingHoles = [1, 4, 7, 10, 13];

    for (let i = 0; i < 5; i++) {
      const homeTeamId = teams[i * 2].id;
      const awayTeamId = teams[i * 2 + 1].id;

      await prisma.match.create({
        data: {
          weekNumber: 1,
          date: startDate,
          homeTeamId,
          awayTeamId,
          startingHole: startingHoles[i],
          status: 'SCHEDULED'
        }
      });
    }

    console.log('Seed data created successfully');
  } catch (error) {
    console.error('Error in seed script:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// If running this script directly (not through require)
if (require.main === module) {
  main()
    .catch((e) => {
      console.error('Error seeding data:', e);
      process.exit(1);
    });
}

module.exports = main; 
module.exports = main; 