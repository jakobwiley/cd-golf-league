import { PrismaClient, Team, Player, Prisma } from '@prisma/client'
import { teams, players, matches, getTeam, getPlayer, getTeamPlayers, getTeamMatches, getWeekMatches } from './data'

// Define types for mock data
type MockTeam = Team & {
  players?: MockPlayer[];
}

type MockPlayer = Player & {
  team?: MockTeam;
}

// Define the extended PrismaClient type
type ExtendedPrismaClient = PrismaClient & {
  playerSubstitution: {
    findMany: (args: { where: { matchId: string } }) => Promise<any[]>;
    findUnique: (args: { where: { id: string } }) => Promise<any | null>;
    create: (args: { data: any }) => Promise<any>;
    update: (args: { where: { id: string }; data: any }) => Promise<any>;
    delete: (args: { where: { id: string } }) => Promise<any>;
    deleteMany: (args: { where: { matchId: string } }) => Promise<{ count: number }>;
  };
}

// Store teams in memory so they persist between requests
let mockTeams: MockTeam[] = [
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
let mockPlayers: MockPlayer[] = [];

// Store match scores in memory
let mockMatchScores: any[] = [];

// Store player substitutions in memory
let mockPlayerSubstitutions: any[] = [];

// Store match points in memory
let mockMatchPoints: any[] = [];

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
      
      // Handle orderBy if specified
      if (options?.orderBy?.name === 'asc') {
        filteredPlayers.sort((a, b) => a.name.localeCompare(b.name));
      } else if (options?.orderBy?.name === 'desc') {
        filteredPlayers.sort((a, b) => b.name.localeCompare(a.name));
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
        
        // Create the player object with only the fields that are in the Prisma schema
        const newPlayer: MockPlayer = {
          id,
          name: playerData.name,
          teamId: playerData.teamId,
          playerType: playerData.playerType || 'REGULAR',
          handicapIndex: playerData.handicapIndex || 0,
          handicap: playerData.handicap || null,
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
    findMany: async ({ where }: { where: { matchId: string } }) => {
      return mockMatchScores.filter(score => score.matchId === where.matchId);
    },
    findUnique: async ({ where }: { where: { id: string } }) => {
      return mockMatchScores.find(score => score.id === where.id) || null;
    },
    create: async ({ data }: { data: any }) => {
      const id = `score${Math.floor(Math.random() * 10000)}`;
      const score = {
        id,
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Check for unique constraint
      const existing = mockMatchScores.find(s => 
        s.matchId === data.matchId && 
        s.playerId === data.playerId && 
        s.hole === data.hole
      );
      
      if (existing) {
        throw new Error('Score already exists for this hole and player');
      }
      
      mockMatchScores.push(score);
      return score;
    },
    update: async ({ where, data }: { where: { id: string }, data: any }) => {
      const index = mockMatchScores.findIndex(score => score.id === where.id);
      if (index === -1) {
        throw new Error('Score not found');
      }
      
      mockMatchScores[index] = {
        ...mockMatchScores[index],
        ...data,
        updatedAt: new Date()
      };
      
      return mockMatchScores[index];
    },
    delete: async ({ where }: { where: { id: string } }) => {
      const index = mockMatchScores.findIndex(score => score.id === where.id);
      if (index === -1) {
        throw new Error('Score not found');
      }
      
      const deleted = mockMatchScores[index];
      mockMatchScores.splice(index, 1);
      return deleted;
    },
    deleteMany: async ({ where }: { where: { matchId: string } }) => {
      const initialCount = mockMatchScores.length;
      mockMatchScores = mockMatchScores.filter(score => score.matchId !== where.matchId);
      return { count: initialCount - mockMatchScores.length };
    }
  },
  matchPoints: {
    findMany: async ({ where }: { where: { matchId: string } }) => {
      return mockMatchPoints.filter(points => points.matchId === where.matchId);
    },
    findUnique: async ({ where }: { where: { id: string } }) => {
      return mockMatchPoints.find(points => points.id === where.id) || null;
    },
    create: async ({ data }: { data: any }) => {
      const id = `points${Math.floor(Math.random() * 10000)}`;
      const points = {
        id,
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Check for unique constraint
      const existing = mockMatchPoints.find(p => 
        p.matchId === data.matchId && 
        p.teamId === data.teamId
      );
      
      if (existing) {
        throw new Error('Points already exist for this team in this match');
      }
      
      mockMatchPoints.push(points);
      return points;
    },
    update: async ({ where, data }: { where: { id: string }, data: any }) => {
      const index = mockMatchPoints.findIndex(points => points.id === where.id);
      if (index === -1) {
        throw new Error('Points not found');
      }
      
      mockMatchPoints[index] = {
        ...mockMatchPoints[index],
        ...data,
        updatedAt: new Date()
      };
      
      return mockMatchPoints[index];
    },
    delete: async ({ where }: { where: { id: string } }) => {
      const index = mockMatchPoints.findIndex(points => points.id === where.id);
      if (index === -1) {
        throw new Error('Points not found');
      }
      
      const deleted = mockMatchPoints[index];
      mockMatchPoints.splice(index, 1);
      return deleted;
    },
    deleteMany: async ({ where }: { where: { matchId: string } }) => {
      const initialCount = mockMatchPoints.length;
      mockMatchPoints = mockMatchPoints.filter(points => points.matchId !== where.matchId);
      return { count: initialCount - mockMatchPoints.length };
    }
  },
  playerSubstitution: {
    findMany: async ({ where }: { where: { matchId: string } }) => {
      return mockPlayerSubstitutions.filter(sub => sub.matchId === where.matchId);
    },
    findUnique: async ({ where }: { where: { id: string } }) => {
      return mockPlayerSubstitutions.find(sub => sub.id === where.id) || null;
    },
    create: async ({ data }: { data: any }) => {
      const id = `sub${Math.floor(Math.random() * 10000)}`;
      const sub = {
        id,
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Check for unique constraint
      const existing = mockPlayerSubstitutions.find(s => 
        s.matchId === data.matchId && 
        s.originalPlayerId === data.originalPlayerId
      );
      
      if (existing) {
        throw new Error('Substitution already exists for this player in this match');
      }
      
      mockPlayerSubstitutions.push(sub);
      return sub;
    },
    update: async ({ where, data }: { where: { id: string }, data: any }) => {
      const index = mockPlayerSubstitutions.findIndex(sub => sub.id === where.id);
      if (index === -1) {
        throw new Error('Substitution not found');
      }
      
      mockPlayerSubstitutions[index] = {
        ...mockPlayerSubstitutions[index],
        ...data,
        updatedAt: new Date()
      };
      
      return mockPlayerSubstitutions[index];
    },
    delete: async ({ where }: { where: { id: string } }) => {
      const index = mockPlayerSubstitutions.findIndex(sub => sub.id === where.id);
      if (index === -1) {
        throw new Error('Substitution not found');
      }
      
      const deleted = mockPlayerSubstitutions[index];
      mockPlayerSubstitutions.splice(index, 1);
      return deleted;
    },
    deleteMany: async ({ where }: { where: { matchId: string } }) => {
      const initialCount = mockPlayerSubstitutions.length;
      mockPlayerSubstitutions = mockPlayerSubstitutions.filter(sub => sub.matchId !== where.matchId);
      return { count: initialCount - mockPlayerSubstitutions.length };
    }
  }
} as unknown as ExtendedPrismaClient;

const globalForPrisma = global as unknown as { prisma: ExtendedPrismaClient }

// Check if we're using placeholder credentials
const isUsingPlaceholders = 
  !process.env.DATABASE_URL || 
  process.env.DATABASE_URL.includes('placeholder') ||
  !process.env.DATABASE_URL.startsWith('postgresql://');

// Ensure DATABASE_URL has the correct format
const databaseUrl = process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('postgresql://') 
  ? process.env.DATABASE_URL 
  : "postgresql://placeholder:placeholder@localhost:5432/placeholder";

// Initialize Prisma Client
const prismaClient = globalForPrisma.prisma || new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl
    }
  }
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prismaClient;
}

// Export the appropriate client based on environment
export const prisma = process.env.NODE_ENV === 'production' ? 
  (prismaClient as ExtendedPrismaClient) : 
  mockPrismaClient;

// Create a wrapper that combines static and dynamic data
const prismaWrapper = {
  team: {
    findMany: async () => teams,
    findUnique: async ({ where }: { where: { id: string } }) => getTeam(where.id),
    findFirst: async ({ where }: { where: { name: string } }) => 
      teams.find(team => team.name === where.name) || null,
  },
  player: {
    findMany: async () => players,
    findUnique: async ({ where }: { where: { id: string } }) => getPlayer(where.id),
    findFirst: async ({ where }: { where: { name: string } }) => 
      players.find(player => player.name === where.name) || null,
  },
  match: {
    findMany: async () => matches,
    findUnique: async ({ where }: { where: { id: string } }) => 
      matches.find(match => match.id === where.id) || null,
    findFirst: async ({ where }: { where: { id: string } }) => 
      matches.find(match => match.id === where.id) || null,
  },
  matchScore: {
    findMany: async ({ where }: { where: { matchId: string } }) => 
      prismaClient.matchScore.findMany({ where }),
    findUnique: async ({ where }: { where: { id: string } }) => 
      prismaClient.matchScore.findUnique({ where }),
    create: async (data: any) => prismaClient.matchScore.create({ data }),
    update: async ({ where, data }: { where: { id: string }, data: any }) => 
      prismaClient.matchScore.update({ where, data }),
    delete: async ({ where }: { where: { id: string } }) => 
      prismaClient.matchScore.delete({ where }),
  },
  matchPoints: {
    findMany: async ({ where }: { where: { matchId: string } }) => 
      prismaClient.matchPoints.findMany({ where }),
    findUnique: async ({ where }: { where: { id: string } }) => 
      prismaClient.matchPoints.findUnique({ where }),
    create: async (data: any) => prismaClient.matchPoints.create({ data }),
    update: async ({ where, data }: { where: { id: string }, data: any }) => 
      prismaClient.matchPoints.update({ where, data }),
    delete: async ({ where }: { where: { id: string } }) => 
      prismaClient.matchPoints.delete({ where }),
  },
  playerSubstitution: {
    findMany: async ({ where }: { where: { matchId: string } }) => 
      prismaClient.playerSubstitution.findMany({ where }),
    findUnique: async ({ where }: { where: { id: string } }) => 
      prismaClient.playerSubstitution.findUnique({ where }),
    create: async (data: any) => prismaClient.playerSubstitution.create({ data }),
    update: async ({ where, data }: { where: { id: string }, data: any }) => 
      prismaClient.playerSubstitution.update({ where, data }),
    delete: async ({ where }: { where: { id: string } }) => 
      prismaClient.playerSubstitution.delete({ where }),
  },
} as unknown as ExtendedPrismaClient;

export { prismaWrapper } 