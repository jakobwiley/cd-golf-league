import '@testing-library/jest-dom';
import { matches, getWeekMatches, getTeamMatches } from '../lib/data'

describe('Match Schedule', () => {
  beforeAll(() => {
    // Setup mock data
  });

  // Basic Schedule Structure Tests
  test('should have 5 matches for Week 1', () => {
    const week1Matches = getWeekMatches(1)
    expect(week1Matches.length).toBe(5)
  })

  test('should have matches for all weeks except Week 10', () => {
    const uniqueWeeks = Array.from(new Set(matches.map(match => match.weekNumber))).sort((a, b) => a - b)
    expect(uniqueWeeks).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14])
  })

  test('should have 5 matches per week', () => {
    const matchesByWeek = matches.reduce((acc, match) => {
      acc[match.weekNumber] = (acc[match.weekNumber] || 0) + 1
      return acc
    }, {} as Record<number, number>)

    Object.values(matchesByWeek).forEach(count => {
      expect(count).toBe(5)
    })
  })

  // Week 1 Specific Tests
  test('should have correct matchups for Week 1', () => {
    const week1Matches = getWeekMatches(1)
    const matchups = week1Matches.map(match => ({
      home: match.homeTeamId,
      away: match.awayTeamId,
      hole: match.startingHole
    }))

    expect(matchups).toEqual([
      { home: 'team2', away: 'team1', hole: 1 },
      { home: 'team3', away: 'team10', hole: 2 },
      { home: 'team4', away: 'team9', hole: 3 },
      { home: 'team5', away: 'team8', hole: 4 },
      { home: 'team6', away: 'team7', hole: 5 }
    ])
  })

  test('should have correct date for Week 1 matches', () => {
    const week1Matches = getWeekMatches(1)
    const expectedDate = new Date('2024-05-01')
    
    week1Matches.forEach(match => {
      expect(match.date.toISOString().split('T')[0]).toBe(expectedDate.toISOString().split('T')[0])
    })
  })

  // Starting Hole Tests
  test('should have correct starting holes for each match', () => {
    const sortedMatches = [...matches].sort((a, b) => {
      if (a.weekNumber !== b.weekNumber) return a.weekNumber - b.weekNumber
      return a.startingHole - b.startingHole
    })

    sortedMatches.forEach(match => {
      expect(match.startingHole).toBeGreaterThanOrEqual(1)
      expect(match.startingHole).toBeLessThanOrEqual(5)
    })
  })

  // Match Status Tests
  test('should have all matches initially set to SCHEDULED status', () => {
    matches.forEach(match => {
      expect(match.status).toBe('SCHEDULED')
    })
  })

  // Team Participation Tests
  test('should have each team playing exactly once per week', () => {
    const teamParticipation = matches.reduce((acc, match) => {
      const week = match.weekNumber
      if (!acc[week]) acc[week] = new Set()
      acc[week].add(match.homeTeamId)
      acc[week].add(match.awayTeamId)
      return acc
    }, {} as Record<number, Set<string>>)

    Object.values(teamParticipation).forEach(teams => {
      expect(teams.size).toBe(10) // All 10 teams should play each week
    })
  })

  // Date Tests
  test('should have correct weekly progression of dates', () => {
    const sortedMatches = [...matches].sort((a, b) => a.weekNumber - b.weekNumber)
    const baseDate = new Date('2024-05-01')
    
    sortedMatches.forEach(match => {
      const expectedDate = new Date(baseDate)
      expectedDate.setDate(baseDate.getDate() + (match.weekNumber - 1) * 7)
      expect(match.date.toISOString().split('T')[0]).toBe(expectedDate.toISOString().split('T')[0])
    })
  })
}); 