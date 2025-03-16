import { prisma } from '../lib/prisma'
import { matches, players } from '../lib/data'

describe('PlayerSubstitution', () => {
  const testMatchId = matches[0].id
  const testOriginalPlayerId = 'player1'  // Nick
  const testSubstitutePlayerId = 'player3' // Hot

  beforeEach(async () => {
    // Clear any existing substitutions
    await prisma.playerSubstitution.deleteMany({
      where: { matchId: testMatchId }
    })
  })

  it('should create a player substitution', async () => {
    const substitution = await prisma.playerSubstitution.create({
      data: {
        matchId: testMatchId,
        originalPlayerId: testOriginalPlayerId,
        substitutePlayerId: testSubstitutePlayerId
      }
    })

    expect(substitution).toMatchObject({
      matchId: testMatchId,
      originalPlayerId: testOriginalPlayerId,
      substitutePlayerId: testSubstitutePlayerId
    })
  })

  it('should not allow duplicate substitutions for the same player in a match', async () => {
    await prisma.playerSubstitution.create({
      data: {
        matchId: testMatchId,
        originalPlayerId: testOriginalPlayerId,
        substitutePlayerId: testSubstitutePlayerId
      }
    })

    await expect(
      prisma.playerSubstitution.create({
        data: {
          matchId: testMatchId,
          originalPlayerId: testOriginalPlayerId,
          substitutePlayerId: 'player4' // Different substitute
        }
      })
    ).rejects.toThrow()
  })

  it('should update existing substitution', async () => {
    const substitution = await prisma.playerSubstitution.create({
      data: {
        matchId: testMatchId,
        originalPlayerId: testOriginalPlayerId,
        substitutePlayerId: testSubstitutePlayerId
      }
    })

    const newSubstituteId = 'player4'
    const updatedSubstitution = await prisma.playerSubstitution.update({
      where: { id: substitution.id },
      data: { substitutePlayerId: newSubstituteId }
    })

    expect(updatedSubstitution.substitutePlayerId).toBe(newSubstituteId)
  })

  it('should find all substitutions for a match', async () => {
    // Create substitutions for multiple players
    await prisma.playerSubstitution.create({
      data: {
        matchId: testMatchId,
        originalPlayerId: 'player1',
        substitutePlayerId: 'player3'
      }
    })

    await prisma.playerSubstitution.create({
      data: {
        matchId: testMatchId,
        originalPlayerId: 'player2',
        substitutePlayerId: 'player4'
      }
    })

    const substitutions = await prisma.playerSubstitution.findMany({
      where: { matchId: testMatchId }
    })

    expect(substitutions).toHaveLength(2)
    expect(substitutions[0].originalPlayerId).toBe('player1')
    expect(substitutions[0].substitutePlayerId).toBe('player3')
    expect(substitutions[1].originalPlayerId).toBe('player2')
    expect(substitutions[1].substitutePlayerId).toBe('player4')
  })

  it('should delete a substitution', async () => {
    const substitution = await prisma.playerSubstitution.create({
      data: {
        matchId: testMatchId,
        originalPlayerId: testOriginalPlayerId,
        substitutePlayerId: testSubstitutePlayerId
      }
    })

    await prisma.playerSubstitution.delete({
      where: { id: substitution.id }
    })

    const substitutions = await prisma.playerSubstitution.findMany({
      where: { matchId: testMatchId }
    })

    expect(substitutions).toHaveLength(0)
  })
}) 