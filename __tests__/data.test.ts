import { teams, players, matches, getTeam, getPlayer, getMatch, getTeamPlayers, getTeamMatches, getWeekMatches } from '../lib/data'

describe('Static Data Tests', () => {
  describe('Teams', () => {
    it('should have exactly 10 teams', () => {
      expect(teams.length).toBe(10)
    })

    it('should have unique team IDs', () => {
      const teamIds = teams.map(team => team.id)
      const uniqueTeamIds = new Set(teamIds)
      expect(teamIds.length).toBe(uniqueTeamIds.size)
    })

    it('should have unique team names', () => {
      const teamNames = teams.map(team => team.name)
      const uniqueTeamNames = new Set(teamNames)
      expect(teamNames.length).toBe(uniqueTeamNames.size)
    })
  })

  describe('Players', () => {
    it('should have exactly 20 players', () => {
      expect(players.length).toBe(20)
    })

    it('should have unique player IDs', () => {
      const playerIds = players.map(player => player.id)
      const uniquePlayerIds = new Set(playerIds)
      expect(playerIds.length).toBe(uniquePlayerIds.size)
    })

    it('should have exactly 2 players per team', () => {
      teams.forEach(team => {
        const teamPlayers = getTeamPlayers(team.id)
        expect(teamPlayers.length).toBe(2)
      })
    })

    it('should have valid team IDs for all players', () => {
      players.forEach(player => {
        if (player.teamId) {
          const team = getTeam(player.teamId)
          expect(team).toBeDefined()
        }
      })
    })
  })

  describe('Matches', () => {
    it('should have exactly 5 matches for week 1', () => {
      const week1Matches = getWeekMatches(1)
      expect(week1Matches.length).toBe(5)
    })

    it('should have unique match IDs', () => {
      const matchIds = matches.map(match => match.id)
      const uniqueMatchIds = new Set(matchIds)
      expect(matchIds.length).toBe(uniqueMatchIds.size)
    })

    it('should have valid team IDs for all matches', () => {
      matches.forEach(match => {
        const homeTeam = getTeam(match.homeTeamId)
        const awayTeam = getTeam(match.awayTeamId)
        expect(homeTeam).toBeDefined()
        expect(awayTeam).toBeDefined()
      })
    })

    it('should have unique starting holes for each week', () => {
      const week1Matches = getWeekMatches(1)
      const startingHoles = week1Matches.map(match => match.startingHole)
      const uniqueStartingHoles = new Set(startingHoles)
      expect(startingHoles.length).toBe(uniqueStartingHoles.size)
    })
  })

  describe('Helper Functions', () => {
    it('getTeam should return correct team', () => {
      const team = getTeam('team1')
      expect(team).toBeDefined()
      expect(team?.name).toBe('Nick/Brent')
    })

    it('getPlayer should return correct player', () => {
      const player = getPlayer('player1')
      expect(player).toBeDefined()
      expect(player?.name).toBe('AP')
    })

    it('getMatch should return correct match', () => {
      const match = getMatch('match1')
      expect(match).toBeDefined()
      expect(match?.homeTeamId).toBe('team2')
      expect(match?.awayTeamId).toBe('team1')
    })

    it('getTeamPlayers should return correct players for team', () => {
      const teamPlayers = getTeamPlayers('team1')
      expect(teamPlayers.length).toBe(2)
      expect(teamPlayers.map(p => p.name)).toContain('Nick')
      expect(teamPlayers.map(p => p.name)).toContain('Brent')
    })

    it('getTeamMatches should return correct matches for team', () => {
      const teamMatches = getTeamMatches('team1')
      expect(teamMatches.length).toBeGreaterThan(0)
      expect(teamMatches.every(match => 
        match.homeTeamId === 'team1' || match.awayTeamId === 'team1'
      )).toBe(true)
    })

    it('getWeekMatches should return correct matches for week', () => {
      const weekMatches = getWeekMatches(1)
      expect(weekMatches.length).toBe(5)
      expect(weekMatches.every(m => m.weekNumber === 1)).toBe(true)
    })
  })
}) 