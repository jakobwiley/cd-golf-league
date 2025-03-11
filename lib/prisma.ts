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

// Create a mock client for development with placeholder credentials
const mockPrismaClient = {
  $transaction: async (callback) => {
    console.log('Using mock transaction');
    // Create a transaction proxy that mimics the real transaction
    const txClient = {
      player: {
        deleteMany: async (data) => {
          console.log('Mock deleting players:', data);
          return { count: 1 };
        }
      },
      team: {
        delete: async (data) => {
          console.log('Mock deleting team:', data);
          return { id: data.where.id, name: 'Deleted Team' };
        }
      }
    };
    
    // Execute the callback with our transaction proxy
    return await callback(txClient);
  },
  team: {
    findMany: async (options?: any) => {
      console.log('Using mock team data');
      
      // Create mock match data
      const mockMatch = {
        id: 'match1',
        date: new Date(),
        weekNumber: 1,
        homeTeamId: 'team1',
        awayTeamId: 'team2',
        status: 'COMPLETED',
        points: [
          { teamId: 'team1', points: 2 },
          { teamId: 'team2', points: 1 }
        ]
      };
      
      const teams = [
        {
          id: 'team1',
          name: 'Team Alpha',
          players: [
            { id: 'player1', name: 'John Doe', handicapIndex: 12.5 },
            { id: 'player2', name: 'Jane Smith', handicapIndex: 14.2 }
          ],
          homeMatches: [mockMatch],
          awayMatches: []
        },
        {
          id: 'team2',
          name: 'Team Beta',
          players: [
            { id: 'player3', name: 'Bob Johnson', handicapIndex: 10.8 },
            { id: 'player4', name: 'Alice Williams', handicapIndex: 15.3 }
          ],
          homeMatches: [],
          awayMatches: [mockMatch]
        }
      ];
      
      // If include is specified, handle it
      if (options?.include) {
        // Already included above
      }
      
      return teams;
    },
    findUnique: async (options?: any) => {
      console.log('Mock finding unique team:', options);
      if (options?.where?.id === 'team1') {
        return { 
          id: 'team1', 
          name: 'Team Alpha',
          players: [
            { id: 'player1', name: 'John Doe', handicapIndex: 12.5 },
            { id: 'player2', name: 'Jane Smith', handicapIndex: 14.2 }
          ],
          homeMatches: [],
          awayMatches: []
        };
      } else if (options?.where?.id === 'team2') {
        return { 
          id: 'team2', 
          name: 'Team Beta',
          players: [
            { id: 'player3', name: 'Bob Johnson', handicapIndex: 10.8 },
            { id: 'player4', name: 'Alice Williams', handicapIndex: 15.3 }
          ],
          homeMatches: [],
          awayMatches: []
        };
      }
      return null;
    },
    create: async (data: any) => data.data,
    update: async (data: any) => data.data,
    delete: async (data: any) => {
      console.log('Mock deleting team:', data);
      return { id: data.where.id, name: 'Deleted Team' };
    }
  },
  player: {
    findMany: async () => [
      { id: 'player1', name: 'John Doe', handicapIndex: 12.5, teamId: 'team1' },
      { id: 'player2', name: 'Jane Smith', handicapIndex: 14.2, teamId: 'team1' },
      { id: 'player3', name: 'Bob Johnson', handicapIndex: 10.8, teamId: 'team2' },
      { id: 'player4', name: 'Alice Williams', handicapIndex: 15.3, teamId: 'team2' }
    ],
    findUnique: async () => ({ id: 'player1', name: 'John Doe', handicapIndex: 12.5, teamId: 'team1' }),
    create: async (data: any) => data.data,
    update: async (data: any) => data.data,
    delete: async () => ({ id: 'deleted' }),
    deleteMany: async (data: any) => {
      console.log('Mock deleting players:', data);
      return { count: data?.where?.teamId ? 2 : 1 };
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
          homeTeam: { id: 'team1', name: 'Team Alpha' },
          awayTeam: { id: 'team2', name: 'Team Beta' },
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
      homeTeam: { id: 'team1', name: 'Team Alpha' },
      awayTeam: { id: 'team2', name: 'Team Beta' },
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
    prismaClient = mockPrismaClient;
  } else {
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
  prismaClient = mockPrismaClient;
}

// Always use the mock client when using placeholder credentials
export const prisma = isUsingPlaceholders ? mockPrismaClient : prismaClient; 