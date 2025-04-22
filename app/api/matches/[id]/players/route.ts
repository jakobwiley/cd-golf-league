import { NextResponse } from 'next/server';
import { supabase } from '../../../../../lib/supabase';
import { z } from 'zod';
import { SocketEvents } from '../../../../../app/utils/websocketConnection';
import { v4 as uuidv4 } from 'uuid';

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
  originalPlayerId?: string
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
  // Log full error details for debugging
  console.error('API ERROR:', {
    message,
    error,
    errorString: String(error),
    errorStack: error?.stack,
    errorDetails: error?.details,
    errorHint: error?.hint,
    errorCode: error?.code,
  });
  return NextResponse.json(
    {
      error: message,
      details: String(error),
      stack: error?.stack,
      supabase: {
        details: error?.details,
        hint: error?.hint,
        code: error?.code,
      }
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
    const searchParams = new URL(request.url).searchParams
    const forScorecard = searchParams.get('forScorecard') === 'true'

    // Get match details
    const { data: match, error: matchError } = await supabase
      .from('Match')
      .select(`
        *,
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

    // Get match players - specify the relationship to use with Player!MatchPlayer_playerId_fkey
    const matchPlayersQuery = supabase
      .from('MatchPlayer')
      .select(`
        id,
        matchId,
        playerId,
        isSubstitute,
        originalPlayerId,
        Player:playerId (
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

    // Format the response
    const response = {
      match,
      matchPlayers,
      homeTeamPlayers,
      awayTeamPlayers
    }

    return NextResponse.json(response)
  } catch (error) {
    return handleError(error, 'Error fetching match players')
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
    const { playerAssignments } = MatchPlayerAssignmentsSchema.parse(body)

    // Get existing match players
    const { data: existingMatchPlayers, error: existingMatchPlayersError } = await supabase
      .from('MatchPlayer')
      .select('id, playerId, isSubstitute')
      .eq('matchId', matchId)

    if (existingMatchPlayersError) {
      throw existingMatchPlayersError
    }

    // Create a map of existing match players by playerId
    const existingMatchPlayerMap = new Map(
      existingMatchPlayers.map(player => [player.playerId, player])
    )

    // Process each player assignment
    for (const assignment of playerAssignments) {
      const { originalPlayerId, substitutePlayerId, teamId } = assignment

      // Check if the original player is already assigned to the match
      const existingOriginalPlayer = existingMatchPlayerMap.get(originalPlayerId)

      if (!existingOriginalPlayer) {
        // If the original player is not already assigned, add them
        const { error: addOriginalPlayerError } = await supabase
          .from('MatchPlayer')
          .insert({
            id: uuidv4(),
            matchId,
            playerId: originalPlayerId,
            isSubstitute: false,
            originalPlayerId: originalPlayerId // Set originalPlayerId to the player's own ID
          })

        if (addOriginalPlayerError) {
          throw addOriginalPlayerError
        }
      } else {
        // Update the original player's record
        const { error: updateOriginalPlayerError } = await supabase
          .from('MatchPlayer')
          .update({
            isSubstitute: false,
            originalPlayerId: originalPlayerId // Set originalPlayerId to the player's own ID
          })
          .eq('id', existingOriginalPlayer.id)

        if (updateOriginalPlayerError) {
          throw updateOriginalPlayerError
        }
      }

      // Check if the substitute player is already assigned to the match
      const existingSubstitutePlayer = existingMatchPlayerMap.get(substitutePlayerId)

      // Defensive: ensure originalPlayerId is never null or undefined
      // If it is, skip this assignment and log an error
      if (!originalPlayerId) {
        console.error('Skipping substitute assignment: originalPlayerId is missing for substitutePlayerId', substitutePlayerId)
        continue;
      }

      if (!existingSubstitutePlayer) {
        // If the substitute player is not already assigned, add them
        const { error: addSubstitutePlayerError } = await supabase
          .from('MatchPlayer')
          .insert({
            id: uuidv4(),
            matchId,
            playerId: substitutePlayerId,
            isSubstitute: true,
            originalPlayerId: originalPlayerId // Set originalPlayerId to the original player's ID
          })

        if (addSubstitutePlayerError) {
          throw addSubstitutePlayerError
        }
      } else {
        // Update the substitute player's record
        const { error: updateSubstitutePlayerError } = await supabase
          .from('MatchPlayer')
          .update({
            isSubstitute: true,
            originalPlayerId: originalPlayerId // Set originalPlayerId to the original player's ID
          })
          .eq('id', existingSubstitutePlayer.id)

        if (updateSubstitutePlayerError) {
          throw updateSubstitutePlayerError
        }
      }
    }

    // Emit match updated event
    await emitMatchUpdated(matchId)

    return NextResponse.json({ success: true })
  } catch (error) {
    return handleError(error, 'Error updating player assignments')
  }
}

// POST: Add a new player to a match
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const matchId = params.id
    const body = await request.json()
    const player = playerSchema.parse(body)

    // Check if player is already assigned to the match
    const { data: existingMatchPlayer, error: existingMatchPlayerError } = await supabase
      .from('MatchPlayer')
      .select('id')
      .eq('matchId', matchId)
      .eq('playerId', player.id)
      .maybeSingle()

    if (existingMatchPlayerError) {
      throw existingMatchPlayerError
    }

    if (existingMatchPlayer) {
      return NextResponse.json(
        { error: 'Player is already assigned to this match' },
        { status: 400 }
      )
    }

    // Add player to the match
    const { data, error } = await supabase
      .from('MatchPlayer')
      .insert({
        id: uuidv4(),
        matchId,
        playerId: player.id,
        isSubstitute: player.playerType === 'SUBSTITUTE',
        originalPlayerId: player.id // Set originalPlayerId to the player's own ID initially
      })
      .select()

    if (error) {
      throw error
    }

    // Emit match updated event
    await emitMatchUpdated(matchId)

    return NextResponse.json(data)
  } catch (error) {
    return handleError(error, 'Error adding player to match')
  }
}

// DELETE: Remove a player from a match
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const matchId = params.id
    const url = new URL(request.url)
    const playerId = url.searchParams.get('playerId')

    if (!playerId) {
      return NextResponse.json(
        { error: 'Player ID is required' },
        { status: 400 }
      )
    }

    // Remove player from the match
    const { error } = await supabase
      .from('MatchPlayer')
      .delete()
      .eq('matchId', matchId)
      .eq('playerId', playerId)

    if (error) {
      throw error
    }

    // Emit match updated event
    await emitMatchUpdated(matchId)

    return NextResponse.json({ success: true })
  } catch (error) {
    return handleError(error, 'Error removing player from match')
  }
}