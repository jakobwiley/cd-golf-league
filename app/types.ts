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

export type Match = {
  id: string
  date: string
  weekNumber: number
  homeTeamId: string
  awayTeamId: string
  homeTeam?: Team
  awayTeam?: Team
  startingHole: number
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED'
}
