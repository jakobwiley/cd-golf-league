const { PrismaClient } = require('@prisma/client');

// Create a fresh Prisma client
const prisma = new PrismaClient();

// Example team data
const teams = [
  { id: 'team-1', name: 'Fairway Hackers' },
  { id: 'team-2', name: 'Hole in Ones' },
  { id: 'team-3', name: 'Bunker Boys' },
  { id: 'team-4', name: 'Slice Masters' },
  { id: 'team-5', name: 'Green Goblins' },
  { id: 'team-6', name: 'Bogey Brigade' },
  { id: 'team-7', name: 'Par-tners' },
  { id: 'team-8', name: 'Eagle Hunters' },
  { id: 'team-9', name: 'Birdie Chasers' },
  { id: 'team-10', name: 'Rough Riders' }
];

// Example player data
const players = [
  { name: 'John Doe', handicapIndex: 14.2, teamId: 'team-1', playerType: 'PRIMARY' },
  { name: 'Jane Smith', handicapIndex: 8.5, teamId: 'team-1', playerType: 'PRIMARY' },
  { name: 'Michael Johnson', handicapIndex: 22.1, teamId: 'team-2', playerType: 'PRIMARY' },
  { name: 'Emily Davis', handicapIndex: 12.7, teamId: 'team-2', playerType: 'PRIMARY' },
  { name: 'Robert Wilson', handicapIndex: 5.3, teamId: 'team-3', playerType: 'PRIMARY' },
  { name: 'Sarah Brown', handicapIndex: 18.9, teamId: 'team-3', playerType: 'PRIMARY' },
  { name: 'David Martinez', handicapIndex: 10.6, teamId: 'team-4', playerType: 'PRIMARY' },
  { name: 'Lisa Garcia', handicapIndex: 15.8, teamId: 'team-4', playerType: 'PRIMARY' },
  { name: 'James Anderson', handicapIndex: 24.5, teamId: 'team-5', playerType: 'PRIMARY' },
  { name: 'Jennifer Miller', handicapIndex: 9.2, teamId: 'team-5', playerType: 'PRIMARY' },
  { name: 'Thomas Cooper', handicapIndex: 13.4, teamId: 'team-6', playerType: 'PRIMARY' },
  { name: 'Jessica Rodriguez', handicapIndex: 19.7, teamId: 'team-6', playerType: 'PRIMARY' },
  { name: 'Christopher Lee', handicapIndex: 7.8, teamId: 'team-7', playerType: 'PRIMARY' },
  { name: 'Amanda Wright', handicapIndex: 16.3, teamId: 'team-7', playerType: 'PRIMARY' },
  { name: 'Steven Torres', handicapIndex: 21.2, teamId: 'team-8', playerType: 'PRIMARY' },
  { name: 'Michelle Hernandez', handicapIndex: 11.5, teamId: 'team-8', playerType: 'PRIMARY' },
  { name: 'Matthew King', handicapIndex: 25.0, teamId: 'team-9', playerType: 'PRIMARY' },
  { name: 'Stephanie Lewis', handicapIndex: 17.1, teamId: 'team-9', playerType: 'PRIMARY' },
  { name: 'Daniel Clark', handicapIndex: 6.7, teamId: 'team-10', playerType: 'PRIMARY' },
  { name: 'Nicole Scott', handicapIndex: 20.4, teamId: 'team-10', playerType: 'PRIMARY' }
];

