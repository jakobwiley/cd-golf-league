// Script to initialize the database with schedule data
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Team data
const teams = [
  { id: 'team1', name: 'Nick/Brent' },
  { id: 'team2', name: 'Hot/Huerter' },
  { id: 'team3', name: 'Ashley/Alli' },
  { id: 'team4', name: 'Brew/Jake' },
  { id: 'team5', name: 'Sketch/Rob' },
  { id: 'team6', name: 'Trev/Murph' },
  { id: 'team7', name: 'Ryan/Drew' },
  { id: 'team8', name: 'AP/JohnP' },
  { id: 'team9', name: 'Clauss/Wade' },
  { id: 'team10', name: 'Brett/Tony' }
];

// Player data
const players = [
  { name: 'AP', handicapIndex: 7.3, teamId: 'team8' },
  { name: 'JohnP', handicapIndex: 21.4, teamId: 'team8' },
  
  { name: 'Brett', handicapIndex: 10.3, teamId: 'team10' },
  { name: 'Tony', handicapIndex: 14.1, teamId: 'team10' },
  
  { name: 'Drew', handicapIndex: 10.6, teamId: 'team7' },
  { name: 'Ryan', handicapIndex: 13.9, teamId: 'team7' },
  
  { name: 'Nick', handicapIndex: 11.3, teamId: 'team1' },
  { name: 'Brent', handicapIndex: 12.0, teamId: 'team1' },
  
  { name: 'Huerter', handicapIndex: 11.8, teamId: 'team2' },
  { name: 'Hot', handicapIndex: 17.2, teamId: 'team2' },
  
  { name: 'Sketch', handicapIndex: 11.9, teamId: 'team5' },
  { name: 'Rob', handicapIndex: 18.1, teamId: 'team5' },
  
  { name: 'Clauss', handicapIndex: 12.5, teamId: 'team9' },
  { name: 'Wade', handicapIndex: 15.0, teamId: 'team9' },
  
  { name: 'Murph', handicapIndex: 12.6, teamId: 'team6' },
  { name: 'Trev', handicapIndex: 16.0, teamId: 'team6' },
  
  { name: 'Brew', handicapIndex: 13.4, teamId: 'team4' },
  { name: 'Jake', handicapIndex: 16.7, teamId: 'team4' },
  
  { name: 'Ashley', handicapIndex: 40.6, teamId: 'team3' },
  { name: 'Alli', handicapIndex: 30.0, teamId: 'team3' }
];

