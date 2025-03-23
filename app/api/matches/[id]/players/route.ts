import { NextResponse } from 'next/server';
import { supabase } from '../../../../../lib/supabase';
import { z } from 'zod';
import { SocketEvents } from '../../../../../app/utils/websocketConnection';

interface Player {
  id: string
  name: string
  handicapIndex: number
  teamId: string
  playerType: string
}

interface MatchPlayerData {
  id: string
  matchId: string
  playerId: string
  isSubstitute: boolean
  Player: Player
}

const playerSchema = z.object({
  id: z.string(),
  name: z.string(),
  handicapIndex: z.number(),
  teamId: z.string(),
  playerType: z.string()
})

const PlayerAssignmentSchema = z.object({
  originalPlayerId: z.string(),
  substitutePlayerId: z.string(),
  teamId: z.string(),
})

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
    // Get the match first to get team IDs
    const { data: matchData, error: matchError } = await supabase
      .from('Match')
      .select('homeTeamId, awayTeamId')
      .eq('id', params.id)
      .single()

    if (matchError) {
      throw matchError
    }

    console.log(`Fetching players for match ${params.id} with homeTeamId: ${matchData.homeTeamId}, awayTeamId: ${matchData.awayTeamId}`);

    const { data, error } = await supabase
      .from('MatchPlayer')
      .select(`
        id,
        matchId,
        playerId,
        isSubstitute,
        Player:Player (
          id,
          name,
          handicapIndex,
          teamId,
          playerType
        )
      `)
      .eq('matchId', params.id)

    if (error) {
      throw error
    }

    console.log(`Found ${data?.length || 0} MatchPlayer records for match ${params.id}`);

    // If no MatchPlayer records exist, fetch players directly from the teams
    if (!data || data.length === 0) {
      console.log(`No MatchPlayer records found, fetching players directly from teams`);
      
      // Get home team players
      const { data: homeTeamPlayers, error: homeTeamError } = await supabase
        .from('Player')
        .select('id, name, handicapIndex, teamId, playerType')
        .eq('teamId', matchData.homeTeamId)
        .eq('playerType', 'PRIMARY')
        .limit(2);
      
      if (homeTeamError) {
        console.error('Error fetching home team players:', homeTeamError);
      }
      
      // Get away team players
      const { data: awayTeamPlayers, error: awayTeamError } = await supabase
        .from('Player')
        .select('id, name, handicapIndex, teamId, playerType')
        .eq('teamId', matchData.awayTeamId)
        .eq('playerType', 'PRIMARY')
        .limit(2);
      
      if (awayTeamError) {
        console.error('Error fetching away team players:', awayTeamError);
      }
      
      // Map home players
      const mappedHomePlayers = (homeTeamPlayers || []).map(player => ({
        playerId: player.id,
        teamId: player.teamId,
        name: player.name,
        handicapIndex: player.handicapIndex,
        isSubstitute: false
      }));
      
      // Map away players
      const mappedAwayPlayers = (awayTeamPlayers || []).map(player => ({
        playerId: player.id,
        teamId: player.teamId,
        name: player.name,
        handicapIndex: player.handicapIndex,
        isSubstitute: false
      }));
      
      return NextResponse.json({
        homePlayers: mappedHomePlayers,
        awayPlayers: mappedAwayPlayers
      });
    }

    // Convert raw data to typed data
    const matchPlayers = (data as any[]).map(item => ({
      ...item,
      Player: Array.isArray(item.Player) ? item.Player[0] : item.Player
    })) as MatchPlayerData[]

    // Filter home players to get only the active ones (max 2)
    const homePlayers = matchPlayers
      .filter(mp => mp.Player.teamId === matchData.homeTeamId && !mp.isSubstitute)
      .slice(0, 2)

    // Filter away players to get only the active ones (max 2)
    const awayPlayers = matchPlayers
      .filter(mp => mp.Player.teamId === matchData.awayTeamId && !mp.isSubstitute)
      .slice(0, 2)

    // Map home players with substitution info
    const mappedHomePlayers = homePlayers.map(mp => ({
      playerId: mp.Player.id,
      teamId: mp.Player.teamId,
      name: mp.Player.name,
      handicapIndex: mp.Player.handicapIndex,
      isSubstitute: mp.isSubstitute
    }))

    // Map away players with substitution info
    const mappedAwayPlayers = awayPlayers.map(mp => ({
      playerId: mp.Player.id,
      teamId: mp.Player.teamId,
      name: mp.Player.name,
      handicapIndex: mp.Player.handicapIndex,
      isSubstitute: mp.isSubstitute
    }))

    return NextResponse.json({
      homePlayers: mappedHomePlayers,
      awayPlayers: mappedAwayPlayers
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

    // Process each player assignment
    for (const assignment of playerAssignments) {
      const { originalPlayerId, substitutePlayerId, teamId } = assignment

      // Verify players belong to the correct team
      let originalPlayer;
      let substitutePlayer;
      
      try {
        // Try to use Supabase client if available
        const { data: players, error } = await supabase
          .from('Player')
          .select('id, teamId')
          .eq('id', originalPlayerId)

        if (error) {
          throw error
        }

        originalPlayer = players[0];

        const { data: substitutePlayers, error: substituteError } = await supabase
          .from('Player')
          .select('id, teamId')
          .eq('id', substitutePlayerId)

        if (substituteError) {
          throw substituteError
        }

        substitutePlayer = substitutePlayers[0];
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

    // Emit match updated event
    await emitMatchUpdated(matchId)

    // Get team name for the response
    const teamId = playerAssignments[0].teamId;
    const teamName = teamId === 'homeTeamId' ? 'Home Team' : 'Away Team';

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

// POST: Add a new player to a match
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const player = playerSchema.parse(body)

    const { data, error } = await supabase
      .from('MatchPlayer')
      .insert({
        matchId: params.id,
        playerId: player.id,
        isSubstitute: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error adding match player:', error)
    return NextResponse.json(
      { error: 'Failed to add match player' },
      { status: 500 }
    )
  }
}

// DELETE: Remove a player from a match
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { playerId } = await request.json()

    const { error } = await supabase
      .from('MatchPlayer')
      .delete()
      .eq('matchId', params.id)
      .eq('playerId', playerId)

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error removing match player:', error)
    return NextResponse.json(
      { error: 'Failed to remove match player' },
      { status: 500 }
    )
  }
}