// Match schedule for the weeks
const schedule = [
  // Week 1
  {
    weekNumber: 1,
    date: new Date('2024-04-15T18:00:00Z'), // April 15, 2024 at 6:00 PM UTC
    matches: [
      { homeTeamId: 'team-1', awayTeamId: 'team-2', startingHole: 1 },
      { homeTeamId: 'team-3', awayTeamId: 'team-4', startingHole: 3 },
      { homeTeamId: 'team-5', awayTeamId: 'team-6', startingHole: 5 },
      { homeTeamId: 'team-7', awayTeamId: 'team-8', startingHole: 7 },
      { homeTeamId: 'team-9', awayTeamId: 'team-10', startingHole: 9 }
    ]
  },
  // Week 2
  {
    weekNumber: 2,
    date: new Date('2024-04-22T18:00:00Z'), // April 22, 2024 at 6:00 PM UTC
    matches: [
      { homeTeamId: 'team-10', awayTeamId: 'team-1', startingHole: 1 },
      { homeTeamId: 'team-2', awayTeamId: 'team-3', startingHole: 3 },
      { homeTeamId: 'team-4', awayTeamId: 'team-5', startingHole: 5 },
      { homeTeamId: 'team-6', awayTeamId: 'team-7', startingHole: 7 },
      { homeTeamId: 'team-8', awayTeamId: 'team-9', startingHole: 9 }
    ]
  },
  // Week 3
  {
    weekNumber: 3,
    date: new Date('2024-04-29T18:00:00Z'), // April 29, 2024 at 6:00 PM UTC
    matches: [
      { homeTeamId: 'team-1', awayTeamId: 'team-9', startingHole: 1 },
      { homeTeamId: 'team-3', awayTeamId: 'team-10', startingHole: 3 },
      { homeTeamId: 'team-5', awayTeamId: 'team-2', startingHole: 5 },
      { homeTeamId: 'team-7', awayTeamId: 'team-4', startingHole: 7 },
      { homeTeamId: 'team-6', awayTeamId: 'team-8', startingHole: 9 }
    ]
  },
  // Week 4
  {
    weekNumber: 4,
    date: new Date('2024-05-06T18:00:00Z'), // May 6, 2024 at 6:00 PM UTC
    matches: [
      { homeTeamId: 'team-8', awayTeamId: 'team-1', startingHole: 1 },
      { homeTeamId: 'team-2', awayTeamId: 'team-6', startingHole: 3 },
      { homeTeamId: 'team-4', awayTeamId: 'team-3', startingHole: 5 },
      { homeTeamId: 'team-10', awayTeamId: 'team-5', startingHole: 7 },
      { homeTeamId: 'team-9', awayTeamId: 'team-7', startingHole: 9 }
    ]
  },
  // Week 5
  {
    weekNumber: 5,
    date: new Date('2024-05-13T18:00:00Z'), // May 13, 2024 at 6:00 PM UTC
    matches: [
      { homeTeamId: 'team-1', awayTeamId: 'team-7', startingHole: 1 },
      { homeTeamId: 'team-3', awayTeamId: 'team-8', startingHole: 3 },
      { homeTeamId: 'team-5', awayTeamId: 'team-9', startingHole: 5 },
      { homeTeamId: 'team-6', awayTeamId: 'team-10', startingHole: 7 },
      { homeTeamId: 'team-2', awayTeamId: 'team-4', startingHole: 9 }
    ]
  },
  // Week 6
  {
    weekNumber: 6,
    date: new Date('2024-05-20T18:00:00Z'), // May 20, 2024 at 6:00 PM UTC
    matches: [
      { homeTeamId: 'team-4', awayTeamId: 'team-1', startingHole: 1 },
      { homeTeamId: 'team-6', awayTeamId: 'team-3', startingHole: 3 },
      { homeTeamId: 'team-8', awayTeamId: 'team-5', startingHole: 5 },
      { homeTeamId: 'team-10', awayTeamId: 'team-7', startingHole: 7 },
      { homeTeamId: 'team-9', awayTeamId: 'team-2', startingHole: 9 }
    ]
  },
  // Week 7
  {
    weekNumber: 7,
    date: new Date('2024-05-27T18:00:00Z'), // May 27, 2024 at 6:00 PM UTC
    matches: [
      { homeTeamId: 'team-1', awayTeamId: 'team-5', startingHole: 1 },
      { homeTeamId: 'team-3', awayTeamId: 'team-7', startingHole: 3 },
      { homeTeamId: 'team-2', awayTeamId: 'team-8', startingHole: 5 },
      { homeTeamId: 'team-4', awayTeamId: 'team-9', startingHole: 7 },
      { homeTeamId: 'team-6', awayTeamId: 'team-10', startingHole: 9 }
    ]
  },
  // Week 8
  {
    weekNumber: 8,
    date: new Date('2024-06-03T18:00:00Z'), // June 3, 2024 at 6:00 PM UTC
    matches: [
      { homeTeamId: 'team-3', awayTeamId: 'team-1', startingHole: 1 },
      { homeTeamId: 'team-5', awayTeamId: 'team-7', startingHole: 3 },
      { homeTeamId: 'team-9', awayTeamId: 'team-6', startingHole: 5 },
      { homeTeamId: 'team-2', awayTeamId: 'team-10', startingHole: 7 },
      { homeTeamId: 'team-4', awayTeamId: 'team-8', startingHole: 9 }
    ]
  },
  // Week 9
  {
    weekNumber: 9,
    date: new Date('2024-06-10T18:00:00Z'), // June 10, 2024 at 6:00 PM UTC
    matches: [
      { homeTeamId: 'team-1', awayTeamId: 'team-6', startingHole: 1 },
      { homeTeamId: 'team-7', awayTeamId: 'team-2', startingHole: 3 },
      { homeTeamId: 'team-3', awayTeamId: 'team-9', startingHole: 5 },
      { homeTeamId: 'team-5', awayTeamId: 'team-4', startingHole: 7 },
      { homeTeamId: 'team-10', awayTeamId: 'team-8', startingHole: 9 }
    ]
  }
];

