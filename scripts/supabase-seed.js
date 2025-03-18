const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

// Supabase connection details from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ylhwysupdkmbunaascky.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// CD Golf League teams data
const teams = [
  { id: 'hot-huerter', name: 'Hot/Huerter' },
  { id: 'nick-brent', name: 'Nick/Brent' },
  { id: 'ashley-alli', name: 'Ashley/Alli' },
  { id: 'brett-tony', name: 'Brett/Tony' },
  { id: 'brew-jake', name: 'Brew/Jake' },
  { id: 'clauss-wade', name: 'Clauss/Wade' },
  { id: 'ryan-drew', name: 'Ryan/Drew' },
  { id: 'trev-murph', name: 'Trev/Murph' },
  { id: 'sketch-rob', name: 'Sketch/Rob' },
  { id: 'ap-johnp', name: 'AP/JohnP' }
];

// Example players data with IDs
const players = [
  { id: uuidv4(), name: 'Hot', handicapIndex: 14.2, teamId: 'hot-huerter', playerType: 'PRIMARY' },
  { id: uuidv4(), name: 'Huerter', handicapIndex: 8.5, teamId: 'hot-huerter', playerType: 'PRIMARY' },
  
  { id: uuidv4(), name: 'Nick', handicapIndex: 22.1, teamId: 'nick-brent', playerType: 'PRIMARY' },
  { id: uuidv4(), name: 'Brent', handicapIndex: 12.7, teamId: 'nick-brent', playerType: 'PRIMARY' },
  
  { id: uuidv4(), name: 'Ashley', handicapIndex: 5.3, teamId: 'ashley-alli', playerType: 'PRIMARY' },
  { id: uuidv4(), name: 'Alli', handicapIndex: 18.9, teamId: 'ashley-alli', playerType: 'PRIMARY' },
  
  { id: uuidv4(), name: 'Brett', handicapIndex: 10.6, teamId: 'brett-tony', playerType: 'PRIMARY' },
  { id: uuidv4(), name: 'Tony', handicapIndex: 15.8, teamId: 'brett-tony', playerType: 'PRIMARY' },
  
  { id: uuidv4(), name: 'Brew', handicapIndex: 24.5, teamId: 'brew-jake', playerType: 'PRIMARY' },
  { id: uuidv4(), name: 'Jake', handicapIndex: 9.2, teamId: 'brew-jake', playerType: 'PRIMARY' },
  
  { id: uuidv4(), name: 'Clauss', handicapIndex: 13.4, teamId: 'clauss-wade', playerType: 'PRIMARY' },
  { id: uuidv4(), name: 'Wade', handicapIndex: 19.7, teamId: 'clauss-wade', playerType: 'PRIMARY' },
  
  { id: uuidv4(), name: 'Ryan', handicapIndex: 7.8, teamId: 'ryan-drew', playerType: 'PRIMARY' },
  { id: uuidv4(), name: 'Drew', handicapIndex: 16.3, teamId: 'ryan-drew', playerType: 'PRIMARY' },
  
  { id: uuidv4(), name: 'Trev', handicapIndex: 21.2, teamId: 'trev-murph', playerType: 'PRIMARY' },
  { id: uuidv4(), name: 'Murph', handicapIndex: 11.5, teamId: 'trev-murph', playerType: 'PRIMARY' },
  
  { id: uuidv4(), name: 'Sketch', handicapIndex: 25.0, teamId: 'sketch-rob', playerType: 'PRIMARY' },
  { id: uuidv4(), name: 'Rob', handicapIndex: 17.1, teamId: 'sketch-rob', playerType: 'PRIMARY' },
  
  { id: uuidv4(), name: 'AP', handicapIndex: 6.7, teamId: 'ap-johnp', playerType: 'PRIMARY' },
  { id: uuidv4(), name: 'JohnP', handicapIndex: 20.4, teamId: 'ap-johnp', playerType: 'PRIMARY' }
];

