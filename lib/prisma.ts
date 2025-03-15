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
  
  // Schedule data based on the raw data provided
  // Format: [weekNumber, startingHole, homeTeamName, awayTeamName, date]
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
    [7, 3, 'AP/JohnP', 'Hot/Huerter', '2025-05-27T18:00:00.000Z'],
    [7, 4, 'Clauss/Wade', 'Brett/Tony', '2025-05-27T18:00:00.000Z'],
    [7, 5, 'Nick/Brent', 'Sketch/Rob', '2025-05-27T18:00:00.000Z'],
    
    // Week 8 - June 3, 2025
    [8, 1, 'Brew/Jake', 'AP/JohnP', '2025-06-03T18:00:00.000Z'],
    [8, 2, 'Sketch/Rob', 'Trev/Murph', '2025-06-03T18:00:00.000Z'],
    [8, 3, 'Ashley/Alli', 'Clauss/Wade', '2025-06-03T18:00:00.000Z'],
    [8, 4, 'Hot/Huerter', 'Brett/Tony', '2025-06-03T18:00:00.000Z'],
    [8, 5, 'Nick/Brent', 'Ryan/Drew', '2025-06-03T18:00:00.000Z'],
    
    // Week 9 - June 10, 2025
    [9, 1, 'AP/JohnP', 'Ashley/Alli', '2025-06-10T18:00:00.000Z'],
    [9, 2, 'Clauss/Wade', 'Hot/Huerter', '2025-06-10T18:00:00.000Z'],
    [9, 3, 'Brett/Tony', 'Nick/Brent', '2025-06-10T18:00:00.000Z'],
    [9, 4, 'Ryan/Drew', 'Brew/Jake', '2025-06-10T18:00:00.000Z'],
    [9, 5, 'Trev/Murph', 'Sketch/Rob', '2025-06-10T18:00:00.000Z'],
    
    // Week 10 - June 17, 2025
    [10, 1, 'Hot/Huerter', 'AP/JohnP', '2025-06-17T18:00:00.000Z'],
    [10, 2, 'Nick/Brent', 'Trev/Murph', '2025-06-17T18:00:00.000Z'],
    [10, 3, 'Brew/Jake', 'Clauss/Wade', '2025-06-17T18:00:00.000Z'],
    [10, 4, 'Sketch/Rob', 'Ryan/Drew', '2025-06-17T18:00:00.000Z'],
    [10, 5, 'Ashley/Alli', 'Brett/Tony', '2025-06-17T18:00:00.000Z'],
    
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

  // Process schedule data to create matches
  scheduleData.forEach((matchData, index) => {
    const [weekNumber, startingHole, homeTeamName, awayTeamName, dateString] = matchData;
    
    // Find team IDs based on names
    const homeTeam = global.globalForPrisma.mockTeams.find(team => team.name === homeTeamName);
    const awayTeam = global.globalForPrisma.mockTeams.find(team => team.name === awayTeamName);
    
    if (homeTeam && awayTeam) {
      global.globalForPrisma.mockMatches.push({
        id: `match${index + 1}`,
        date: new Date(dateString),
        weekNumber: weekNumber,
        homeTeamId: homeTeam.id,
        awayTeamId: awayTeam.id,
        status: 'SCHEDULED',
        startingHole: startingHole,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
  });

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