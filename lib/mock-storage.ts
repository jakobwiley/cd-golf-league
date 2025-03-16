import fs from 'fs';
import path from 'path';

// Define the storage file path
const STORAGE_FILE = path.join(process.cwd(), '.mock-data.json');

// Define the structure of our mock data
interface MockData {
  teams: any[];
  players: any[];
  matches: any[];
  scores: any[];
  points: any[];
  matchPlayers: any[];
  matchScores: any[];
  isInitialized: boolean;
}

// Default empty data structure
const defaultData: MockData = {
  teams: [],
  players: [],
  matches: [],
  scores: [],
  points: [],
  matchPlayers: [],
  matchScores: [],
  isInitialized: false,
};

/**
 * Load mock data from file
 * @returns The loaded mock data or default data if file doesn't exist
 */
export function loadMockData(): MockData {
  try {
    if (fs.existsSync(STORAGE_FILE)) {
      const data = fs.readFileSync(STORAGE_FILE, 'utf8');
      const parsedData = JSON.parse(data);
      
      // Convert date strings back to Date objects
      if (parsedData.teams) {
        parsedData.teams.forEach((team: any) => {
          team.createdAt = new Date(team.createdAt);
          team.updatedAt = new Date(team.updatedAt);
        });
      }
      
      if (parsedData.players) {
        parsedData.players.forEach((player: any) => {
          player.createdAt = new Date(player.createdAt);
          player.updatedAt = new Date(player.updatedAt);
        });
      }
      
      if (parsedData.matches) {
        parsedData.matches.forEach((match: any) => {
          match.date = new Date(match.date);
          match.createdAt = new Date(match.createdAt);
          match.updatedAt = new Date(match.updatedAt);
        });
      }
      
      if (parsedData.matchPlayers) {
        parsedData.matchPlayers.forEach((mp: any) => {
          mp.createdAt = new Date(mp.createdAt);
          mp.updatedAt = new Date(mp.updatedAt);
        });
      }
      
      if (parsedData.matchScores) {
        parsedData.matchScores.forEach((score: any) => {
          score.createdAt = new Date(score.createdAt);
          score.updatedAt = new Date(score.updatedAt);
        });
      }
      
      return parsedData;
    }
  } catch (error) {
    console.error('Error loading mock data:', error);
  }
  
  return { ...defaultData };
}

/**
 * Save mock data to file
 * @param data The mock data to save
 */
export function saveMockData(data: MockData): void {
  try {
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving mock data:', error);
  }
}

/**
 * Update a specific collection in the mock data
 * @param collectionName The name of the collection to update
 * @param data The new data for the collection
 */
export function updateMockCollection<T extends keyof MockData>(collectionName: T, data: MockData[T]): void {
  const mockData = loadMockData();
  mockData[collectionName] = data;
  saveMockData(mockData);
}

/**
 * Get a specific collection from the mock data
 * @param collectionName The name of the collection to get
 * @returns The requested collection
 */
export function getMockCollection<T extends keyof MockData>(collectionName: T): MockData[T] {
  const mockData = loadMockData();
  return mockData[collectionName];
}

/**
 * Set the initialization status of the mock data
 * @param status The initialization status
 */
export function setMockInitialized(status: boolean): void {
  const mockData = loadMockData();
  mockData.isInitialized = status;
  saveMockData(mockData);
}

/**
 * Check if the mock data is initialized
 * @returns True if the mock data is initialized, false otherwise
 */
export function isMockInitialized(): boolean {
  const mockData = loadMockData();
  return mockData.isInitialized;
} 