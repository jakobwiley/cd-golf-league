export interface Team {
  id: string
  name: string
  createdAt?: Date
  updatedAt?: Date
  players?: Player[]
  Player?: Player[] // For Supabase response
}

export interface Player {
  id: string
  name: string
  handicapIndex: number
  teamId: string
  playerType: 'PRIMARY' | 'SUBSTITUTE'
  createdAt?: Date
  updatedAt?: Date
  team?: Team
}

export interface Match {
  id: string
  date: string
  weekNumber: number
  startingHole: number
  homeTeamId: string
  awayTeamId: string
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  createdAt?: Date
  updatedAt?: Date
  homeTeam: Team
  awayTeam: Team
}

export interface MatchScore {
  id: string
  matchId: string
  playerId: string
  score: number
  createdAt?: Date
  updatedAt?: Date
  match?: Match
  player?: Player
}

export interface MatchPoints {
  id: string
  matchId: string
  teamId: string
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
