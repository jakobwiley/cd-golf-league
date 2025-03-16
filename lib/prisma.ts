// This is a mock implementation of the Prisma client for development
// It uses in-memory arrays to store data

import { PrismaClient } from '@prisma/client'

// Add MatchPlayer to the global type
declare global {
  var globalForPrisma: {
    mockTeams: any[]
    mockPlayers: any[]
    mockMatches: any[]
    mockScores: any[]
    mockPoints: any[]
    mockMatchPlayers: any[] // Add matchPlayers array
    mockMatchScores: any[] // Add mockMatchScores array
    isInitialized: boolean
  }
  var prisma: PrismaClient
}

// Initialize the global object if it doesn't exist
if (!global.globalForPrisma) {
  global.globalForPrisma = {
    mockTeams: [],
    mockPlayers: [],
    mockMatches: [],
    mockScores: [],
    mockPoints: [],
    mockMatchPlayers: [], // Initialize empty matchPlayers array
    mockMatchScores: [], // Initialize mockMatchScores array
    isInitialized: false,
  }
}

// Initialize mock data if it doesn't exist
if (!global.globalForPrisma.isInitialized) {
  // Initialize teams
  global.globalForPrisma.mockTeams = [
    {
      id: 'team1',
      name: 'Nick/Brent',
      players: [],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'team2',
      name: 'Hot/Huerter',
      players: [],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'team3',
      name: 'Ashley/Alli',
      players: [],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'team4',
      name: 'Brew/Jake',
      players: [],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'team5',
      name: 'Sketch/Rob',
      players: [],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'team6',
      name: 'Trev/Murph',
      players: [],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'team7',
      name: 'Ryan/Drew',
      players: [],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'team8',
      name: 'AP/JohnP',
      players: [],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'team9',
      name: 'Clauss/Wade',
      players: [],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'team10',
      name: 'Brett/Tony',
      players: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  // Initialize players
  global.globalForPrisma.mockPlayers = [
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
  ].map((player, index) => ({
    id: `player${index + 1}`,
    name: player.name,
    playerType: 'PRIMARY',
    handicapIndex: player.handicapIndex,
    teamId: player.teamId,
    createdAt: new Date(),
    updatedAt: new Date()
  }));

  // Initialize matches
  global.globalForPrisma.mockMatches = [];
  
  // Create matches for the full season
  const startDate = new Date('2025-04-15T18:00:00.000Z'); // Season start date (April 15, 2025)
  
  // Week 1
  global.globalForPrisma.mockMatches.push(
    {
      id: 'match1',
      date: new Date(startDate),
      weekNumber: 1,
      homeTeamId: 'team1', // Nick/Brent
      awayTeamId: 'team2', // Hot/Huerter
      status: 'SCHEDULED',
      startingHole: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'match2',
      date: new Date(startDate),
      weekNumber: 1,
      homeTeamId: 'team3', // Ashley/Alli
      awayTeamId: 'team4', // Brew/Jake
      status: 'SCHEDULED',
      startingHole: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'match3',
      date: new Date(startDate),
      weekNumber: 1,
      homeTeamId: 'team5', // Sketch/Rob
      awayTeamId: 'team6', // Trev/Murph
      status: 'SCHEDULED',
      startingHole: 5,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'match4',
      date: new Date(startDate),
      weekNumber: 1,
      homeTeamId: 'team7', // Ryan/Drew
      awayTeamId: 'team8', // AP/JohnP
      status: 'SCHEDULED',
      startingHole: 7,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'match5',
      date: new Date(startDate),
      weekNumber: 1,
      homeTeamId: 'team9', // Clauss/Wade
      awayTeamId: 'team10', // Brett/Tony
      status: 'SCHEDULED',
      startingHole: 9,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  );
  
  // Week 2
  const week2Date = new Date(startDate);
  week2Date.setDate(week2Date.getDate() + 7); // April 22, 2025
  
  global.globalForPrisma.mockMatches.push(
    {
      id: 'match6',
      date: new Date(week2Date),
      weekNumber: 2,
      homeTeamId: 'team2', // Hot/Huerter
      awayTeamId: 'team3', // Ashley/Alli
      status: 'SCHEDULED',
      startingHole: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'match7',
      date: new Date(week2Date),
      weekNumber: 2,
      homeTeamId: 'team4', // Brew/Jake
      awayTeamId: 'team5', // Sketch/Rob
      status: 'SCHEDULED',
      startingHole: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'match8',
      date: new Date(week2Date),
      weekNumber: 2,
      homeTeamId: 'team6', // Trev/Murph
      awayTeamId: 'team7', // Ryan/Drew
      status: 'SCHEDULED',
      startingHole: 5,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'match9',
      date: new Date(week2Date),
      weekNumber: 2,
      homeTeamId: 'team8', // AP/JohnP
      awayTeamId: 'team9', // Clauss/Wade
      status: 'SCHEDULED',
      startingHole: 7,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'match10',
      date: new Date(week2Date),
      weekNumber: 2,
      homeTeamId: 'team10', // Brett/Tony
      awayTeamId: 'team1', // Nick/Brent
      status: 'SCHEDULED',
      startingHole: 9,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  );
  
  // Week 3
  const week3Date = new Date(week2Date);
  week3Date.setDate(week3Date.getDate() + 7); // April 29, 2025
  
  global.globalForPrisma.mockMatches.push(
    {
      id: 'match11',
      date: new Date(week3Date),
      weekNumber: 3,
      homeTeamId: 'team1', // Nick/Brent
      awayTeamId: 'team3', // Ashley/Alli
      status: 'SCHEDULED',
      startingHole: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'match12',
      date: new Date(week3Date),
      weekNumber: 3,
      homeTeamId: 'team2', // Hot/Huerter
      awayTeamId: 'team4', // Brew/Jake
      status: 'SCHEDULED',
      startingHole: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'match13',
      date: new Date(week3Date),
      weekNumber: 3,
      homeTeamId: 'team5', // Sketch/Rob
      awayTeamId: 'team7', // Ryan/Drew
      status: 'SCHEDULED',
      startingHole: 5,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'match14',
      date: new Date(week3Date),
      weekNumber: 3,
      homeTeamId: 'team6', // Trev/Murph
      awayTeamId: 'team8', // AP/JohnP
      status: 'SCHEDULED',
      startingHole: 7,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'match15',
      date: new Date(week3Date),
      weekNumber: 3,
      homeTeamId: 'team9', // Clauss/Wade
      awayTeamId: 'team10', // Brett/Tony
      status: 'SCHEDULED',
      startingHole: 9,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  );

  // Week 4
  const week4Date = new Date(week3Date);
  week4Date.setDate(week4Date.getDate() + 7); // May 6, 2025
  
  global.globalForPrisma.mockMatches.push(
    {
      id: 'match16',
      date: new Date(week4Date),
      weekNumber: 4,
      homeTeamId: 'team1', // Nick/Brent
      awayTeamId: 'team8', // AP/JohnP
      status: 'SCHEDULED',
      startingHole: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'match17',
      date: new Date(week4Date),
      weekNumber: 4,
      homeTeamId: 'team2', // Hot/Huerter
      awayTeamId: 'team5', // Sketch/Rob
      status: 'SCHEDULED',
      startingHole: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'match18',
      date: new Date(week4Date),
      weekNumber: 4,
      homeTeamId: 'team3', // Ashley/Alli
      awayTeamId: 'team4', // Brew/Jake
      status: 'SCHEDULED',
      startingHole: 5,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'match19',
      date: new Date(week4Date),
      weekNumber: 4,
      homeTeamId: 'team10', // Brett/Tony
      awayTeamId: 'team6', // Trev/Murph
      status: 'SCHEDULED',
      startingHole: 7,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'match20',
      date: new Date(week4Date),
      weekNumber: 4,
      homeTeamId: 'team9', // Clauss/Wade
      awayTeamId: 'team7', // Ryan/Drew
      status: 'SCHEDULED',
      startingHole: 9,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  );
  
  // Week 5
  const week5Date = new Date(week4Date);
  week5Date.setDate(week5Date.getDate() + 7); // May 13, 2025
  
  global.globalForPrisma.mockMatches.push(
    {
      id: 'match21',
      date: new Date(week5Date),
      weekNumber: 5,
      homeTeamId: 'team5', // Sketch/Rob
      awayTeamId: 'team3', // Ashley/Alli
      status: 'SCHEDULED',
      startingHole: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'match22',
      date: new Date(week5Date),
      weekNumber: 5,
      homeTeamId: 'team4', // Brew/Jake
      awayTeamId: 'team1', // Nick/Brent
      status: 'SCHEDULED',
      startingHole: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'match23',
      date: new Date(week5Date),
      weekNumber: 5,
      homeTeamId: 'team7', // Ryan/Drew
      awayTeamId: 'team10', // Brett/Tony
      status: 'SCHEDULED',
      startingHole: 5,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'match24',
      date: new Date(week5Date),
      weekNumber: 5,
      homeTeamId: 'team8', // AP/JohnP
      awayTeamId: 'team9', // Clauss/Wade
      status: 'SCHEDULED',
      startingHole: 7,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'match25',
      date: new Date(week5Date),
      weekNumber: 5,
      homeTeamId: 'team6', // Trev/Murph
      awayTeamId: 'team2', // Hot/Huerter
      status: 'SCHEDULED',
      startingHole: 9,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  );
  
  // Week 6
  const week6Date = new Date(week5Date);
  week6Date.setDate(week6Date.getDate() + 7); // May 20, 2025
  
  global.globalForPrisma.mockMatches.push(
    {
      id: 'match26',
      date: new Date(week6Date),
      weekNumber: 6,
      homeTeamId: 'team1', // Nick/Brent
      awayTeamId: 'team9', // Clauss/Wade
      status: 'SCHEDULED',
      startingHole: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'match27',
      date: new Date(week6Date),
      weekNumber: 6,
      homeTeamId: 'team10', // Brett/Tony
      awayTeamId: 'team8', // AP/JohnP
      status: 'SCHEDULED',
      startingHole: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'match28',
      date: new Date(week6Date),
      weekNumber: 6,
      homeTeamId: 'team2', // Hot/Huerter
      awayTeamId: 'team7', // Ryan/Drew
      status: 'SCHEDULED',
      startingHole: 5,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'match29',
      date: new Date(week6Date),
      weekNumber: 6,
      homeTeamId: 'team3', // Ashley/Alli
      awayTeamId: 'team6', // Trev/Murph
      status: 'SCHEDULED',
      startingHole: 7,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'match30',
      date: new Date(week6Date),
      weekNumber: 6,
      homeTeamId: 'team4', // Brew/Jake
      awayTeamId: 'team5', // Sketch/Rob
      status: 'SCHEDULED',
      startingHole: 9,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  );
  
  // Week 7
  const week7Date = new Date(week6Date);
  week7Date.setDate(week7Date.getDate() + 7); // May 27, 2025
  
  global.globalForPrisma.mockMatches.push(
    {
      id: 'match31',
      date: new Date(week7Date),
      weekNumber: 7,
      homeTeamId: 'team7', // Ryan/Drew
      awayTeamId: 'team3', // Ashley/Alli
      status: 'SCHEDULED',
      startingHole: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'match32',
      date: new Date(week7Date),
      weekNumber: 7,
      homeTeamId: 'team6', // Trev/Murph
      awayTeamId: 'team4', // Brew/Jake
      status: 'SCHEDULED',
      startingHole: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'match33',
      date: new Date(week7Date),
      weekNumber: 7,
      homeTeamId: 'team8', // AP/JohnP
      awayTeamId: 'team2', // Hot/Huerter
      status: 'SCHEDULED',
      startingHole: 5,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'match34',
      date: new Date(week7Date),
      weekNumber: 7,
      homeTeamId: 'team9', // Clauss/Wade
      awayTeamId: 'team10', // Brett/Tony
      status: 'SCHEDULED',
      startingHole: 7,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'match35',
      date: new Date(week7Date),
      weekNumber: 7,
      homeTeamId: 'team1', // Nick/Brent
      awayTeamId: 'team5', // Sketch/Rob
      status: 'SCHEDULED',
      startingHole: 9,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  );
  
  // Week 8
  const week8Date = new Date(week7Date);
  week8Date.setDate(week8Date.getDate() + 7); // June 3, 2025
  
  global.globalForPrisma.mockMatches.push(
    {
      id: 'match36',
      date: new Date(week8Date),
      weekNumber: 8,
      homeTeamId: 'team4', // Brew/Jake
      awayTeamId: 'team8', // AP/JohnP
      status: 'SCHEDULED',
      startingHole: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'match37',
      date: new Date(week8Date),
      weekNumber: 8,
      homeTeamId: 'team5', // Sketch/Rob
      awayTeamId: 'team6', // Trev/Murph
      status: 'SCHEDULED',
      startingHole: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'match38',
      date: new Date(week8Date),
      weekNumber: 8,
      homeTeamId: 'team3', // Ashley/Alli
      awayTeamId: 'team9', // Clauss/Wade
      status: 'SCHEDULED',
      startingHole: 5,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'match39',
      date: new Date(week8Date),
      weekNumber: 8,
      homeTeamId: 'team2', // Hot/Huerter
      awayTeamId: 'team10', // Brett/Tony
      status: 'SCHEDULED',
      startingHole: 7,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'match40',
      date: new Date(week8Date),
      weekNumber: 8,
      homeTeamId: 'team1', // Nick/Brent
      awayTeamId: 'team7', // Ryan/Drew
      status: 'SCHEDULED',
      startingHole: 9,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  );
  
  // Week 9
  const week9Date = new Date(week8Date);
  week9Date.setDate(week9Date.getDate() + 7); // June 10, 2025
  
  global.globalForPrisma.mockMatches.push(
    {
      id: 'match41',
      date: new Date(week9Date),
      weekNumber: 9,
      homeTeamId: 'team8', // AP/JohnP
      awayTeamId: 'team3', // Ashley/Alli
      status: 'SCHEDULED',
      startingHole: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'match42',
      date: new Date(week9Date),
      weekNumber: 9,
      homeTeamId: 'team9', // Clauss/Wade
      awayTeamId: 'team2', // Hot/Huerter
      status: 'SCHEDULED',
      startingHole: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'match43',
      date: new Date(week9Date),
      weekNumber: 9,
      homeTeamId: 'team10', // Brett/Tony
      awayTeamId: 'team1', // Nick/Brent
      status: 'SCHEDULED',
      startingHole: 5,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'match44',
      date: new Date(week9Date),
      weekNumber: 9,
      homeTeamId: 'team7', // Ryan/Drew
      awayTeamId: 'team4', // Brew/Jake
      status: 'SCHEDULED',
      startingHole: 7,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'match45',
      date: new Date(week9Date),
      weekNumber: 9,
      homeTeamId: 'team6', // Trev/Murph
      awayTeamId: 'team5', // Sketch/Rob
      status: 'SCHEDULED',
      startingHole: 9,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  );
  
  // Week 11
  const week11Date = new Date(week9Date);
  week11Date.setDate(week11Date.getDate() + 14); // June 24, 2025 (Skip week 10)
  
  global.globalForPrisma.mockMatches.push(
    {
      id: 'match46',
      date: new Date(week11Date),
      weekNumber: 11,
      homeTeamId: 'team10', // Brett/Tony
      awayTeamId: 'team6', // Trev/Murph
      status: 'SCHEDULED',
      startingHole: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'match47',
      date: new Date(week11Date),
      weekNumber: 11,
      homeTeamId: 'team7', // Ryan/Drew
      awayTeamId: 'team9', // Clauss/Wade
      status: 'SCHEDULED',
      startingHole: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'match48',
      date: new Date(week11Date),
      weekNumber: 11,
      homeTeamId: 'team8', // AP/JohnP
      awayTeamId: 'team2', // Hot/Huerter
      status: 'SCHEDULED',
      startingHole: 5,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'match49',
      date: new Date(week11Date),
      weekNumber: 11,
      homeTeamId: 'team3', // Ashley/Alli
      awayTeamId: 'team4', // Brew/Jake
      status: 'SCHEDULED',
      startingHole: 7,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'match50',
      date: new Date(week11Date),
      weekNumber: 11,
      homeTeamId: 'team1', // Nick/Brent
      awayTeamId: 'team5', // Sketch/Rob
      status: 'SCHEDULED',
      startingHole: 9,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  );
  
  // Week 12
  const week12Date = new Date(week11Date);
  week12Date.setDate(week12Date.getDate() + 7); // July 1, 2025
  
  global.globalForPrisma.mockMatches.push(
    {
      id: 'match51',
      date: new Date(week12Date),
      weekNumber: 12,
      homeTeamId: 'team2', // Hot/Huerter
      awayTeamId: 'team4', // Brew/Jake
      status: 'SCHEDULED',
      startingHole: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'match52',
      date: new Date(week12Date),
      weekNumber: 12,
      homeTeamId: 'team5', // Sketch/Rob
      awayTeamId: 'team6', // Trev/Murph
      status: 'SCHEDULED',
      startingHole: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'match53',
      date: new Date(week12Date),
      weekNumber: 12,
      homeTeamId: 'team3', // Ashley/Alli
      awayTeamId: 'team9', // Clauss/Wade
      status: 'SCHEDULED',
      startingHole: 5,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'match54',
      date: new Date(week12Date),
      weekNumber: 12,
      homeTeamId: 'team1', // Nick/Brent
      awayTeamId: 'team7', // Ryan/Drew
      status: 'SCHEDULED',
      startingHole: 7,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'match55',
      date: new Date(week12Date),
      weekNumber: 12,
      homeTeamId: 'team8', // AP/JohnP
      awayTeamId: 'team10', // Brett/Tony
      status: 'SCHEDULED',
      startingHole: 9,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  );
  
  // Week 13
  const week13Date = new Date(week12Date);
  week13Date.setDate(week13Date.getDate() + 7); // July 8, 2025
  
  global.globalForPrisma.mockMatches.push(
    {
      id: 'match56',
      date: new Date(week13Date),
      weekNumber: 13,
      homeTeamId: 'team6', // Trev/Murph
      awayTeamId: 'team9', // Clauss/Wade
      status: 'SCHEDULED',
      startingHole: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'match57',
      date: new Date(week13Date),
      weekNumber: 13,
      homeTeamId: 'team8', // AP/JohnP
      awayTeamId: 'team3', // Ashley/Alli
      status: 'SCHEDULED',
      startingHole: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'match58',
      date: new Date(week13Date),
      weekNumber: 13,
      homeTeamId: 'team1', // Nick/Brent
      awayTeamId: 'team4', // Brew/Jake
      status: 'SCHEDULED',
      startingHole: 5,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'match59',
      date: new Date(week13Date),
      weekNumber: 13,
      homeTeamId: 'team7', // Ryan/Drew
      awayTeamId: 'team2', // Hot/Huerter
      status: 'SCHEDULED',
      startingHole: 7,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'match60',
      date: new Date(week13Date),
      weekNumber: 13,
      homeTeamId: 'team5', // Sketch/Rob
      awayTeamId: 'team10', // Brett/Tony
      status: 'SCHEDULED',
      startingHole: 9,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  );
  
  // Week 14
  const week14Date = new Date(week13Date);
  week14Date.setDate(week14Date.getDate() + 7); // July 15, 2025
  
  global.globalForPrisma.mockMatches.push(
    {
      id: 'match61',
      date: new Date(week14Date),
      weekNumber: 14,
      homeTeamId: 'team2', // Hot/Huerter
      awayTeamId: 'team5', // Sketch/Rob
      status: 'SCHEDULED',
      startingHole: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'match62',
      date: new Date(week14Date),
      weekNumber: 14,
      homeTeamId: 'team1', // Nick/Brent
      awayTeamId: 'team9', // Clauss/Wade
      status: 'SCHEDULED',
      startingHole: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'match63',
      date: new Date(week14Date),
      weekNumber: 14,
      homeTeamId: 'team3', // Ashley/Alli
      awayTeamId: 'team7', // Ryan/Drew
      status: 'SCHEDULED',
      startingHole: 5,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'match64',
      date: new Date(week14Date),
      weekNumber: 14,
      homeTeamId: 'team4', // Brew/Jake
      awayTeamId: 'team10', // Brett/Tony
      status: 'SCHEDULED',
      startingHole: 7,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'match65',
      date: new Date(week14Date),
      weekNumber: 14,
      homeTeamId: 'team6', // Trev/Murph
      awayTeamId: 'team8', // AP/JohnP
      status: 'SCHEDULED',
      startingHole: 9,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  );

  global.globalForPrisma.isInitialized = true;
}

// Access the global mock data
const mockTeams = global.globalForPrisma.mockTeams;
const mockPlayers = global.globalForPrisma.mockPlayers;
const mockMatches = global.globalForPrisma.mockMatches;

// Helper function to deep clone objects
function deepClone(obj: any) {
  return JSON.parse(JSON.stringify(obj));
}

// Define types for function parameters
interface OrderBy {
  [key: string]: 'asc' | 'desc';
}

interface FindManyParams {
  include?: Record<string, any>;
  orderBy?: OrderBy | OrderBy[];
  where?: Record<string, any>;
}

interface FindUniqueParams {
  where: { id: string };
  include?: Record<string, any>;
}

interface CreateParams {
  data: Record<string, any>;
  include?: Record<string, any>;
}

interface UpdateParams {
  where: { id: string };
  data: Record<string, any>;
  include?: Record<string, any>;
}

interface DeleteParams {
  where: { id: string };
}

interface DeleteManyParams {
  where?: Record<string, any>;
}

// Type guard to check if orderBy is a single object and not an array
function isSingleOrderBy(orderBy: OrderBy | OrderBy[] | undefined): orderBy is OrderBy {
  return orderBy !== undefined && !Array.isArray(orderBy);
}

// Create a mock Prisma client
const mockPrismaClient = {
  $transaction: async (callback) => {
    console.log('Using mock transaction');
    // Create a transaction proxy that mimics the real transaction
    const txClient = {
      player: {
        deleteMany: async (data) => {
          console.log('Mock deleting players:', data);
          const teamId = data.where.teamId;
          const initialCount = mockPlayers.length;
          const playersToRemove = mockPlayers.filter(p => p.teamId === teamId);
          
          for (let i = mockPlayers.length - 1; i >= 0; i--) {
            if (mockPlayers[i].teamId === teamId) {
              mockPlayers.splice(i, 1);
            }
          }
          
          // Update the global reference to ensure persistence
          global.globalForPrisma.mockPlayers = mockPlayers;
          
          const deletedCount = initialCount - mockPlayers.length;
          return { count: deletedCount };
        }
      },
      team: {
        delete: async (data) => {
          const teamId = data.where.id;
          const teamIndex = mockTeams.findIndex(t => t.id === teamId);
          
          if (teamIndex !== -1) {
            const deletedTeam = mockTeams[teamIndex];
            mockTeams.splice(teamIndex, 1);
            // Update the global reference to ensure persistence
            global.globalForPrisma.mockTeams = mockTeams;
            console.log('Mock deleted team in transaction:', deletedTeam);
            return deletedTeam;
          }
          
          throw new Error(`Team with ID ${teamId} not found`);
        }
      }
    };
    
    // Execute the callback with our transaction proxy
    return await callback(txClient);
  },
  team: {
    findMany: async (params: FindManyParams = {}) => {
      console.log('Mock: Finding all teams', params);
      
      let teams = deepClone(mockTeams);
      
      if (params.include?.players) {
        // Include players for each team
        teams = teams.map(team => {
          const teamPlayers = mockPlayers.filter(player => player.teamId === team.id);
          return { ...team, players: deepClone(teamPlayers) };
        });
      }
      
      if (isSingleOrderBy(params.orderBy)) {
        const orderBy = params.orderBy as OrderBy;
        if (orderBy.name) {
          teams.sort((a, b) => {
            return orderBy.name === 'asc' 
              ? a.name.localeCompare(b.name)
              : b.name.localeCompare(a.name);
          });
        }
      }
      
      return teams;
    },
    
    findUnique: async (params: FindUniqueParams) => {
      console.log(`Mock: Finding team with ID ${params.where.id}`, params);
      
      const team = mockTeams.find(t => t.id === params.where.id);
      
      if (!team) {
        return null;
      }
      
      const result = deepClone(team);
      
      if (params.include?.players) {
        result.players = deepClone(mockPlayers.filter(player => player.teamId === team.id));
      }
      
      return result;
    },
    
    create: async (params: CreateParams) => {
      console.log('Mock: Creating team', params.data);
      
      const newTeam = {
        id: `team${mockTeams.length + 1}`,
        name: params.data.name,
        players: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      mockTeams.push(newTeam);
      // Update the global reference to ensure persistence
      global.globalForPrisma.mockTeams = mockTeams;
      console.log(`Added team to mock database. Total teams: ${mockTeams.length}`);
      
      return deepClone(newTeam);
    },
    
    update: async (params: UpdateParams) => {
      console.log(`Mock: Updating team with ID ${params.where.id}`, params.data);
      
      const teamIndex = mockTeams.findIndex(t => t.id === params.where.id);
      
      if (teamIndex === -1) {
        throw new Error(`Team with ID ${params.where.id} not found`);
      }
      
      const updatedTeam = {
        ...mockTeams[teamIndex],
        ...params.data,
        updatedAt: new Date()
      };
      
      mockTeams[teamIndex] = updatedTeam;
      // Update the global reference to ensure persistence
      global.globalForPrisma.mockTeams = mockTeams;
      
      return deepClone(updatedTeam);
    },
    
    delete: async (params: DeleteParams) => {
      console.log(`Mock: Deleting team with ID ${params.where.id}`);
      
      const teamIndex = mockTeams.findIndex(t => t.id === params.where.id);
      
      if (teamIndex === -1) {
        throw new Error(`Team with ID ${params.where.id} not found`);
      }
      
      const deletedTeam = mockTeams[teamIndex];
      mockTeams.splice(teamIndex, 1);
      // Update the global reference to ensure persistence
      global.globalForPrisma.mockTeams = mockTeams;
      
      // Also delete all players associated with this team
      for (let i = mockPlayers.length - 1; i >= 0; i--) {
        if (mockPlayers[i].teamId === params.where.id) {
          mockPlayers.splice(i, 1);
        }
      }
      // Update the global players reference
      global.globalForPrisma.mockPlayers = mockPlayers;
      
      return deepClone(deletedTeam);
    }
  },
  
  player: {
    findMany: async (params: FindManyParams = {}) => {
      console.log('Mock: Finding all players', params);
      
      let players = deepClone(mockPlayers);
      
      // Apply where filters if provided
      if (params.where) {
        if (params.where.teamId) {
          players = players.filter(player => player.teamId === params.where?.teamId);
        }
      }
      
      // Handle sorting
      if (params.orderBy) {
        if (Array.isArray(params.orderBy)) {
          // Handle array of orderBy criteria
          params.orderBy.forEach(criterion => {
            const field = Object.keys(criterion)[0];
            const direction = criterion[field];
            
            if (field === 'name') {
              players.sort((a, b) => {
                return direction === 'asc' 
                  ? a.name.localeCompare(b.name)
                  : b.name.localeCompare(a.name);
              });
            }
          });
        } else if (isSingleOrderBy(params.orderBy)) {
          const orderBy = params.orderBy as OrderBy;
          if (orderBy.name) {
            players.sort((a, b) => {
              return orderBy.name === 'asc' 
                ? a.name.localeCompare(b.name)
                : b.name.localeCompare(a.name);
            });
          }
        }
      }
      
      if (params.include?.team) {
        // Include team for each player
        players = players.map(player => {
          const team = mockTeams.find(team => team.id === player.teamId);
          return { ...player, team: team ? deepClone(team) : null };
        });
      }
      
      return players;
    },
    
    findUnique: async (params: FindUniqueParams) => {
      console.log(`Mock: Finding player with ID ${params.where.id}`, params);
      
      const player = mockPlayers.find(p => p.id === params.where.id);
      
      if (!player) {
        return null;
      }
      
      const result = deepClone(player);
      
      if (params.include?.team) {
        const team = mockTeams.find(t => t.id === player.teamId);
        result.team = team ? deepClone(team) : null;
      }
      
      return result;
    },
    
    create: async (params: CreateParams) => {
      console.log('Mock: Creating player', params.data);
      
      const newPlayer = {
        id: `player${mockPlayers.length + 1}`,
        name: params.data.name,
        playerType: params.data.playerType || 'PRIMARY',
        handicapIndex: params.data.handicapIndex || 0,
        teamId: params.data.teamId,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      mockPlayers.push(newPlayer);
      // Update the global reference to ensure persistence
      global.globalForPrisma.mockPlayers = mockPlayers;
      console.log(`Added player to mock database. Total players: ${mockPlayers.length}`);
      
      const result = deepClone(newPlayer);
      
      if (params.include?.team) {
        const team = mockTeams.find(t => t.id === params.data.teamId);
        result.team = team ? deepClone(team) : null;
      }
      
      return result;
    },
    
    update: async (params: UpdateParams) => {
      console.log(`Mock: Updating player with ID ${params.where.id}`, params.data);
      
      const playerIndex = mockPlayers.findIndex(p => p.id === params.where.id);
      
      if (playerIndex === -1) {
        throw new Error(`Player with ID ${params.where.id} not found`);
      }
      
      const updatedPlayer = {
        ...mockPlayers[playerIndex],
        ...params.data,
        updatedAt: new Date()
      };
      
      mockPlayers[playerIndex] = updatedPlayer;
      // Update the global reference to ensure persistence
      global.globalForPrisma.mockPlayers = mockPlayers;
      
      const result = deepClone(updatedPlayer);
      
      if (params.include?.team) {
        const team = mockTeams.find(t => t.id === updatedPlayer.teamId);
        result.team = team ? deepClone(team) : null;
      }
      
      return result;
    },
    
    delete: async (params: DeleteParams) => {
      console.log(`Mock: Deleting player with ID ${params.where.id}`);
      
      const playerIndex = mockPlayers.findIndex(p => p.id === params.where.id);
      
      if (playerIndex === -1) {
        throw new Error(`Player with ID ${params.where.id} not found`);
      }
      
      const deletedPlayer = mockPlayers[playerIndex];
      mockPlayers.splice(playerIndex, 1);
      // Update the global reference to ensure persistence
      global.globalForPrisma.mockPlayers = mockPlayers;
      
      return deepClone(deletedPlayer);
    },
    
    deleteMany: async (params: DeleteManyParams = {}) => {
      console.log('Mock: Deleting multiple players', params.where);
      
      let count = 0;
      
      if (params.where?.teamId) {
        const initialCount = mockPlayers.length;
        
        for (let i = mockPlayers.length - 1; i >= 0; i--) {
          if (mockPlayers[i].teamId === params.where.teamId) {
            mockPlayers.splice(i, 1);
          }
        }
        
        count = initialCount - mockPlayers.length;
      } else {
        // If no specific filter, delete all players
        count = mockPlayers.length;
        mockPlayers.length = 0;
      }
      
      // Update the global reference to ensure persistence
      global.globalForPrisma.mockPlayers = mockPlayers;
      
      return { count };
    }
  },
  
  match: {
    findMany: async (params: FindManyParams = {}) => {
      console.log('Mock: Finding all matches', params);
      console.log(`Found ${mockMatches.length} matches in the mock database`);
      
      let matches = deepClone(mockMatches);
      
      if (params.include) {
        matches = matches.map(match => {
          const result = { ...match };
          
          if (params.include?.homeTeam) {
            result.homeTeam = deepClone(mockTeams.find(t => t.id === match.homeTeamId) || null);
          }
          
          if (params.include?.awayTeam) {
            result.awayTeam = deepClone(mockTeams.find(t => t.id === match.awayTeamId) || null);
          }
          
          return result;
        });
      }
      
      // Handle sorting
      if (params.orderBy) {
        if (Array.isArray(params.orderBy)) {
          // Handle array of orderBy criteria
          params.orderBy.forEach(criterion => {
            const field = Object.keys(criterion)[0];
            const direction = criterion[field];
            
            if (field === 'weekNumber') {
              matches.sort((a, b) => {
                return direction === 'asc' 
                  ? a.weekNumber - b.weekNumber
                  : b.weekNumber - a.weekNumber;
              });
            } else if (field === 'startingHole') {
              matches.sort((a, b) => {
                return direction === 'asc'
                  ? a.startingHole - b.startingHole
                  : b.startingHole - a.startingHole;
              });
            }
          });
        } else if (isSingleOrderBy(params.orderBy)) {
          const orderBy = params.orderBy as OrderBy;
          if (orderBy.weekNumber) {
            matches.sort((a, b) => {
              return orderBy.weekNumber === 'asc' 
                ? a.weekNumber - b.weekNumber
                : b.weekNumber - a.weekNumber;
            });
          } else if (orderBy.date) {
            matches.sort((a, b) => {
              const dateA = new Date(a.date);
              const dateB = new Date(b.date);
              return orderBy.date === 'asc' 
                ? dateA.getTime() - dateB.getTime()
                : dateB.getTime() - dateA.getTime();
            });
          } else if (orderBy.startingHole) {
            matches.sort((a, b) => {
              return orderBy.startingHole === 'asc'
                ? a.startingHole - b.startingHole
                : b.startingHole - a.startingHole;
            });
          }
        }
      }
      
      return matches;
    },
    
    findUnique: async (params: FindUniqueParams) => {
      console.log(`Mock: Finding match with ID ${params.where.id}`, params);
      
      const match = mockMatches.find(m => m.id === params.where.id);
      
      if (!match) {
        return null;
      }
      
      const result = deepClone(match);
      
      if (params.include) {
        if (params.include.homeTeam) {
          result.homeTeam = deepClone(mockTeams.find(t => t.id === match.homeTeamId) || null);
        }
        
        if (params.include.awayTeam) {
          result.awayTeam = deepClone(mockTeams.find(t => t.id === match.awayTeamId) || null);
        }
      }
      
      return result;
    },
    
    create: async (params: CreateParams) => {
      console.log('Mock: Creating match', params.data);
      
      const newMatch = {
        id: `match${mockMatches.length + 1}`,
        date: params.data.date,
        weekNumber: params.data.weekNumber,
        homeTeamId: params.data.homeTeamId,
        awayTeamId: params.data.awayTeamId,
        status: params.data.status || 'SCHEDULED',
        startingHole: params.data.startingHole || 1,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      mockMatches.push(newMatch);
      // Update the global reference to ensure persistence
      global.globalForPrisma.mockMatches = mockMatches;
      console.log(`Added match to mock database. Total matches: ${mockMatches.length}`);
      
      const result = deepClone(newMatch);
      
      if (params.include) {
        if (params.include.homeTeam) {
          result.homeTeam = deepClone(mockTeams.find(t => t.id === params.data.homeTeamId) || null);
        }
        
        if (params.include.awayTeam) {
          result.awayTeam = deepClone(mockTeams.find(t => t.id === params.data.awayTeamId) || null);
        }
      }
      
      return result;
    },
    
    update: async (params: UpdateParams) => {
      if (!params.where || !params.where.id) {
        throw new Error('Match ID is required for update operation');
      }
      
      console.log(`Mock: Updating match with ID ${params.where.id}`, params.data);
      
      const matchIndex = mockMatches.findIndex(m => m.id === params.where.id);
      
      if (matchIndex === -1) {
        throw new Error(`Match with ID ${params.where.id} not found`);
      }
      
      const updatedMatch = {
        ...mockMatches[matchIndex],
        ...params.data,
        updatedAt: new Date()
      };
      
      mockMatches[matchIndex] = updatedMatch;
      // Update the global reference to ensure persistence
      global.globalForPrisma.mockMatches = mockMatches;
      
      const result = deepClone(updatedMatch);
      
      if (params.include) {
        if (params.include.homeTeam) {
          result.homeTeam = deepClone(mockTeams.find(t => t.id === updatedMatch.homeTeamId) || null);
        }
        
        if (params.include.awayTeam) {
          result.awayTeam = deepClone(mockTeams.find(t => t.id === updatedMatch.awayTeamId) || null);
        }
      }
      
      return result;
    },
    
    count: async (params: FindManyParams = {}) => {
      console.log('Mock: Counting matches', params);
      
      // Apply filters if provided
      let filteredMatches = mockMatches;
      if (params.where) {
        // Add filtering logic based on params.where
        // For example, if filtering by status:
        if (params.where.status) {
          filteredMatches = filteredMatches.filter(match => match.status === params.where?.status);
        }
        // Add more filters as needed
      }
      
      return filteredMatches.length;
    },
    
    deleteMany: async () => {
      console.log('Mock: Deleting all matches');
      
      const count = mockMatches.length;
      mockMatches.length = 0;
      // Update the global reference to ensure persistence
      global.globalForPrisma.mockMatches = mockMatches;
      console.log(`Deleted all ${count} matches from mock database`);
      
      return { count };
    }
  },
  matchPlayer: {
    findMany: async ({ where }: { where?: any } = {}) => {
      let matchPlayers = [...global.globalForPrisma.mockMatchPlayers]
      
      if (where) {
        if (where.matchId) {
          matchPlayers = matchPlayers.filter((mp) => mp.matchId === where.matchId)
        }
        if (where.playerId) {
          matchPlayers = matchPlayers.filter((mp) => mp.playerId === where.playerId)
        }
      }
      
      return matchPlayers
    },
    findFirst: async ({ where }: { where: any }) => {
      let matchPlayers = [...global.globalForPrisma.mockMatchPlayers]
      
      if (where.matchId) {
        matchPlayers = matchPlayers.filter((mp) => mp.matchId === where.matchId)
      }
      if (where.playerId) {
        matchPlayers = matchPlayers.filter((mp) => mp.playerId === where.playerId)
      }
      
      return matchPlayers[0] || null
    },
    upsert: async ({ 
      where, 
      create, 
      update 
    }: { 
      where: { matchId_playerId: { matchId: string; playerId: string } }; 
      create: any; 
      update: any 
    }) => {
      const { matchId, playerId } = where.matchId_playerId
      const existingIndex = global.globalForPrisma.mockMatchPlayers.findIndex(
        (mp) => mp.matchId === matchId && mp.playerId === playerId
      )
      
      if (existingIndex !== -1) {
        // Update existing record
        const updatedMatchPlayer = {
          ...global.globalForPrisma.mockMatchPlayers[existingIndex],
          ...update,
          updatedAt: new Date(),
        }
        global.globalForPrisma.mockMatchPlayers[existingIndex] = updatedMatchPlayer
        return updatedMatchPlayer
      } else {
        // Create new record
        const newMatchPlayer = {
          id: `matchPlayer-${global.globalForPrisma.mockMatchPlayers.length + 1}`,
          ...create,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        global.globalForPrisma.mockMatchPlayers.push(newMatchPlayer)
        return newMatchPlayer
      }
    },
    delete: async ({ where }: { where: { matchId_playerId: { matchId: string; playerId: string } } }) => {
      const { matchId, playerId } = where.matchId_playerId
      const index = global.globalForPrisma.mockMatchPlayers.findIndex(
        (mp) => mp.matchId === matchId && mp.playerId === playerId
      )
      
      if (index === -1) {
        throw new Error('MatchPlayer not found')
      }
      
      const deletedMatchPlayer = global.globalForPrisma.mockMatchPlayers[index]
      global.globalForPrisma.mockMatchPlayers.splice(index, 1)
      return deletedMatchPlayer
    },
  },
  matchScore: {
    findMany: async (params: any = {}) => {
      if (!global.globalForPrisma.mockMatchScores) {
        global.globalForPrisma.mockMatchScores = [];
      }

      let results = [...global.globalForPrisma.mockMatchScores];

      // Apply filtering if where clause is provided
      if (params?.where) {
        // Filter by matchId
        if (params.where.matchId) {
          results = results.filter(score => score.matchId === params.where.matchId);
        }

        // Filter by playerId
        if (params.where.playerId) {
          results = results.filter(score => score.playerId === params.where.playerId);
        }

        // Filter by teamId
        if (params.where.teamId) {
          results = results.filter(score => score.teamId === params.where.teamId);
        }

        // Filter by holeNumber
        if (params.where.holeNumber) {
          results = results.filter(score => score.holeNumber === params.where.holeNumber);
        }

        // Filter by OR conditions
        if (params.where.OR) {
          results = results.filter(score => {
            return params.where.OR.some((condition: any) => {
              // Check if all conditions in this OR branch match
              return Object.entries(condition).every(([key, value]) => {
                return score[key as keyof typeof score] === value;
              });
            });
          });
        }
      }

      // Handle includes
      if (params?.include) {
        results = results.map(score => {
          const result = { ...score };

          // Include player data if requested
          if (params.include.player) {
            const player = global.globalForPrisma.mockPlayers.find(
              player => player.id === score.playerId
            );
            result.player = player || null;
          }

          // Include match data if requested
          if (params.include.match) {
            const match = global.globalForPrisma.mockMatches.find(
              match => match.id === score.matchId
            );
            result.match = match || null;
          }

          return result;
        });
      }

      // Handle orderBy
      if (params?.orderBy) {
        const orderByField = Object.keys(params.orderBy)[0];
        const orderDirection = params.orderBy[orderByField];

        results.sort((a, b) => {
          if (a[orderByField as keyof typeof a] < b[orderByField as keyof typeof b]) {
            return orderDirection === 'asc' ? -1 : 1;
          }
          if (a[orderByField as keyof typeof a] > b[orderByField as keyof typeof b]) {
            return orderDirection === 'asc' ? 1 : -1;
          }
          return 0;
        });
      }

      return results;
    },

    findUnique: async (params: any = {}) => {
      if (!global.globalForPrisma.mockMatchScores) {
        global.globalForPrisma.mockMatchScores = [];
      }

      if (!params?.where) {
        return null;
      }

      // Find by ID
      if (params.where.id) {
        return global.globalForPrisma.mockMatchScores.find(score => score.id === params.where.id) || null;
      }

      // Find by unique combination of matchId, playerId, and holeNumber
      if (params.where.matchId_playerId_hole) {
        const { matchId, playerId, hole } = params.where.matchId_playerId_hole;
        return global.globalForPrisma.mockMatchScores.find(
          score => 
            score.matchId === matchId && 
            score.playerId === playerId && 
            score.hole === hole
        ) || null;
      }

      return null;
    },

    create: async (params: any = {}) => {
      if (!global.globalForPrisma.mockMatchScores) {
        global.globalForPrisma.mockMatchScores = [];
      }

      if (!params?.data) {
        throw new Error('Data is required for creating a match score');
      }

      const newScore = {
        id: `score${global.globalForPrisma.mockMatchScores.length + 1}`,
        ...params.data,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      global.globalForPrisma.mockMatchScores.push(newScore);
      
      // Log the creation for debugging
      console.log(`Created match score: ${JSON.stringify(newScore)}`);
      
      return newScore;
    },

    update: async (params: any = {}) => {
      if (!global.globalForPrisma.mockMatchScores) {
        global.globalForPrisma.mockMatchScores = [];
      }

      if (!params?.where || !params?.data) {
        throw new Error('Both where and data are required for updating a match score');
      }

      let scoreToUpdate;
      let scoreIndex = -1;

      // Find by ID
      if (params.where.id) {
        scoreIndex = global.globalForPrisma.mockMatchScores.findIndex(score => score.id === params.where.id);
      }
      
      // Find by unique combination of matchId, playerId, and holeNumber
      else if (params.where.matchId_playerId_hole) {
        const { matchId, playerId, hole } = params.where.matchId_playerId_hole;
        scoreIndex = global.globalForPrisma.mockMatchScores.findIndex(
          score => 
            score.matchId === matchId && 
            score.playerId === playerId && 
            score.hole === hole
        );
      }

      if (scoreIndex === -1) {
        throw new Error('Match score not found');
      }

      scoreToUpdate = global.globalForPrisma.mockMatchScores[scoreIndex];
      
      // Update the score
      const updatedScore = {
        ...scoreToUpdate,
        ...params.data,
        updatedAt: new Date()
      };

      global.globalForPrisma.mockMatchScores[scoreIndex] = updatedScore;
      
      // Log the update for debugging
      console.log(`Updated match score: ${JSON.stringify(updatedScore)}`);
      
      return updatedScore;
    },

    upsert: async (params: any = {}) => {
      if (!global.globalForPrisma.mockMatchScores) {
        global.globalForPrisma.mockMatchScores = [];
      }

      if (!params?.where || !params?.create || !params?.update) {
        throw new Error('where, create, and update are required for upserting a match score');
      }

      let existingScore;

      // Find by ID
      if (params.where.id) {
        existingScore = global.globalForPrisma.mockMatchScores.find(score => score.id === params.where.id);
      }
      
      // Find by unique combination of matchId, playerId, and holeNumber
      else if (params.where.matchId_playerId_hole) {
        const { matchId, playerId, hole } = params.where.matchId_playerId_hole;
        existingScore = global.globalForPrisma.mockMatchScores.find(
          score => 
            score.matchId === matchId && 
            score.playerId === playerId && 
            score.hole === hole
        );
      }

      // If score exists, update it
      if (existingScore) {
        return mockPrismaClient.matchScore.update({
          where: params.where,
          data: params.update
        });
      }
      
      // Otherwise, create a new score
      return mockPrismaClient.matchScore.create({
        data: params.create
      });
    },

    deleteMany: async (params: any = {}) => {
      if (!global.globalForPrisma.mockMatchScores) {
        global.globalForPrisma.mockMatchScores = [];
      }

      const initialCount = global.globalForPrisma.mockMatchScores.length;

      if (params?.where) {
        // Delete by matchId
        if (params.where.matchId) {
          global.globalForPrisma.mockMatchScores = global.globalForPrisma.mockMatchScores.filter(
            score => score.matchId !== params.where.matchId
          );
        }

        // Delete by playerId
        if (params.where.playerId) {
          global.globalForPrisma.mockMatchScores = global.globalForPrisma.mockMatchScores.filter(
            score => score.playerId !== params.where.playerId
          );
        }

        // Delete by teamId
        if (params.where.teamId) {
          global.globalForPrisma.mockMatchScores = global.globalForPrisma.mockMatchScores.filter(
            score => score.teamId !== params.where.teamId
          );
        }

        // Delete by holeNumber
        if (params.where.hole) {
          global.globalForPrisma.mockMatchScores = global.globalForPrisma.mockMatchScores.filter(
            score => score.hole !== params.where.hole
          );
        }

        // Delete by OR conditions
        if (params.where.OR) {
          global.globalForPrisma.mockMatchScores = global.globalForPrisma.mockMatchScores.filter(score => {
            return !params.where.OR.some((condition: any) => {
              // Check if all conditions in this OR branch match
              return Object.entries(condition).every(([key, value]) => {
                return score[key as keyof typeof score] === value;
              });
            });
          });
        }
      } else {
        // If no where clause, delete all scores
        global.globalForPrisma.mockMatchScores = [];
      }

      const deletedCount = initialCount - global.globalForPrisma.mockMatchScores.length;
      
      // Log the deletion for debugging
      console.log(`Deleted ${deletedCount} match scores`);
      
      return { count: deletedCount };
    }
  },
};

// Create a real Prisma client instance
let prismaClient: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prismaClient = new PrismaClient({
    log: ['error', 'warn'],
  });
} else {
  // In development, use a global variable to prevent multiple instances during hot reloading
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      log: ['query', 'info', 'warn', 'error'],
    });
  }
  prismaClient = global.prisma;
}

// Check if we should use mock data
const useMockData = process.env.USE_MOCK_DATA === 'true';

// Export the appropriate client
export const prisma = useMockData ? (mockPrismaClient as unknown as PrismaClient) : prismaClient; 