// Create actual match schedule based on the CD Golf League schedule
const matches = [
  // Week 1 (4/15)
  { id: uuidv4(), date: '2024-04-15T18:00:00Z', weekNumber: 1, homeTeamId: 'hot-huerter', awayTeamId: 'nick-brent', startingHole: 1, status: 'SCHEDULED' },
  { id: uuidv4(), date: '2024-04-15T18:00:00Z', weekNumber: 1, homeTeamId: 'ashley-alli', awayTeamId: 'brett-tony', startingHole: 2, status: 'SCHEDULED' },
  { id: uuidv4(), date: '2024-04-15T18:00:00Z', weekNumber: 1, homeTeamId: 'brew-jake', awayTeamId: 'clauss-wade', startingHole: 3, status: 'SCHEDULED' },
  { id: uuidv4(), date: '2024-04-15T18:00:00Z', weekNumber: 1, homeTeamId: 'sketch-rob', awayTeamId: 'ap-johnp', startingHole: 4, status: 'SCHEDULED' },
  { id: uuidv4(), date: '2024-04-15T18:00:00Z', weekNumber: 1, homeTeamId: 'trev-murph', awayTeamId: 'ryan-drew', startingHole: 5, status: 'SCHEDULED' },
  
  // Week 2 (4/22)
  { id: uuidv4(), date: '2024-04-22T18:00:00Z', weekNumber: 2, homeTeamId: 'brett-tony', awayTeamId: 'brew-jake', startingHole: 1, status: 'SCHEDULED' },
  { id: uuidv4(), date: '2024-04-22T18:00:00Z', weekNumber: 2, homeTeamId: 'nick-brent', awayTeamId: 'ryan-drew', startingHole: 2, status: 'SCHEDULED' },
  { id: uuidv4(), date: '2024-04-22T18:00:00Z', weekNumber: 2, homeTeamId: 'ap-johnp', awayTeamId: 'trev-murph', startingHole: 3, status: 'SCHEDULED' },
  { id: uuidv4(), date: '2024-04-22T18:00:00Z', weekNumber: 2, homeTeamId: 'clauss-wade', awayTeamId: 'sketch-rob', startingHole: 4, status: 'SCHEDULED' },
  { id: uuidv4(), date: '2024-04-22T18:00:00Z', weekNumber: 2, homeTeamId: 'hot-huerter', awayTeamId: 'ashley-alli', startingHole: 5, status: 'SCHEDULED' },
  
  // Week 3 (4/29)
  { id: uuidv4(), date: '2024-04-29T18:00:00Z', weekNumber: 3, homeTeamId: 'ryan-drew', awayTeamId: 'trev-murph', startingHole: 1, status: 'SCHEDULED' },
  { id: uuidv4(), date: '2024-04-29T18:00:00Z', weekNumber: 3, homeTeamId: 'clauss-wade', awayTeamId: 'brett-tony', startingHole: 2, status: 'SCHEDULED' },
  { id: uuidv4(), date: '2024-04-29T18:00:00Z', weekNumber: 3, homeTeamId: 'sketch-rob', awayTeamId: 'hot-huerter', startingHole: 3, status: 'SCHEDULED' },
  { id: uuidv4(), date: '2024-04-29T18:00:00Z', weekNumber: 3, homeTeamId: 'brew-jake', awayTeamId: 'nick-brent', startingHole: 4, status: 'SCHEDULED' },
  { id: uuidv4(), date: '2024-04-29T18:00:00Z', weekNumber: 3, homeTeamId: 'ashley-alli', awayTeamId: 'ap-johnp', startingHole: 5, status: 'SCHEDULED' },
  
  // Week 4 (5/6)
  { id: uuidv4(), date: '2024-05-06T18:00:00Z', weekNumber: 4, homeTeamId: 'nick-brent', awayTeamId: 'ap-johnp', startingHole: 1, status: 'SCHEDULED' },
  { id: uuidv4(), date: '2024-05-06T18:00:00Z', weekNumber: 4, homeTeamId: 'hot-huerter', awayTeamId: 'sketch-rob', startingHole: 2, status: 'SCHEDULED' },
  { id: uuidv4(), date: '2024-05-06T18:00:00Z', weekNumber: 4, homeTeamId: 'ashley-alli', awayTeamId: 'brew-jake', startingHole: 3, status: 'SCHEDULED' },
  { id: uuidv4(), date: '2024-05-06T18:00:00Z', weekNumber: 4, homeTeamId: 'brett-tony', awayTeamId: 'trev-murph', startingHole: 4, status: 'SCHEDULED' },
  { id: uuidv4(), date: '2024-05-06T18:00:00Z', weekNumber: 4, homeTeamId: 'clauss-wade', awayTeamId: 'ryan-drew', startingHole: 5, status: 'SCHEDULED' },
  
  // Week 5 (5/13)
  { id: uuidv4(), date: '2024-05-13T18:00:00Z', weekNumber: 5, homeTeamId: 'sketch-rob', awayTeamId: 'ashley-alli', startingHole: 1, status: 'SCHEDULED' },
  { id: uuidv4(), date: '2024-05-13T18:00:00Z', weekNumber: 5, homeTeamId: 'brew-jake', awayTeamId: 'nick-brent', startingHole: 2, status: 'SCHEDULED' },
  { id: uuidv4(), date: '2024-05-13T18:00:00Z', weekNumber: 5, homeTeamId: 'ryan-drew', awayTeamId: 'brett-tony', startingHole: 3, status: 'SCHEDULED' },
  { id: uuidv4(), date: '2024-05-13T18:00:00Z', weekNumber: 5, homeTeamId: 'ap-johnp', awayTeamId: 'clauss-wade', startingHole: 4, status: 'SCHEDULED' },
  { id: uuidv4(), date: '2024-05-13T18:00:00Z', weekNumber: 5, homeTeamId: 'trev-murph', awayTeamId: 'hot-huerter', startingHole: 5, status: 'SCHEDULED' },
  
  // Week 6 (5/20)
  { id: uuidv4(), date: '2024-05-20T18:00:00Z', weekNumber: 6, homeTeamId: 'nick-brent', awayTeamId: 'clauss-wade', startingHole: 1, status: 'SCHEDULED' },
  { id: uuidv4(), date: '2024-05-20T18:00:00Z', weekNumber: 6, homeTeamId: 'brett-tony', awayTeamId: 'ap-johnp', startingHole: 2, status: 'SCHEDULED' },
  { id: uuidv4(), date: '2024-05-20T18:00:00Z', weekNumber: 6, homeTeamId: 'hot-huerter', awayTeamId: 'ryan-drew', startingHole: 3, status: 'SCHEDULED' },
  { id: uuidv4(), date: '2024-05-20T18:00:00Z', weekNumber: 6, homeTeamId: 'ashley-alli', awayTeamId: 'trev-murph', startingHole: 4, status: 'SCHEDULED' },
  { id: uuidv4(), date: '2024-05-20T18:00:00Z', weekNumber: 6, homeTeamId: 'brew-jake', awayTeamId: 'sketch-rob', startingHole: 5, status: 'SCHEDULED' },
  
  // Week 7 (5/27)
  { id: uuidv4(), date: '2024-05-27T18:00:00Z', weekNumber: 7, homeTeamId: 'ryan-drew', awayTeamId: 'ashley-alli', startingHole: 1, status: 'SCHEDULED' },
  { id: uuidv4(), date: '2024-05-27T18:00:00Z', weekNumber: 7, homeTeamId: 'trev-murph', awayTeamId: 'brew-jake', startingHole: 2, status: 'SCHEDULED' },
  { id: uuidv4(), date: '2024-05-27T18:00:00Z', weekNumber: 7, homeTeamId: 'sketch-rob', awayTeamId: 'nick-brent', startingHole: 3, status: 'SCHEDULED' },
  { id: uuidv4(), date: '2024-05-27T18:00:00Z', weekNumber: 7, homeTeamId: 'ap-johnp', awayTeamId: 'hot-huerter', startingHole: 4, status: 'SCHEDULED' },
  { id: uuidv4(), date: '2024-05-27T18:00:00Z', weekNumber: 7, homeTeamId: 'clauss-wade', awayTeamId: 'brett-tony', startingHole: 5, status: 'SCHEDULED' },
  
  // Week 8 (6/3)
  { id: uuidv4(), date: '2024-06-03T18:00:00Z', weekNumber: 8, homeTeamId: 'sketch-rob', awayTeamId: 'ashley-alli', startingHole: 1, status: 'SCHEDULED' },
  { id: uuidv4(), date: '2024-06-03T18:00:00Z', weekNumber: 8, homeTeamId: 'trev-murph', awayTeamId: 'ap-johnp', startingHole: 2, status: 'SCHEDULED' },
  { id: uuidv4(), date: '2024-06-03T18:00:00Z', weekNumber: 8, homeTeamId: 'hot-huerter', awayTeamId: 'clauss-wade', startingHole: 3, status: 'SCHEDULED' },
  { id: uuidv4(), date: '2024-06-03T18:00:00Z', weekNumber: 8, homeTeamId: 'nick-brent', awayTeamId: 'brett-tony', startingHole: 4, status: 'SCHEDULED' },
  { id: uuidv4(), date: '2024-06-03T18:00:00Z', weekNumber: 8, homeTeamId: 'brew-jake', awayTeamId: 'ryan-drew', startingHole: 5, status: 'SCHEDULED' },
  
  // Week 9 (6/10)
  { id: uuidv4(), date: '2024-06-10T18:00:00Z', weekNumber: 9, homeTeamId: 'clauss-wade', awayTeamId: 'ashley-alli', startingHole: 1, status: 'SCHEDULED' },
  { id: uuidv4(), date: '2024-06-10T18:00:00Z', weekNumber: 9, homeTeamId: 'brett-tony', awayTeamId: 'hot-huerter', startingHole: 2, status: 'SCHEDULED' },
  { id: uuidv4(), date: '2024-06-10T18:00:00Z', weekNumber: 9, homeTeamId: 'trev-murph', awayTeamId: 'nick-brent', startingHole: 3, status: 'SCHEDULED' },
  { id: uuidv4(), date: '2024-06-10T18:00:00Z', weekNumber: 9, homeTeamId: 'ryan-drew', awayTeamId: 'sketch-rob', startingHole: 4, status: 'SCHEDULED' },
  { id: uuidv4(), date: '2024-06-10T18:00:00Z', weekNumber: 9, homeTeamId: 'ap-johnp', awayTeamId: 'brew-jake', startingHole: 5, status: 'SCHEDULED' },
  
  // Week 10 (6/17) - Week 10 seems to be missing from your table, so I'll leave it empty
  
  // Week 11 (6/24)
  { id: uuidv4(), date: '2024-06-24T18:00:00Z', weekNumber: 11, homeTeamId: 'brett-tony', awayTeamId: 'trev-murph', startingHole: 1, status: 'SCHEDULED' },
  { id: uuidv4(), date: '2024-06-24T18:00:00Z', weekNumber: 11, homeTeamId: 'ryan-drew', awayTeamId: 'clauss-wade', startingHole: 2, status: 'SCHEDULED' },
  { id: uuidv4(), date: '2024-06-24T18:00:00Z', weekNumber: 11, homeTeamId: 'ap-johnp', awayTeamId: 'hot-huerter', startingHole: 3, status: 'SCHEDULED' },
  { id: uuidv4(), date: '2024-06-24T18:00:00Z', weekNumber: 11, homeTeamId: 'ashley-alli', awayTeamId: 'brew-jake', startingHole: 4, status: 'SCHEDULED' },
  { id: uuidv4(), date: '2024-06-24T18:00:00Z', weekNumber: 11, homeTeamId: 'nick-brent', awayTeamId: 'sketch-rob', startingHole: 5, status: 'SCHEDULED' },
  
  // Week 12 (7/1)
  { id: uuidv4(), date: '2024-07-01T18:00:00Z', weekNumber: 12, homeTeamId: 'hot-huerter', awayTeamId: 'trev-murph', startingHole: 1, status: 'SCHEDULED' },
  { id: uuidv4(), date: '2024-07-01T18:00:00Z', weekNumber: 12, homeTeamId: 'sketch-rob', awayTeamId: 'clauss-wade', startingHole: 2, status: 'SCHEDULED' },
  { id: uuidv4(), date: '2024-07-01T18:00:00Z', weekNumber: 12, homeTeamId: 'ashley-alli', awayTeamId: 'ryan-drew', startingHole: 3, status: 'SCHEDULED' },
  { id: uuidv4(), date: '2024-07-01T18:00:00Z', weekNumber: 12, homeTeamId: 'nick-brent', awayTeamId: 'hot-huerter', startingHole: 4, status: 'SCHEDULED' },
  { id: uuidv4(), date: '2024-07-01T18:00:00Z', weekNumber: 12, homeTeamId: 'ap-johnp', awayTeamId: 'brett-tony', startingHole: 5, status: 'SCHEDULED' },
  
  // Week 13 (7/8)
  { id: uuidv4(), date: '2024-07-08T18:00:00Z', weekNumber: 13, homeTeamId: 'trev-murph', awayTeamId: 'clauss-wade', startingHole: 1, status: 'SCHEDULED' },
  { id: uuidv4(), date: '2024-07-08T18:00:00Z', weekNumber: 13, homeTeamId: 'ap-johnp', awayTeamId: 'ashley-alli', startingHole: 2, status: 'SCHEDULED' },
  { id: uuidv4(), date: '2024-07-08T18:00:00Z', weekNumber: 13, homeTeamId: 'nick-brent', awayTeamId: 'brew-jake', startingHole: 3, status: 'SCHEDULED' },
  { id: uuidv4(), date: '2024-07-08T18:00:00Z', weekNumber: 13, homeTeamId: 'ryan-drew', awayTeamId: 'hot-huerter', startingHole: 4, status: 'SCHEDULED' },
  { id: uuidv4(), date: '2024-07-08T18:00:00Z', weekNumber: 13, homeTeamId: 'sketch-rob', awayTeamId: 'brett-tony', startingHole: 5, status: 'SCHEDULED' },
  
  // Week 14 (7/15)
  { id: uuidv4(), date: '2024-07-15T18:00:00Z', weekNumber: 14, homeTeamId: 'hot-huerter', awayTeamId: 'sketch-rob', startingHole: 1, status: 'SCHEDULED' },
  { id: uuidv4(), date: '2024-07-15T18:00:00Z', weekNumber: 14, homeTeamId: 'nick-brent', awayTeamId: 'clauss-wade', startingHole: 2, status: 'SCHEDULED' },
  { id: uuidv4(), date: '2024-07-15T18:00:00Z', weekNumber: 14, homeTeamId: 'ashley-alli', awayTeamId: 'ryan-drew', startingHole: 3, status: 'SCHEDULED' },
  { id: uuidv4(), date: '2024-07-15T18:00:00Z', weekNumber: 14, homeTeamId: 'brew-jake', awayTeamId: 'brett-tony', startingHole: 4, status: 'SCHEDULED' },
  { id: uuidv4(), date: '2024-07-15T18:00:00Z', weekNumber: 14, homeTeamId: 'trev-murph', awayTeamId: 'ap-johnp', startingHole: 5, status: 'SCHEDULED' }
];

