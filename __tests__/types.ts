// Match types
export interface Team {
  id: string;
  name: string;
  players: Player[];
}

export interface Player {
  id: string;
  name: string;
  handicapIndex: number;
  teamId: string;
}

export interface Match {
  id: string;
  date: string;
  weekNumber: number;
  homeTeam: Team;
  awayTeam: Team;
}

export interface Score {
  hole: number;
  score: number;
}

export interface PlayerScores {
  [playerId: string]: Score[];
}

// Test configuration
export interface TestConfig {
  testBaseUrl: string;
}

export const testConfig: TestConfig = {
  testBaseUrl: 'http://localhost:3000'
};
