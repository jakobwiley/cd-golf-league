export type Player = {
  id: string
  name: string
  handicapIndex: number
  playerType: 'PRIMARY' | 'SUBSTITUTE'
  teamId: string
}

export type Team = {
  id: string
  name: string
  players?: Player[]
}

export interface Match {
  id: string
  date: string
  weekNumber: number
  homeTeamId: string
  awayTeamId: string
  homeTeam?: Team
  awayTeam?: Team
  startingHole: number
  scores?: Score[]
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED'
}

export interface Score {
  id: string
  playerId: string
  hole: number
  strokes: number
  matchId: string
}