// Schedule data
const scheduleData = [
  // Week 1 - April 15, 2025
  [1, 1, 'Hot/Huerter', 'Nick/Brent', '2025-04-15T18:00:00.000Z'],
  [1, 2, 'Ashley/Alli', 'Brett/Tony', '2025-04-15T18:00:00.000Z'],
  [1, 3, 'Brew/Jake', 'Clauss/Wade', '2025-04-15T18:00:00.000Z'],
  [1, 4, 'Sketch/Rob', 'AP/JohnP', '2025-04-15T18:00:00.000Z'],
  [1, 5, 'Trev/Murph', 'Ryan/Drew', '2025-04-15T18:00:00.000Z'],
  
  // Week 2 - April 22, 2025
  [2, 1, 'Brett/Tony', 'Brew/Jake', '2025-04-22T18:00:00.000Z'],
  [2, 2, 'Nick/Brent', 'Ryan/Drew', '2025-04-22T18:00:00.000Z'],
  [2, 3, 'AP/JohnP', 'Trev/Murph', '2025-04-22T18:00:00.000Z'],
  [2, 4, 'Clauss/Wade', 'Sketch/Rob', '2025-04-22T18:00:00.000Z'],
  [2, 5, 'Hot/Huerter', 'Ashley/Alli', '2025-04-22T18:00:00.000Z'],
  
  // Week 3 - April 29, 2025
  [3, 1, 'Ryan/Drew', 'AP/JohnP', '2025-04-29T18:00:00.000Z'],
  [3, 2, 'Trev/Murph', 'Clauss/Wade', '2025-04-29T18:00:00.000Z'],
  [3, 3, 'Sketch/Rob', 'Brett/Tony', '2025-04-29T18:00:00.000Z'],
  [3, 4, 'Brew/Jake', 'Hot/Huerter', '2025-04-29T18:00:00.000Z'],
  [3, 5, 'Ashley/Alli', 'Nick/Brent', '2025-04-29T18:00:00.000Z'],
  
  // Week 4 - May 6, 2025
  [4, 1, 'Nick/Brent', 'AP/JohnP', '2025-05-06T18:00:00.000Z'],
  [4, 2, 'Hot/Huerter', 'Sketch/Rob', '2025-05-06T18:00:00.000Z'],
  [4, 3, 'Ashley/Alli', 'Brew/Jake', '2025-05-06T18:00:00.000Z'],
  [4, 4, 'Brett/Tony', 'Trev/Murph', '2025-05-06T18:00:00.000Z'],
  [4, 5, 'Clauss/Wade', 'Ryan/Drew', '2025-05-06T18:00:00.000Z'],
  
  // Week 5 - May 13, 2025
  [5, 1, 'Sketch/Rob', 'Ashley/Alli', '2025-05-13T18:00:00.000Z'],
  [5, 2, 'Brew/Jake', 'Nick/Brent', '2025-05-13T18:00:00.000Z'],
  [5, 3, 'Ryan/Drew', 'Brett/Tony', '2025-05-13T18:00:00.000Z'],
  [5, 4, 'AP/JohnP', 'Clauss/Wade', '2025-05-13T18:00:00.000Z'],
  [5, 5, 'Trev/Murph', 'Hot/Huerter', '2025-05-13T18:00:00.000Z'],
  
  // Week 6 - May 20, 2025
  [6, 1, 'Nick/Brent', 'Clauss/Wade', '2025-05-20T18:00:00.000Z'],
  [6, 2, 'Brett/Tony', 'AP/JohnP', '2025-05-20T18:00:00.000Z'],
  [6, 3, 'Hot/Huerter', 'Ryan/Drew', '2025-05-20T18:00:00.000Z'],
  [6, 4, 'Ashley/Alli', 'Trev/Murph', '2025-05-20T18:00:00.000Z'],
  [6, 5, 'Brew/Jake', 'Sketch/Rob', '2025-05-20T18:00:00.000Z'],
  
  // Week 7 - May 27, 2025
  [7, 1, 'Ryan/Drew', 'Ashley/Alli', '2025-05-27T18:00:00.000Z'],
  [7, 2, 'Trev/Murph', 'Brew/Jake', '2025-05-27T18:00:00.000Z'],
  [7, 3, 'Sketch/Rob', 'Nick/Brent', '2025-05-27T18:00:00.000Z'],
  [7, 4, 'AP/JohnP', 'Hot/Huerter', '2025-05-27T18:00:00.000Z'],
  [7, 5, 'Clauss/Wade', 'Brett/Tony', '2025-05-27T18:00:00.000Z'],
  
  // Week 8 - June 3, 2025
  [8, 1, 'Sketch/Rob', 'Trev/Murph', '2025-06-03T18:00:00.000Z'],
  [8, 2, 'Ashley/Alli', 'AP/JohnP', '2025-06-03T18:00:00.000Z'],
  [8, 3, 'Hot/Huerter', 'Clauss/Wade', '2025-06-03T18:00:00.000Z'],
  [8, 4, 'Nick/Brent', 'Brett/Tony', '2025-06-03T18:00:00.000Z'],
  [8, 5, 'Brew/Jake', 'Ryan/Drew', '2025-06-03T18:00:00.000Z'],
  
  // Week 9 - June 10, 2025
  [9, 1, 'Clauss/Wade', 'Ashley/Alli', '2025-06-10T18:00:00.000Z'],
  [9, 2, 'Brett/Tony', 'Hot/Huerter', '2025-06-10T18:00:00.000Z'],
  [9, 3, 'Trev/Murph', 'Nick/Brent', '2025-06-10T18:00:00.000Z'],
  [9, 4, 'Ryan/Drew', 'Sketch/Rob', '2025-06-10T18:00:00.000Z'],
  [9, 5, 'AP/JohnP', 'Brew/Jake', '2025-06-10T18:00:00.000Z'],
  
  // Week 11 - June 24, 2025
  [11, 1, 'Brett/Tony', 'Trev/Murph', '2025-06-24T18:00:00.000Z'],
  [11, 2, 'Ryan/Drew', 'Clauss/Wade', '2025-06-24T18:00:00.000Z'],
  [11, 3, 'AP/JohnP', 'Hot/Huerter', '2025-06-24T18:00:00.000Z'],
  [11, 4, 'Ashley/Alli', 'Brew/Jake', '2025-06-24T18:00:00.000Z'],
  [11, 5, 'Nick/Brent', 'Sketch/Rob', '2025-06-24T18:00:00.000Z'],
  
  // Week 12 - July 1, 2025
  [12, 1, 'Hot/Huerter', 'Brew/Jake', '2025-07-01T18:00:00.000Z'],
  [12, 2, 'Sketch/Rob', 'Trev/Murph', '2025-07-01T18:00:00.000Z'],
  [12, 3, 'Ashley/Alli', 'Clauss/Wade', '2025-07-01T18:00:00.000Z'],
  [12, 4, 'Nick/Brent', 'Ryan/Drew', '2025-07-01T18:00:00.000Z'],
  [12, 5, 'AP/JohnP', 'Brett/Tony', '2025-07-01T18:00:00.000Z'],
  
  // Week 13 - July 8, 2025
  [13, 1, 'Trev/Murph', 'Clauss/Wade', '2025-07-08T18:00:00.000Z'],
  [13, 2, 'AP/JohnP', 'Ashley/Alli', '2025-07-08T18:00:00.000Z'],
  [13, 3, 'Nick/Brent', 'Brew/Jake', '2025-07-08T18:00:00.000Z'],
  [13, 4, 'Ryan/Drew', 'Hot/Huerter', '2025-07-08T18:00:00.000Z'],
  [13, 5, 'Sketch/Rob', 'Brett/Tony', '2025-07-08T18:00:00.000Z'],
  
  // Week 14 - July 15, 2025
  [14, 1, 'Hot/Huerter', 'Sketch/Rob', '2025-07-15T18:00:00.000Z'],
  [14, 2, 'Nick/Brent', 'Clauss/Wade', '2025-07-15T18:00:00.000Z'],
  [14, 3, 'Ashley/Alli', 'Ryan/Drew', '2025-07-15T18:00:00.000Z'],
  [14, 4, 'Brew/Jake', 'Brett/Tony', '2025-07-15T18:00:00.000Z'],
  [14, 5, 'Trev/Murph', 'AP/JohnP', '2025-07-15T18:00:00.000Z']
];

