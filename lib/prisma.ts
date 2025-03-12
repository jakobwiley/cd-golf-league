import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

// Check if we're using placeholder credentials
const isUsingPlaceholders = 
  !process.env.DATABASE_URL || 
  process.env.DATABASE_URL.includes('placeholder') ||
  !process.env.DATABASE_URL.startsWith('postgresql://');

// Ensure DATABASE_URL has the correct format
const databaseUrl = process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('postgresql://') 
  ? process.env.DATABASE_URL 
  : "postgresql://placeholder:placeholder@localhost:5432/placeholder";

// Store teams in memory so they persist between requests
let mockTeams = [
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

// Store players in memory so they persist between requests
let mockPlayers = [
  // Initial players can be added here if needed
];

// Create a mock client for development with placeholder credentials
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
          mockPlayers = mockPlayers.filter(p => p.teamId !== teamId);
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
    findMany: async (options?: any) => {
      console.log('Using mock team data');
      
      // Return a deep copy of the teams to prevent accidental modification
      const teamsCopy = JSON.parse(JSON.stringify(mockTeams));
      
      // If include is specified, handle it
      if (options?.include?.players) {
        // Add players to each team
        for (const team of teamsCopy) {
          team.players = mockPlayers
            .filter(p => p.teamId === team.id)
            .map(p => JSON.parse(JSON.stringify(p)));
        }
      }
      
      // Handle orderBy if specified
      if (options?.orderBy?.name === 'asc') {
        teamsCopy.sort((a, b) => a.name.localeCompare(b.name));
      } else if (options?.orderBy?.name === 'desc') {
        teamsCopy.sort((a, b) => b.name.localeCompare(a.name));
      }
      
      return teamsCopy;
    },
    findUnique: async (options?: any) => {
      console.log('Mock finding unique team:', options);
      
      const teamId = options?.where?.id;
      const team = mockTeams.find(t => t.id === teamId);
      
      if (team) {
        // Create a deep copy
        const teamCopy = JSON.parse(JSON.stringify(team));
        
        // If include is specified, handle it
        if (options?.include?.players) {
          teamCopy.players = mockPlayers
            .filter(p => p.teamId === teamId)
            .map(p => JSON.parse(JSON.stringify(p)));
        }
        
        return teamCopy;
      }
      
      return null;
    },
    create: async (options?: any) => {
      console.log('Mock creating team:', options);
      const teamData = options?.data || {};
      
      // Generate a random ID if not provided
      const id = teamData.id || `team${Math.floor(Math.random() * 10000)}`;
      
      // Create the team object
      const newTeam = {
        id,
        name: teamData.name || 'New Team',
        players: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Add to the mock teams array
      mockTeams.push(newTeam);
      
      console.log('Created mock team:', newTeam);
      
      // Return a deep copy to prevent accidental modification
      return JSON.parse(JSON.stringify(newTeam));
    },
    update: async (data: any) => {
      console.log('Mock updating team:', data);
      
      const teamId = data.where.id;
      const teamIndex = mockTeams.findIndex(t => t.id === teamId);
      
      if (teamIndex !== -1) {
        // Update the team
        mockTeams[teamIndex] = {
          ...mockTeams[teamIndex],
          ...data.data,
          updatedAt: new Date()
        };
        
        console.log('Updated mock team:', mockTeams[teamIndex]);
        
        // Return a deep copy to prevent accidental modification
        return JSON.parse(JSON.stringify(mockTeams[teamIndex]));
      }
      
      throw new Error(`Team with ID ${teamId} not found`);
    },
    delete: async (data: any) => {
      console.log('Mock deleting team:', data);
      
      const teamId = data.where.id;
      const teamIndex = mockTeams.findIndex(t => t.id === teamId);
      
      if (teamIndex !== -1) {
        const deletedTeam = mockTeams[teamIndex];
        mockTeams.splice(teamIndex, 1);
        
        // Also delete all players associated with this team
        const initialPlayerCount = mockPlayers.length;
        mockPlayers = mockPlayers.filter(p => p.teamId !== teamId);
        const deletedPlayerCount = initialPlayerCount - mockPlayers.length;
        
        console.log(`Mock deleted team: ${deletedTeam.name} and ${deletedPlayerCount} associated players`);
        
        // Return a deep copy to prevent accidental modification
        return JSON.parse(JSON.stringify(deletedTeam));
      }
      
      throw new Error(`Team with ID ${teamId} not found`);
    }
  },
  player: {
    findMany: async (options?: any) => {
      console.log('Mock finding players:', options);
      
      let filteredPlayers = [...mockPlayers];
      
      // Apply where filters if specified
      if (options?.where) {
        if (options.where.teamId) {
          filteredPlayers = filteredPlayers.filter(p => p.teamId === options.where.teamId);
        }
        // Add more filters as needed
      }
      
      // Handle include if specified
      if (options?.include?.team) {
        filteredPlayers = filteredPlayers.map(player => {
          const team = mockTeams.find(t => t.id === player.teamId);
          return {
            ...player,
            team: team ? JSON.parse(JSON.stringify(team)) : null
          };
        });
      }
      
      console.log(`Returning ${filteredPlayers.length} mock players`);
      
      // Return a deep copy to prevent accidental modification
      return JSON.parse(JSON.stringify(filteredPlayers));
    },
    findUnique: async (options?: any) => {
      console.log('Mock finding unique player:', options);
      
      const playerId = options?.where?.id;
      const player = mockPlayers.find(p => p.id === playerId);
      
      if (player) {
        // Create a deep copy
        const playerCopy = JSON.parse(JSON.stringify(player));
        
        // If include is specified, handle it
        if (options?.include?.team) {
          const team = mockTeams.find(t => t.id === player.teamId);
          playerCopy.team = team ? JSON.parse(JSON.stringify(team)) : null;
        }
        
        return playerCopy;
      }
      
      return null;
    },
    create: async (options?: any) => {
      console.log('Mock creating player with options:', JSON.stringify(options, null, 2));
      
      try {
        const playerData = options?.data || {};
        
        // Validate required fields
        if (!playerData.name) {
          console.error('Player name is required');
          throw new Error('Player name is required');
        }
        
        if (!playerData.teamId) {
          console.error('Team ID is required');
          throw new Error('Team ID is required');
        }
        
        // Check if team exists
        const team = mockTeams.find(t => t.id === playerData.teamId);
        if (!team) {
          console.error(`Team with ID ${playerData.teamId} not found`);
          throw new Error(`Team with ID ${playerData.teamId} not found`);
        }
        
        // Generate a random ID if not provided
        const id = playerData.id || `player${Math.floor(Math.random() * 10000)}`;
        
        // Create the player object
        const newPlayer = {
          id,
          name: playerData.name,
          teamId: playerData.teamId,
          ghinNumber: playerData.ghinNumber || null,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        // Add to the mock players array
        mockPlayers.push(newPlayer);
        
        console.log('Created mock player:', JSON.stringify(newPlayer, null, 2));
        console.log(`Current mock players count: ${mockPlayers.length}`);
        
        // Return a deep copy to prevent accidental modification
        return JSON.parse(JSON.stringify(newPlayer));
      } catch (error) {
        console.error('Error in mock player creation:', error);
        throw error; // Re-throw to be handled by the API
      }
    },
    update: async (data: any) => {
      console.log('Mock updating player:', data);
      
      const playerId = data.where.id;
      const playerIndex = mockPlayers.findIndex(p => p.id === playerId);
      
      if (playerIndex !== -1) {
        // Update the player
        mockPlayers[playerIndex] = {
          ...mockPlayers[playerIndex],
          ...data.data,
          updatedAt: new Date()
        };
        
        console.log('Updated mock player:', mockPlayers[playerIndex]);
        
        // Return a deep copy to prevent accidental modification
        return JSON.parse(JSON.stringify(mockPlayers[playerIndex]));
      }
      
      throw new Error(`Player with ID ${playerId} not found`);
    },
    delete: async (data: any) => {
      console.log('Mock deleting player:', data);
      
      const playerId = data.where.id;
      const playerIndex = mockPlayers.findIndex(p => p.id === playerId);
      
      if (playerIndex !== -1) {
        const deletedPlayer = mockPlayers[playerIndex];
        mockPlayers.splice(playerIndex, 1);
        console.log('Mock deleted player:', deletedPlayer);
        
        // Return a deep copy to prevent accidental modification
        return JSON.parse(JSON.stringify(deletedPlayer));
      }
      
      throw new Error(`Player with ID ${playerId} not found`);
    },
    deleteMany: async (data: any) => {
      console.log('Mock deleting players:', data);
      
      let deletedCount = 0;
      
      if (data?.where?.teamId) {
        const teamId = data.where.teamId;
        const initialCount = mockPlayers.length;
        mockPlayers = mockPlayers.filter(p => p.teamId !== teamId);
        deletedCount = initialCount - mockPlayers.length;
        console.log(`Deleted ${deletedCount} players for team ${teamId}`);
      } else {
        // Handle other deletion criteria if needed
        deletedCount = 1; // Default for backward compatibility
      }
      
      return { count: deletedCount };
    }
  },
  match: {
    findMany: async () => {
      const today = new Date();
      return [
        {
          id: 'match1',
          date: new Date(today.setDate(today.getDate() + 7)),
          weekNumber: 1,
          homeTeamId: 'team1',
          awayTeamId: 'team2',
          homeTeam: { id: 'team1', name: 'Nick/Brent' },
          awayTeam: { id: 'team2', name: 'Hot/Huerter' },
          status: 'SCHEDULED',
          points: [
            { teamId: 'team1', points: 2 },
            { teamId: 'team2', points: 1 }
          ]
        }
      ];
    },
    findUnique: async () => ({ 
      id: 'match1', 
      date: new Date(), 
      weekNumber: 1,
      homeTeamId: 'team1',
      awayTeamId: 'team2',
      homeTeam: { id: 'team1', name: 'Nick/Brent' },
      awayTeam: { id: 'team2', name: 'Hot/Huerter' },
      status: 'SCHEDULED',
      points: [
        { teamId: 'team1', points: 2 },
        { teamId: 'team2', points: 1 }
      ]
    }),
    create: async (data: any) => data.data,
    update: async (data: any) => data.data,
    delete: async () => ({ id: 'deleted' }),
    deleteMany: async (data: any) => {
      console.log('Mock deleting matches:', data);
      return { count: 1 };
    }
  },
  matchScore: {
    findMany: async () => [],
    findUnique: async () => null,
    create: async (data: any) => data.data,
    update: async (data: any) => data.data,
    delete: async () => ({ id: 'deleted' })
  },
  matchPoints: {
    findMany: async () => [],
    findUnique: async () => null,
    create: async (data: any) => data.data,
    update: async (data: any) => data.data,
    delete: async () => ({ id: 'deleted' })
  }
} as unknown as PrismaClient;

// Create the real client with error handling
let prismaClient: PrismaClient;

try {
  // Always use the mock client when using placeholder credentials
  if (isUsingPlaceholders) {
    console.log('Using mock Prisma client for development');
    console.log('Database URL:', process.env.DATABASE_URL);
    console.log('Is using placeholders:', isUsingPlaceholders);
    prismaClient = mockPrismaClient;
  } else {
    console.log('Using real Prisma client');
    console.log('Database URL:', process.env.DATABASE_URL);
    prismaClient = globalForPrisma.prisma || new PrismaClient({
      log: ['query'],
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
    });
    
    if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prismaClient;
  }
} catch (error) {
  console.error('Failed to initialize Prisma client:', error);
  console.log('Falling back to mock Prisma client');
  prismaClient = mockPrismaClient;
}

export const prisma = prismaClient; 