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

// Helper function to handle errors
function handleError(error: any, message: string) {
  console.error(`${message}:`, error);
  return NextResponse.json(
    { 
      error: message, 
      details: String(error),
      stack: error.stack
    },
    { status: 500 }
  );
}

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

    // Emit match updated event
    const socketRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/socket`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event: SocketEvents.MATCH_UPDATED,
        data: { matchId },
      }),
    })

    if (!socketRes.ok) {
      console.error('Failed to emit match updated event')
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
    const url = new URL(request.url)
    const forScorecard = url.searchParams.get('forScorecard') === 'true'

    // Get match details
    const { data: match, error: matchError } = await supabase
      .from('Match')
      .select(`
        id,
        date,
        weekNumber,
        startingHole,
        status,
        homeTeamId,
        awayTeamId,
        homeTeam:homeTeamId (
          id,
          name
        ),
        awayTeam:awayTeamId (
          id,
          name
        )
      `)
      .eq('id', matchId)
      .single()

    if (matchError) {
      throw matchError
    }

    if (!match) {
      return NextResponse.json(
        { error: 'Match not found' },
        { status: 404 }
      )
    }

    // Get all players for the match
    const matchPlayersQuery = supabase
      .from('MatchPlayer')
      .select(`
        id,
        matchId,
        playerId,
        isSubstitute,
        Player (
          id,
          name,
          handicapIndex,
          teamId,
          playerType,
          Team (
            id,
            name
          )
        )
      `)
      .eq('matchId', matchId)
    
    // If this is for a scorecard, only get non-substitute players
    if (forScorecard) {
      matchPlayersQuery.eq('isSubstitute', false)
    }

    const { data: matchPlayers, error: matchPlayersError } = await matchPlayersQuery

    if (matchPlayersError) {
      throw matchPlayersError
    }

    // Get all players from both teams
    const homeTeamPlayersQuery = supabase
      .from('Player')
      .select(`
        id,
        name,
        handicapIndex,
        teamId,
        playerType,
        Team (
          id,
          name
        )
      `)
      .eq('teamId', match.homeTeamId)
    
    // If this is for a scorecard, only get primary players
    if (forScorecard) {
      homeTeamPlayersQuery.eq('playerType', 'PRIMARY')
    }

    const { data: homeTeamPlayers, error: homeTeamPlayersError } = await homeTeamPlayersQuery

    if (homeTeamPlayersError) {
      throw homeTeamPlayersError
    }

    const awayTeamPlayersQuery = supabase
      .from('Player')
      .select(`
        id,
        name,
        handicapIndex,
        teamId,
        playerType,
        Team (
          id,
          name
        )
      `)
      .eq('teamId', match.awayTeamId)
    
    // If this is for a scorecard, only get primary players
    if (forScorecard) {
      awayTeamPlayersQuery.eq('playerType', 'PRIMARY')
    }

    const { data: awayTeamPlayers, error: awayTeamPlayersError } = await awayTeamPlayersQuery

    if (awayTeamPlayersError) {
      throw awayTeamPlayersError
    }

    // Combine all players
    const allPlayers = [...(homeTeamPlayers || []), ...(awayTeamPlayers || [])]

    // Format the response
    const response = {
      match,
      matchPlayers: matchPlayers || [],
      homeTeamPlayers: homeTeamPlayers || [],
      awayTeamPlayers: awayTeamPlayers || [],
      allPlayers,
    }

    return NextResponse.json(response)
  } catch (error) {
    return handleError(error, 'Error fetching match players');
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
      console.log(`Processing substitution: Original player ${originalPlayerId} -> Substitute player ${substitutePlayerId} for team ${teamId}`)

      // Verify players belong to the correct team
      let originalPlayer;
      let substitutePlayer;
      
      try {
        // Try to use Supabase client if available
        const { data: players, error } = await supabase
          .from('Player')
          .select('id, teamId, name, handicapIndex')
          .eq('id', originalPlayerId)

        if (error) {
          throw error
        }

        originalPlayer = players[0];

        const { data: substitutePlayers, error: substituteError } = await supabase
          .from('Player')
          .select('id, teamId, name, handicapIndex')
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

      // Find the match player entry for the original player
      const { data: matchPlayerData, error: matchPlayerError } = await supabase
        .from('MatchPlayer')
        .select('id')
        .eq('matchId', matchId)
        .eq('playerId', originalPlayerId)
        .single();

      if (matchPlayerError) {
        console.log(`Match player not found for player ${originalPlayerId} in match ${matchId}. Checking if this match exists...`);
        
        // Verify the match exists
        const { data: matchData, error: matchError } = await supabase
          .from('Match')
          .select('id, status')
          .eq('id', matchId)
          .single();
          
        if (matchError) {
          console.error('Match does not exist:', matchError);
          return NextResponse.json(
            { error: `Match ${matchId} does not exist`, details: String(matchError) },
            { status: 404 }
          );
        }
        
        // Match exists but player assignment doesn't - create it first
        if (matchData && matchData.status === 'SCHEDULED') {
          console.log(`Creating new match player record for player ${originalPlayerId} in match ${matchId}`);
          
          // Create a new match player record for the original player
          const { data: newMatchPlayer, error: createError } = await supabase
            .from('MatchPlayer')
            .insert({
              matchId,
              playerId: originalPlayerId,
              isSubstitute: false,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            })
            .select('id')
            .single();
            
          if (createError) {
            console.error('Error creating match player:', createError);
            return NextResponse.json(
              { error: `Failed to create match player for ${originalPlayerId}`, details: String(createError) },
              { status: 500 }
            );
          }
          
          // Now update this newly created record with the substitute
          const { error: updateError } = await supabase
            .from('MatchPlayer')
            .update({
              playerId: substitutePlayerId,
              isSubstitute: true,
              updatedAt: new Date().toISOString()
            })
            .eq('id', newMatchPlayer.id);
            
          if (updateError) {
            console.error('Error updating new match player:', updateError);
            return NextResponse.json(
              { error: `Failed to update new match player with substitute ${substitutePlayerId}`, details: String(updateError) },
              { status: 500 }
            );
          }
          
          console.log(`Successfully created and substituted player ${substitutePlayerId} for ${originalPlayerId} in match ${matchId}`);
          continue; // Skip to the next assignment
        } else {
          // Match exists but is not in SCHEDULED status
          return NextResponse.json(
            { error: `Cannot substitute players for match ${matchId} with status ${matchData?.status}` },
            { status: 400 }
          );
        }
      }

      // Update the match player with the substitute
      const { error: updateError } = await supabase
        .from('MatchPlayer')
        .update({
          playerId: substitutePlayerId,
          isSubstitute: true,
          updatedAt: new Date().toISOString()
        })
        .eq('id', matchPlayerData.id);

      if (updateError) {
        console.error('Error updating match player:', updateError);
        return NextResponse.json(
          { error: `Failed to update match player with substitute ${substitutePlayerId}`, details: String(updateError) },
          { status: 500 }
        );
      }

      console.log(`Substituted player ${substitutePlayerId} for ${originalPlayerId} in match ${matchId}`);
    }

    // Emit match updated event
    await emitMatchUpdated(matchId)

    // Get team name for the response
    const teamId = playerAssignments[0].teamId;
    const { data: team } = await supabase
      .from('Team')
      .select('name')
      .eq('id', teamId)
      .single();
    
    const teamName = team ? team.name : (teamId === 'homeTeamId' ? 'Home Team' : 'Away Team');

    return NextResponse.json({
      success: true,
      message: `${teamName} was updated with active players for this match`,
      teamName: teamName
    })
  } catch (error) {
    return handleError(error, 'Error updating match players');
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

    // Check if the player is already assigned to this match
    const { data: existingPlayer, error: checkError } = await supabase
      .from('MatchPlayer')
      .select('id')
      .eq('matchId', params.id)
      .eq('playerId', player.id)
      .single();

    if (!checkError && existingPlayer) {
      return NextResponse.json(
        { error: 'Player is already assigned to this match' },
        { status: 400 }
      );
    }

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
      console.error('Supabase error adding match player:', error);
      throw error
    }

    // Emit match updated event
    await emitMatchUpdated(params.id);

    return NextResponse.json(data)
  } catch (error) {
    return handleError(error, 'Error adding match player');
  }
}

// DELETE: Remove a player from a match
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const playerId = searchParams.get('playerId')

    if (!playerId) {
      return NextResponse.json(
        { error: 'Player ID is required' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('MatchPlayer')
      .delete()
      .eq('matchId', params.id)
      .eq('playerId', playerId)

    if (error) {
      throw error
    }

    // Emit match updated event
    await emitMatchUpdated(params.id);

    return NextResponse.json({ success: true })
  } catch (error) {
    return handleError(error, 'Error removing match player');
  }
}