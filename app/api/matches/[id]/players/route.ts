import { NextResponse } from 'next/server'
import { prisma } from '../../../../../lib/prisma'
import { z } from 'zod'
import { SocketEvents } from '../../../../../lib/socket'

// Define types for players
type Player = {
  id: string;
  name: string;
  handicapIndex: number;
  teamId: string | null;
  playerType: string;
  [key: string]: any;
};

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

// Function to emit match updated event
async function emitMatchUpdated(matchId: string) {
  try {
    // Get the Socket.io server instance
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/socket`, {
      method: 'GET',
    })
    
    if (!res.ok) {
      console.error('Failed to get Socket.io server instance')
      return
    }
    
    // Emit the match updated event
    const socketIo = (global as any).socketIo
    if (socketIo) {
      console.log(`Emitting ${SocketEvents.MATCH_UPDATED} event for match ${matchId}`)
      socketIo.emit(SocketEvents.MATCH_UPDATED, { matchId })
    } else {
      console.warn('Socket.io server not initialized')
    }
  } catch (error) {
    console.error('Error emitting match updated event:', error)
  }
}

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
    let homePlayers: Player[] = [];
    let awayPlayers: Player[] = [];

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
    let homePlayers = [];
    let awayPlayers = [];
    let homeTeam;
    let awayTeam;
    
    try {
      // Try to use Prisma client if available
      match = await prisma.match.findUnique({
        where: { id: matchId },
        include: {
          homeTeam: true,
          awayTeam: true,
        }
      });
      
      if (match) {
        homeTeam = match.homeTeam;
        awayTeam = match.awayTeam;
      }
    } catch (error) {
      console.log('Using mock data fallback for match');
      // Fallback to direct access to mock data
      if (typeof global !== 'undefined' && global.globalForPrisma) {
        const mockMatch = global.globalForPrisma.mockMatches.find(m => m.id === matchId);
        if (mockMatch) {
          homeTeam = global.globalForPrisma.mockTeams.find(t => t.id === mockMatch.homeTeamId);
          awayTeam = global.globalForPrisma.mockTeams.find(t => t.id === mockMatch.awayTeamId);
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

    // Track active players for each team
    const activePlayersByTeam = {
      [match.homeTeamId]: homePlayers.filter(p => p.playerType !== 'SUBSTITUTE').length,
      [match.awayTeamId]: awayPlayers.filter(p => p.playerType !== 'SUBSTITUTE').length,
    };

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

      // Check if this substitution would exceed the 2-player limit
      // If original player is PRIMARY and substitute is SUBSTITUTE, we're removing an active player
      // If original player is SUBSTITUTE and substitute is PRIMARY, we're adding an active player
      if (originalPlayer.playerType !== 'PRIMARY' && substitutePlayer.playerType === 'PRIMARY') {
        // We're adding an active player
        if (activePlayersByTeam[teamId] >= 2) {
          const teamName = teamId === match.homeTeamId ? match.homeTeam.name : match.awayTeam.name;
          return NextResponse.json(
            { error: `Cannot add more than 2 active players to ${teamName} for this match` },
            { status: 400 }
          )
        }
        activePlayersByTeam[teamId]++;
      } else if (originalPlayer.playerType === 'PRIMARY' && substitutePlayer.playerType !== 'PRIMARY') {
        // We're removing an active player
        activePlayersByTeam[teamId]--;
      }

      // In a mock implementation, we'll just return success
      // In a real implementation, you would update the MatchPlayer model
      console.log(`Substituting player ${substitutePlayerId} for ${originalPlayerId} in match ${matchId}`);
    }

    // Emit match updated event
    await emitMatchUpdated(matchId)

    // Get team name for the response
    const teamId = playerAssignments[0].teamId;
    const teamName = teamId === match.homeTeamId ? match.homeTeam.name : match.awayTeam.name;

    return NextResponse.json({
      success: true,
      message: `${teamName} was updated with active players for this match`,
      teamName: teamName
    })
  } catch (error) {
    console.error('Error updating match players:', error)
    return NextResponse.json(
      { error: 'Failed to update match players' },
      { status: 500 }
    )
  }
} 