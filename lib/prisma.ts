// This is a mock implementation of the Prisma client for development
// It uses in-memory arrays to store data

import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { 
  prisma: PrismaClient,
  mockTeams: any[],
  mockPlayers: any[],
  mockMatches: any[]
}

// Check if we're using placeholder credentials
const isUsingPlaceholders = 
  !process.env.DATABASE_URL || 
  process.env.DATABASE_URL.includes('placeholder') ||
  !process.env.DATABASE_URL.startsWith('postgresql://');

// Ensure DATABASE_URL has the correct format
const databaseUrl = process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('postgresql://') 
  ? process.env.DATABASE_URL 
  : "postgresql://placeholder:placeholder@localhost:5432/placeholder";

// Initialize global mock data if it doesn't exist
if (!globalForPrisma.mockTeams) {
  globalForPrisma.mockTeams = [
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
}

// Initialize global mock players if it doesn't exist
if (!globalForPrisma.mockPlayers) {
  globalForPrisma.mockPlayers = [];
}

// Initialize global mock matches if it doesn't exist
if (!globalForPrisma.mockMatches) {
  globalForPrisma.mockMatches = [];
}

// Access the global mock data
const mockTeams = globalForPrisma.mockTeams;
const mockPlayers = globalForPrisma.mockPlayers;
const mockMatches = globalForPrisma.mockMatches;

// Helper function to deep clone objects
function deepClone(obj: any) {
  return JSON.parse(JSON.stringify(obj));
}

// Define types for function parameters
interface FindManyParams {
  include?: Record<string, boolean>;
  orderBy?: Record<string, 'asc' | 'desc'>;
  where?: Record<string, any>;
}

interface FindUniqueParams {
  where: { id: string };
  include?: Record<string, boolean>;
}

interface CreateParams {
  data: Record<string, any>;
  include?: Record<string, boolean>;
}

interface UpdateParams {
  where: { id: string };
  data: Record<string, any>;
  include?: Record<string, boolean>;
}

interface DeleteParams {
  where: { id: string };
}

interface DeleteManyParams {
  where?: Record<string, any>;
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
    findMany: async (params: FindManyParams = {}) => {
      console.log('Mock: Finding all teams');
      
      let teams = deepClone(mockTeams);
      
      if (params.include?.players) {
        // Include players for each team
        teams = teams.map(team => {
          const teamPlayers = mockPlayers.filter(player => player.teamId === team.id);
          return { ...team, players: deepClone(teamPlayers) };
        });
      }
      
      if (params.orderBy?.name) {
        teams.sort((a, b) => {
          return params.orderBy?.name === 'asc' 
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        });
      }
      
      return teams;
    },
    
    findUnique: async (params: FindUniqueParams) => {
      console.log(`Mock: Finding team with ID ${params.where.id}`);
      
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
      
      // Also delete all players associated with this team
      for (let i = mockPlayers.length - 1; i >= 0; i--) {
        if (mockPlayers[i].teamId === params.where.id) {
          mockPlayers.splice(i, 1);
        }
      }
      
      return deepClone(deletedTeam);
    }
  },
  
  player: {
    findMany: async (params: FindManyParams = {}) => {
      console.log('Mock: Finding all players', params.where);
      
      let players = deepClone(mockPlayers);
      
      // Apply where filters if provided
      if (params.where) {
        if (params.where.teamId) {
          players = players.filter(player => player.teamId === params.where.teamId);
        }
      }
      
      if (params.orderBy?.name) {
        players.sort((a, b) => {
          return params.orderBy?.name === 'asc' 
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        });
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
      console.log(`Mock: Finding player with ID ${params.where.id}`);
      
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
        handicapIndex: params.data.handicapIndex || 0,
        teamId: params.data.teamId,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      mockPlayers.push(newPlayer);
      
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
      
      return { count };
    }
  },
  
  match: {
    findMany: async (params: FindManyParams = {}) => {
      console.log('Mock: Finding all matches');
      
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
      
      if (params.orderBy) {
        if (params.orderBy.weekNumber) {
          matches.sort((a, b) => {
            return params.orderBy?.weekNumber === 'asc' 
              ? a.weekNumber - b.weekNumber
              : b.weekNumber - a.weekNumber;
          });
        } else if (params.orderBy.date) {
          matches.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return params.orderBy?.date === 'asc' 
              ? dateA.getTime() - dateB.getTime()
              : dateB.getTime() - dateA.getTime();
          });
        } else if (params.orderBy.startingHole) {
          matches.sort((a, b) => {
            return params.orderBy?.startingHole === 'asc'
              ? a.startingHole - b.startingHole
              : b.startingHole - a.startingHole;
          });
        }
      }
      
      return matches;
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
    
    deleteMany: async () => {
      console.log('Mock: Deleting all matches');
      
      const count = mockMatches.length;
      mockMatches.length = 0;
      
      return { count };
    }
  }
};

// Use the real Prisma client in production, mock in development
export const prisma = isUsingPlaceholders
  ? mockPrismaClient as unknown as PrismaClient
  : globalForPrisma.prisma || new PrismaClient({
      log: ['query'],
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
    })

// Save the Prisma client to the global object in development
if (!isUsingPlaceholders && process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
} 