// Seed functions
async function clearData() {
  console.log('Clearing existing data...');
  
  try {
    // Delete in order to respect foreign key constraints
    await supabase.from('MatchPlayer').delete().neq('id', '');
    await supabase.from('MatchScore').delete().neq('id', '');
    await supabase.from('MatchPoints').delete().neq('id', '');
    await supabase.from('PlayerSubstitution').delete().neq('id', '');
    await supabase.from('Match').delete().neq('id', '');
    await supabase.from('Player').delete().neq('id', '');
    await supabase.from('Team').delete().neq('id', '');
    
    console.log('Database cleared successfully');
    return true;
  } catch (error) {
    console.error('Error clearing database:', error.message);
    return false;
  }
}

async function seedTeams() {
  console.log('Creating teams...');
  
  try {
    const now = new Date().toISOString();
    const teamsWithTimestamps = teams.map(team => ({
      ...team,
      createdAt: now,
      updatedAt: now
    }));
    
    const { data, error } = await supabase.from('Team').upsert(teamsWithTimestamps);
    
    if (error) throw error;
    console.log(`Created ${teamsWithTimestamps.length} teams`);
    return true;
  } catch (error) {
    console.error('Error creating teams:', error.message);
    return false;
  }
}

async function seedPlayers() {
  console.log('Creating players...');
  
  try {
    const now = new Date().toISOString();
    const playersWithTimestamps = players.map(player => ({
      ...player,
      createdAt: now,
      updatedAt: now
    }));
    
    const { data, error } = await supabase.from('Player').insert(playersWithTimestamps);
    
    if (error) throw error;
    console.log(`Created ${playersWithTimestamps.length} players`);
    return true;
  } catch (error) {
    console.error('Error creating players:', error.message);
    return false;
  }
}

async function seedMatches() {
  console.log('Creating matches...');
  
  try {
    const now = new Date().toISOString();
    const matchesWithTimestamps = matches.map(match => ({
      ...match,
      createdAt: now,
      updatedAt: now
    }));
    
    const { data, error } = await supabase.from('Match').insert(matchesWithTimestamps);
    
    if (error) throw error;
    console.log(`Created ${matchesWithTimestamps.length} matches`);
    return true;
  } catch (error) {
    console.error('Error creating matches:', error.message);
    return false;
  }
}

// Main function
async function main() {
  console.log('Starting Supabase database seeding...');
  console.log(`Supabase URL: ${supabaseUrl}`);
  
  if (!supabaseKey) {
    console.error('Error: Supabase key not found in environment variables');
    process.exit(1);
  }
  
  // Clear existing data
  await clearData();
  
  // Seed data
  await seedTeams();
  await seedPlayers();
  await seedMatches();
  
  console.log('Seed data created successfully!');
  process.exit(0);
}

// Run the main function
main().catch(error => {
  console.error('Error in seed script:', error);
  process.exit(1);
}); 