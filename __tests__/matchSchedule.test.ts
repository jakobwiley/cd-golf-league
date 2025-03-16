import '@testing-library/jest-dom';
import { mockPrismaClient } from '../lib/prisma';

describe('Match Schedule', () => {
  beforeAll(() => {
    // Setup mock data
  });

  // Basic Schedule Structure Tests
  test('should have 5 matches for Week 1', async () => {
    const week1Matches = await mockPrismaClient.match.findMany({
      where: { weekNumber: 1 },
      include: { homeTeam: true, awayTeam: true },
      orderBy: [{ startingHole: 'asc' }]
    });
    expect(week1Matches.length).toBe(5);
  });

  test('should have matches for all weeks except Week 10', async () => {
    const allMatches = await mockPrismaClient.match.findMany();
    const uniqueWeeks = Array.from(new Set(allMatches.map(match => match.weekNumber))).sort((a, b) => a - b);
    expect(uniqueWeeks).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14]);
  });

  test('should have 5 matches per week', async () => {
    const allMatches = await mockPrismaClient.match.findMany();
    const matchesByWeek = allMatches.reduce((acc, match) => {
      acc[match.weekNumber] = (acc[match.weekNumber] || 0) + 1;
      return acc;
    }, {});

    Object.values(matchesByWeek).forEach(count => {
      expect(count).toBe(5);
    });
  });

  // Week 1 Specific Tests
  test('should have correct matchups for Week 1', async () => {
    const week1Matches = await mockPrismaClient.match.findMany({
      where: { weekNumber: 1 },
      include: { homeTeam: true, awayTeam: true },
      orderBy: [{ startingHole: 'asc' }]
    });

    const expectedMatchups = [
      { homeTeam: 'Hot/Huerter', awayTeam: 'Nick/Brent', startingHole: 1 },
      { homeTeam: 'Ashley/Alli', awayTeam: 'Brett/Tony', startingHole: 2 },
      { homeTeam: 'Brew/Jake', awayTeam: 'Clauss/Wade', startingHole: 3 },
      { homeTeam: 'Sketch/Rob', awayTeam: 'AP/JohnP', startingHole: 4 },
      { homeTeam: 'Trev/Murph', awayTeam: 'Ryan/Drew', startingHole: 5 }
    ];

    week1Matches.forEach((match, index) => {
      expect(match.homeTeam.name).toBe(expectedMatchups[index].homeTeam);
      expect(match.awayTeam.name).toBe(expectedMatchups[index].awayTeam);
      expect(match.startingHole).toBe(expectedMatchups[index].startingHole);
    });
  });

  test('should have correct date for Week 1 matches', async () => {
    const week1Matches = await mockPrismaClient.match.findMany({
      where: { weekNumber: 1 }
    });

    const expectedDate = new Date('2025-04-15T18:00:00.000Z');
    week1Matches.forEach(match => {
      expect(new Date(match.date).toISOString()).toBe(expectedDate.toISOString());
    });
  });

  // Starting Hole Tests
  test('should have correct starting holes for each match', async () => {
    const allMatches = await mockPrismaClient.match.findMany({
      orderBy: [{ weekNumber: 'asc' }, { startingHole: 'asc' }]
    });

    allMatches.forEach(match => {
      expect(match.startingHole).toBeGreaterThanOrEqual(1);
      expect(match.startingHole).toBeLessThanOrEqual(5);
    });
  });

  // Match Status Tests
  test('should have all matches initially set to SCHEDULED status', async () => {
    const allMatches = await mockPrismaClient.match.findMany();
    allMatches.forEach(match => {
      expect(match.status).toBe('SCHEDULED');
    });
  });

  // Team Participation Tests
  test('should have each team playing exactly once per week', async () => {
    const allMatches = await mockPrismaClient.match.findMany({
      include: { homeTeam: true, awayTeam: true }
    });

    const weeklyTeamCounts = new Map();
    
    allMatches.forEach(match => {
      const weekKey = `week${match.weekNumber}`;
      if (!weeklyTeamCounts.has(weekKey)) {
        weeklyTeamCounts.set(weekKey, new Set());
      }
      weeklyTeamCounts.get(weekKey).add(match.homeTeamId);
      weeklyTeamCounts.get(weekKey).add(match.awayTeamId);
    });

    weeklyTeamCounts.forEach((teams, week) => {
      if (week !== 'week10') { // Skip week 10 as it has no matches
        expect(teams.size).toBe(10); // Each week should have all 10 teams playing
      }
    });
  });

  // Date Tests
  test('should have correct weekly progression of dates', async () => {
    const allMatches = await mockPrismaClient.match.findMany({
      orderBy: [{ weekNumber: 'asc' }]
    });

    const weekDates = new Map();
    allMatches.forEach(match => {
      const weekNumber = match.weekNumber;
      const dateStr = new Date(match.date).toISOString();
      
      if (!weekDates.has(weekNumber)) {
        weekDates.set(weekNumber, dateStr);
      } else {
        expect(weekDates.get(weekNumber)).toBe(dateStr);
      }
    });

    // Verify dates are 7 days apart (except for week 10 gap)
    const sortedWeeks = Array.from(weekDates.keys()).sort((a, b) => a - b);
    sortedWeeks.forEach((week, index) => {
      if (index > 0 && week !== 11) { // Skip checking the gap between weeks 9 and 11
        const prevDate = new Date(weekDates.get(sortedWeeks[index - 1]));
        const currDate = new Date(weekDates.get(week));
        const daysDiff = (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);
        expect(daysDiff).toBe(7);
      }
    });
  });
}); 