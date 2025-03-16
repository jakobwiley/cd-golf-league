import { prisma } from '../lib/prisma'
import { matches } from '../lib/data'

describe('MatchScore', () => {
  const testMatchId = matches[0].id
  const testPlayerId = 'player1'

  beforeEach(async () => {
    // Clear any existing scores
    await prisma.matchScore.deleteMany({
      where: { matchId: testMatchId }
    })
  })

  it('should create a match score', async () => {
    const score = await prisma.matchScore.create({
      data: {
        matchId: testMatchId,
        playerId: testPlayerId,
        hole: 1,
        score: 4
      }
    })

    expect(score).toMatchObject({
      matchId: testMatchId,
      playerId: testPlayerId,
      hole: 1,
      score: 4
    })
  })

  it('should not allow duplicate scores for the same hole and player', async () => {
    await prisma.matchScore.create({
      data: {
        matchId: testMatchId,
        playerId: testPlayerId,
        hole: 1,
        score: 4
      }
    })

    await expect(
      prisma.matchScore.create({
        data: {
          matchId: testMatchId,
          playerId: testPlayerId,
          hole: 1,
          score: 5
        }
      })
    ).rejects.toThrow()
  })

  it('should update an existing score', async () => {
    const score = await prisma.matchScore.create({
      data: {
        matchId: testMatchId,
        playerId: testPlayerId,
        hole: 1,
        score: 4
      }
    })

    const updatedScore = await prisma.matchScore.update({
      where: { id: score.id },
      data: { score: 5 }
    })

    expect(updatedScore.score).toBe(5)
  })

  it('should find all scores for a match', async () => {
    await prisma.matchScore.create({
      data: {
        matchId: testMatchId,
        playerId: testPlayerId,
        hole: 1,
        score: 4
      }
    })

    await prisma.matchScore.create({
      data: {
        matchId: testMatchId,
        playerId: testPlayerId,
        hole: 2,
        score: 5
      }
    })

    const scores = await prisma.matchScore.findMany({
      where: { matchId: testMatchId }
    })

    expect(scores).toHaveLength(2)
    expect(scores[0].hole).toBe(1)
    expect(scores[1].hole).toBe(2)
  })
}) 