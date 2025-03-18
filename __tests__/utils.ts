import { Response } from 'supertest';
import { supabase } from '../lib/supabase'
import { v4 as uuidv4 } from 'uuid'

// Helper function to get response data
export const getResponseData = (response: Response | null): any => {
  if (!response) return null;
  return response.body;
};

// Create test teams
export const createTestTeams = () => {
  return [
    { id: 1, name: 'Team A' },
    { id: 2, name: 'Team B' },
  ];
};

// Helper function to create a test team
export async function createTestTeam(name: string = 'Test Team') {
  const { data: team, error } = await supabase
    .from('Team')
    .insert([{ id: uuidv4(), name }])
    .select()
    .single()

  if (error) {
    throw error
  }

  return team
}

// Helper function to create a test player
export async function createTestPlayer(teamId: string, name: string = 'Test Player', handicapIndex: number = 10) {
  const { data: player, error } = await supabase
    .from('Player')
    .insert([{
      id: uuidv4(),
      name,
      handicapIndex,
      teamId,
      playerType: 'PRIMARY'
    }])
    .select()
    .single()

  if (error) {
    throw error
  }

  return player
}

// Helper function to create a test match
export async function createTestMatch(
  homeTeamId: string,
  awayTeamId: string,
  date: string = '2025-04-15T18:00:00.000Z',
  weekNumber: number = 1,
  startingHole: number = 1
) {
  const { data: match, error } = await supabase
    .from('Match')
    .insert([{
      id: uuidv4(),
      date,
      weekNumber,
      homeTeamId,
      awayTeamId,
      startingHole,
      status: 'SCHEDULED'
    }])
    .select()
    .single()

  if (error) {
    throw error
  }

  return match
}

// Helper function to clear the database
export async function clearDatabase() {
  await supabase.from('MatchScore').delete().neq('id', '')
  await supabase.from('MatchPoints').delete().neq('id', '')
  await supabase.from('MatchPlayer').delete().neq('id', '')
  await supabase.from('Match').delete().neq('id', '')
  await supabase.from('Player').delete().neq('id', '')
  await supabase.from('Team').delete().neq('id', '')
}