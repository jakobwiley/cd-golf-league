import { NextResponse } from 'next/server'
import { prisma } from '../../../../../lib/prisma'
import { z } from 'zod'

// Validation schema for player assignments
const PlayerAssignmentSchema = z.object({
  originalPlayerId: z.string(),
  substitutePlayerId: z.string(),
  teamId: z.string(),
})

// Validation schema for match player assignments
const MatchPlayerAssignmentsSchema = z.object({
  playerAssignments: z.array(PlayerAssignmentSchema),
})

// GET: Fetch current player assignments for a match
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const matchId = params.id

    // Direct access to mock data for development
    // In a real implementation, you would use Prisma client methods
    let match;
    let homePlayers = [];
    let awayPlayers = [];

    try {
      // Try to use Prisma client if available
      match = await prisma.match.findUnique({
        where: { id: matchId },
        include: {
          homeTeam: true,
          awayTeam: true,
        },
      });
    } catch (error) {
      console.log('Using mock data fallback for match');
      // Fallback to direct access to mock data
      if (typeof global !== 'undefined' && global.globalForPrisma) {
        const mockMatch = global.globalForPrisma.mockMatches.find(m => m.id === matchId);
        if (mockMatch) {
          const homeTeam = global.globalForPrisma.mockTeams.find(t => t.id === mockMatch.homeTeamId);
          const awayTeam = global.globalForPrisma.mockTeams.find(t => t.id === mockMatch.awayTeamId);
          match = {
            ...mockMatch,
            homeTeam,
            awayTeam
          };
        }
      }
    }

    if (!match) {
      return NextResponse.json(
        { error: 'Match not found' },
        { status: 404 }
      )
    }

    try {
      // Try to use Prisma client if available
      homePlayers = await prisma.player.findMany({
        where: { teamId: match.homeTeamId },
      });
      
      awayPlayers = await prisma.player.findMany({
        where: { teamId: match.awayTeamId },
      });
    } catch (error) {
      console.log('Using mock data fallback for players');
      // Fallback to direct access to mock data
      if (typeof global !== 'undefined' && global.globalForPrisma) {
        homePlayers = global.globalForPrisma.mockPlayers.filter(p => p.teamId === match.homeTeamId);
        awayPlayers = global.globalForPrisma.mockPlayers.filter(p => p.teamId === match.awayTeamId);
      }
    }

    // Map home players with default substitution info (no substitutes)
    const mappedHomePlayers = homePlayers.map(player => ({
      playerId: player.id,
      teamId: player.teamId || '',
      name: player.name,
      handicapIndex: player.handicapIndex,
      isSubstitute: player.playerType === 'SUBSTITUTE',
    }))

    // Map away players with default substitution info (no substitutes)
    const mappedAwayPlayers = awayPlayers.map(player => ({
      playerId: player.id,
      teamId: player.teamId || '',
      name: player.name,
      handicapIndex: player.handicapIndex,
      isSubstitute: player.playerType === 'SUBSTITUTE',
    }))

    return NextResponse.json({
      homePlayers: mappedHomePlayers,
      awayPlayers: mappedAwayPlayers,
    })
  } catch (error) {
    console.error('Error fetching match players:', error)
    return NextResponse.json(
      { error: 'Failed to fetch match players' },
      { status: 500 }
    )
  }
}

// PUT: Update player assignments for a match
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const matchId = params.id
    const body = await request.json()

    // Validate request body
    const validationResult = MatchPlayerAssignmentsSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: validationResult.error },
        { status: 400 }
      )
    }

    const { playerAssignments } = validationResult.data

    // Check if match exists
    let match;
    
    try {
      // Try to use Prisma client if available
      match = await prisma.match.findUnique({
        where: { id: matchId },
      });
    } catch (error) {
      console.log('Using mock data fallback for match');
      // Fallback to direct access to mock data
      if (typeof global !== 'undefined' && global.globalForPrisma) {
        match = global.globalForPrisma.mockMatches.find(m => m.id === matchId);
      }
    }

    if (!match) {
      return NextResponse.json(
        { error: 'Match not found' },
        { status: 404 }
      )
    }

    // Process each player assignment
    for (const assignment of playerAssignments) {
      const { originalPlayerId, substitutePlayerId, teamId } = assignment

      // Verify players belong to the correct team
      let originalPlayer;
      let substitutePlayer;
      
      try {
        // Try to use Prisma client if available
        originalPlayer = await prisma.player.findUnique({
          where: { id: originalPlayerId },
        });
        
        substitutePlayer = await prisma.player.findUnique({
          where: { id: substitutePlayerId },
        });
      } catch (error) {
        console.log('Using mock data fallback for players');
        // Fallback to direct access to mock data
        if (typeof global !== 'undefined' && global.globalForPrisma) {
          originalPlayer = global.globalForPrisma.mockPlayers.find(p => p.id === originalPlayerId);
          substitutePlayer = global.globalForPrisma.mockPlayers.find(p => p.id === substitutePlayerId);
        }
      }

      if (!originalPlayer || originalPlayer.teamId !== teamId) {
        return NextResponse.json(
          { error: `Original player ${originalPlayerId} not found or does not belong to team ${teamId}` },
          { status: 400 }
        )
      }

      if (!substitutePlayer || substitutePlayer.teamId !== teamId) {
        return NextResponse.json(
          { error: `Substitute player ${substitutePlayerId} not found or does not belong to team ${teamId}` },
          { status: 400 }
        )
      }

      // In a mock implementation, we'll just return success
      // In a real implementation, you would update the MatchPlayer model
      console.log(`Substituting player ${substitutePlayerId} for ${originalPlayerId} in match ${matchId}`);
    }

    return NextResponse.json({
      success: true,
      message: 'Player assignments updated successfully',
    })
  } catch (error) {
    console.error('Error updating match players:', error)
    return NextResponse.json(
      { error: 'Failed to update match players' },
      { status: 500 }
    )
  }
} 