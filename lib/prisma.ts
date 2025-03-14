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
  console.log('Initializing mock teams data');
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

// Initialize global mock players if it doesn't exist or is empty
if (!globalForPrisma.mockPlayers || globalForPrisma.mockPlayers.length === 0) {
  console.log('Initializing mock players data');
  globalForPrisma.mockPlayers = [];
  
  // Pre-populate with players
  const playerData = [
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
  
  // Add players to the mock database
  playerData.forEach((player, index) => {
    globalForPrisma.mockPlayers.push({
      id: `player${index + 1}`,
      name: player.name,
      playerType: 'PRIMARY',
      handicapIndex: player.handicapIndex,
      teamId: player.teamId,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  });
  
  console.log(`Initialized ${globalForPrisma.mockPlayers.length} players in the mock database`);
}

// Initialize global mock matches if it doesn't exist
if (!globalForPrisma.mockMatches) {
  console.log('Initializing empty matches array in the mock database');
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
          globalForPrisma.mockPlayers = mockPlayers;
          
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
            globalForPrisma.mockTeams = mockTeams;
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
      globalForPrisma.mockTeams = mockTeams;
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
      globalForPrisma.mockTeams = mockTeams;
      
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
      globalForPrisma.mockTeams = mockTeams;
      
      // Also delete all players associated with this team
      for (let i = mockPlayers.length - 1; i >= 0; i--) {
        if (mockPlayers[i].teamId === params.where.id) {
          mockPlayers.splice(i, 1);
        }
      }
      // Update the global players reference
      globalForPrisma.mockPlayers = mockPlayers;
      
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
          players = players.filter(player => player.teamId === params.where.teamId);
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
      globalForPrisma.mockPlayers = mockPlayers;
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
      globalForPrisma.mockPlayers = mockPlayers;
      
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
      globalForPrisma.mockPlayers = mockPlayers;
      
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
      globalForPrisma.mockPlayers = mockPlayers;
      
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
      globalForPrisma.mockMatches = mockMatches;
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
    
    deleteMany: async () => {
      console.log('Mock: Deleting all matches');
      
      const count = mockMatches.length;
      mockMatches.length = 0;
      // Update the global reference to ensure persistence
      globalForPrisma.mockMatches = mockMatches;
      console.log(`Deleted all ${count} matches from mock database`);
      
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