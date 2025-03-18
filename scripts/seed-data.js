const { createClient } = require('@supabase/supabase-js');
const mockData = require('../.mock-data.json');
require('dotenv').config();

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  try {
    console.log('Starting database seeding...');
    
    // Create teams
    console.log('Creating teams...');
    const teams = mockData.teams.map(({ id, name, createdAt, updatedAt }) => ({
      id,
      name,
      createdAt,
      updatedAt
    }));
    
    const { error: teamsError } = await supabase
      .from('Team')
      .upsert(teams);
    
    if (teamsError) {
      console.error('Error creating teams:', teamsError);
      throw teamsError;
    }
    console.log(`Created ${teams.length} teams.`);

    // Create players
    console.log('Creating players...');
    const players = mockData.players.map(({ id, name, handicapIndex, teamId, playerType, createdAt, updatedAt }) => ({
      id,
      name,
      handicapIndex,
      teamId,
      playerType,
      createdAt,
      updatedAt
    }));
    
    const { error: playersError } = await supabase
      .from('Player')
      .upsert(players);
    
    if (playersError) {
      console.error('Error creating players:', playersError);
      throw playersError;
    }
    console.log(`Created ${players.length} players.`);

    // Create matches
    console.log('Creating matches...');
    const matches = mockData.matches.map(({ id, date, weekNumber, homeTeamId, awayTeamId, startingHole, status }) => ({
      id,
      date,
      weekNumber,
      homeTeamId,
      awayTeamId,
      startingHole: startingHole || 1,
      status: status || 'SCHEDULED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));
    
    const { error: matchesError } = await supabase
      .from('Match')
      .upsert(matches);
    
    if (matchesError) {
      console.error('Error creating matches:', matchesError);
      throw matchesError;
    }
    console.log(`Created ${matches.length} matches.`);

    console.log('Seed data created successfully!');
  } catch (error) {
    console.error('Error in seed script:', error);
    process.exit(1);
  }
}

main();