// Main seeding function
async function seedTeams() {
  console.log('Creating teams...');
  let createdCount = 0;
  
  for (const team of teams) {
    try {
      await prisma.team.upsert({
        where: { id: team.id },
        update: { name: team.name, updatedAt: new Date() },
        create: {
          id: team.id,
          name: team.name,
          updatedAt: new Date()
        }
      });
      createdCount++;
    } catch (error) {
      console.error(`Error creating team ${team.name}:`, error.message);
    }
  }
  
  return createdCount;
}

async function seedPlayers() {
  console.log('Creating players...');
  let createdCount = 0;
  
  for (const player of players) {
    try {
      await prisma.player.create({
        data: {
          name: player.name,
          handicapIndex: player.handicapIndex,
          teamId: player.teamId,
          playerType: player.playerType,
          updatedAt: new Date()
        }
      });
      createdCount++;
    } catch (error) {
      console.error(`Error creating player ${player.name}:`, error.message);
    }
  }
  
  return createdCount;
}

async function seedMatches() {
  console.log('Creating matches...');
  let createdCount = 0;
  
  for (const week of schedule) {
    for (const match of week.matches) {
      try {
        await prisma.match.create({
          data: {
            date: week.date,
            weekNumber: week.weekNumber,
            homeTeamId: match.homeTeamId,
            awayTeamId: match.awayTeamId,
            startingHole: match.startingHole,
            status: 'SCHEDULED',
            updatedAt: new Date()
          }
        });
        createdCount++;
      } catch (error) {
        console.error(`Error creating match in week ${week.weekNumber}:`, error.message);
      }
    }
  }
  
  return createdCount;
}

async function clearDatabase() {
  console.log('Clearing existing data...');
  try {
    // Delete in order to respect foreign key constraints
    await prisma.matchPlayer.deleteMany();
    await prisma.matchScore.deleteMany();
    await prisma.matchPoints.deleteMany();
    await prisma.playerSubstitution.deleteMany();
    await prisma.match.deleteMany();
    await prisma.player.deleteMany();
    await prisma.team.deleteMany();
    return true;
  } catch (error) {
    console.error('Error clearing database:', error.message);
    return false;
  }
}

// Main function
async function main() {
  console.log('Starting Supabase database seeding...');
  
  try {
    // Clear existing data
    await clearDatabase();
    
    // Create new data
    const teamsCreated = await seedTeams();
    console.log(`Created ${teamsCreated} teams.`);
    
    const playersCreated = await seedPlayers();
    console.log(`Created ${playersCreated} players.`);
    
    const matchesCreated = await seedMatches();
    console.log(`Created ${matchesCreated} matches.`);
    
    console.log('Seed data created successfully!');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding operation
main()
  .catch(error => {
    console.error('Error in seed script:', error);
    process.exit(1);
  }); 