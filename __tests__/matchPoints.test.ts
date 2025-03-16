import { prisma } from '../lib/prisma'
import { matches } from '../lib/data'

describe('MatchPoints', () => {
  const testMatchId = matches[0].id
  const testTeamId = 'team1'

  beforeEach(async () => {
    // Clear any existing points
    await prisma.matchPoints.deleteMany({
      where: { matchId: testMatchId }
    })
  })

  it('should create match points', async () => {
    const points = await prisma.matchPoints.create({
      data: {
        matchId: testMatchId,
        teamId: testTeamId,
        points: 2.5
      }
    })

    expect(points).toMatchObject({
      matchId: testMatchId,
      teamId: testTeamId,
      points: 2.5
    })
  })

  it('should not allow duplicate points for the same team in a match', async () => {
    await prisma.matchPoints.create({
      data: {
        matchId: testMatchId,
        teamId: testTeamId,
        points: 2.5
      }
    })

    await expect(
      prisma.matchPoints.create({
        data: {
          matchId: testMatchId,
          teamId: testTeamId,
          points: 1.5
        }
      })
    ).rejects.toThrow()
  })

  it('should update existing points', async () => {
    const points = await prisma.matchPoints.create({
      data: {
        matchId: testMatchId,
        teamId: testTeamId,
        points: 2.5
      }
    })

    const updatedPoints = await prisma.matchPoints.update({
      where: { id: points.id },
      data: { points: 3.0 }
    })

    expect(updatedPoints.points).toBe(3.0)
  })

  it('should find all points for a match', async () => {
    // Create points for both teams
    await prisma.matchPoints.create({
      data: {
        matchId: testMatchId,
        teamId: 'team1',
        points: 2.5
      }
    })

    await prisma.matchPoints.create({
      data: {
        matchId: testMatchId,
        teamId: 'team2',
        points: 0.5
      }
    })

    const points = await prisma.matchPoints.findMany({
      where: { matchId: testMatchId }
    })

    expect(points).toHaveLength(2)
    expect(points[0].teamId).toBe('team1')
    expect(points[0].points).toBe(2.5)
    expect(points[1].teamId).toBe('team2')
    expect(points[1].points).toBe(0.5)
  })

  it('should validate that points total 3.0 for a match', async () => {
    // Create points for first team
    await prisma.matchPoints.create({
      data: {
        matchId: testMatchId,
        teamId: 'team1',
        points: 2.5
      }
    })

    // Create points for second team
    await prisma.matchPoints.create({
      data: {
        matchId: testMatchId,
        teamId: 'team2',
        points: 0.5
      }
    })

    // Get total points for the match
    const points = await prisma.matchPoints.findMany({
      where: { matchId: testMatchId }
    })

    const totalPoints = points.reduce((sum, p) => sum + p.points, 0)
    expect(totalPoints).toBe(3.0)
  })
}) 