// Function to find team ID by name
function findTeamIdByName(name) {
  const team = teams.find(t => t.name === name);
  return team ? team.id : null;
}

// Main function to initialize the database
async function initDatabase() {
  console.log('Initializing database...');
  
  try {
    // Clear existing data
    console.log('Clearing existing data...');
    await prisma.matchScore.deleteMany();
    await prisma.matchPoints.deleteMany();
    await prisma.matchPlayer.deleteMany();
    await prisma.match.deleteMany();
    await prisma.player.deleteMany();
    await prisma.team.deleteMany();
    
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
    
    // Create players
    console.log('Creating players...');
    for (const player of players) {
      await prisma.player.create({
        data: {
          name: player.name,
          playerType: 'PRIMARY',
          handicapIndex: player.handicapIndex,
          teamId: player.teamId
        }
      });
    }
    
    // Create matches
    console.log('Creating matches...');
    for (const [weekNumber, startingHole, homeTeamName, awayTeamName, date] of scheduleData) {
      const homeTeamId = findTeamIdByName(homeTeamName);
      const awayTeamId = findTeamIdByName(awayTeamName);
      
      if (!homeTeamId || !awayTeamId) {
        console.error(`Could not find team IDs for match: ${homeTeamName} vs ${awayTeamName}`);
        continue;
      }
      
      await prisma.match.create({
        data: {
          date: new Date(date),
          weekNumber,
          homeTeamId,
          awayTeamId,
          status: 'SCHEDULED',
          startingHole
        }
      });
    }
    
    console.log('Database initialization complete!');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the initialization
initDatabase(); 