export interface Team {
  id: string
  name: string
  createdAt?: Date
  updatedAt?: Date
}

export interface Player {
  id: string
  name: string
  handicapIndex: number
  teamId: string
  playerType: 'PRIMARY' | 'SUBSTITUTE'
  createdAt?: Date
  updatedAt?: Date
}

export interface Match {
  id: string
  date: string
  weekNumber: number
  homeTeamId: string
  awayTeamId: string
  startingHole: number
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  createdAt?: Date
  updatedAt?: Date
}

export interface MatchScore {
  id: string
  matchId: string
  playerId: string
  hole: number
  score: number
  createdAt?: Date
  updatedAt?: Date
}

export interface MatchPoints {
  id: string
  matchId: string
  playerId: string
  points: number
  createdAt?: Date
  updatedAt?: Date
}

export interface MatchPlayer {
  id: string
  matchId: string
  playerId: string
  teamId: string
  playerType: 'PRIMARY' | 'SUBSTITUTE'
  createdAt?: Date
  updatedAt?: Date
}
