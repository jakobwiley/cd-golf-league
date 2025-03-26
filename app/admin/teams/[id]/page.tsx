import React from 'react';
import { supabase } from '../../../../lib/supabase';
import TeamClientComponent from './TeamClientComponent';

export default async function TeamPage({ params }: { params: { id: string } }) {
  const { data: team, error: teamError } = await supabase
    .from('Team')
    .select('*')
    .eq('id', params.id)
    .single();

  if (teamError) {
    console.error('Error fetching team:', teamError);
    return <div>Error loading team</div>;
  }

  const { data: players, error: playersError } = await supabase
    .from('Player')
    .select('*')
    .eq('teamId', params.id)
    .order('name');

  if (playersError) {
    console.error('Error fetching players:', playersError);
    return <div>Error loading players</div>;
  }

  return <TeamClientComponent team={team} players={players} />;
}