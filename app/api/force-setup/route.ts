import { NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'
import { v4 as uuidv4 } from 'uuid'

// Team data
const teams = [
  "Nick/Brent",
  "Hot/Huerter",
  "Ashley/Alli",
  "Brew/Jake",
  "Sketch/Rob",
  "Trev/Murph",
  "Ryan/Drew",
  "AP/JohnP",
  "Clauss/Wade",
  "Brett/Tony"
];

// Player data with names and handicaps
const playerData = [
  { name: 'AP', handicap: 7.3, teamName: 'AP/JohnP' },
  { name: 'JohnP', handicap: 21.4, teamName: 'AP/JohnP' },
  
  { name: 'Brett', handicap: 10.3, teamName: 'Brett/Tony' },
  { name: 'Tony', handicap: 14.1, teamName: 'Brett/Tony' },
  
  { name: 'Drew', handicap: 10.6, teamName: 'Ryan/Drew' },
  { name: 'Ryan', handicap: 13.9, teamName: 'Ryan/Drew' },
  
  { name: 'Nick', handicap: 11.3, teamName: 'Nick/Brent' },
  { name: 'Brent', handicap: 12.0, teamName: 'Nick/Brent' },
  
  { name: 'Huerter', handicap: 11.8, teamName: 'Hot/Huerter' },
  { name: 'Hot', handicap: 17.2, teamName: 'Hot/Huerter' },
  
  { name: 'Sketch', handicap: 11.9, teamName: 'Sketch/Rob' },
  { name: 'Rob', handicap: 18.1, teamName: 'Sketch/Rob' },
  
  { name: 'Clauss', handicap: 12.5, teamName: 'Clauss/Wade' },
  { name: 'Wade', handicap: 15.0, teamName: 'Clauss/Wade' },
  
  { name: 'Murph', handicap: 12.6, teamName: 'Trev/Murph' },
  { name: 'Trev', handicap: 16, teamName: 'Trev/Murph' },
  
  { name: 'Brew', handicap: 13.4, teamName: 'Brew/Jake' },
  { name: 'Jake', handicap: 16.7, teamName: 'Brew/Jake' },
  
  { name: 'Ashley', handicap: 40.6, teamName: 'Ashley/Alli' },
  { name: 'Alli', handicap: 30.0, teamName: 'Ashley/Alli' }
];

// Schedule data
const scheduleData = [
  // Week 1 - April 15, 2025
  [1, 1, 'Hot/Huerter', 'Nick/Brent', '2025-04-15T18:00:00.000Z'],
  [1, 2, 'Ashley/Alli', 'Brett/Tony', '2025-04-15T18:00:00.000Z'],
  [1, 3, 'Brew/Jake', 'Clauss/Wade', '2025-04-15T18:00:00.000Z'],
  [1, 4, 'Sketch/Rob', 'AP/JohnP', '2025-04-15T18:00:00.000Z'],
  [1, 5, 'Trev/Murph', 'Ryan/Drew', '2025-04-15T18:00:00.000Z'],
  
  // Week 2 - April 22, 2025
  [2, 1, 'Brett/Tony', 'Brew/Jake', '2025-04-22T18:00:00.000Z'],
  [2, 2, 'Nick/Brent', 'Ryan/Drew', '2025-04-22T18:00:00.000Z'],
  [2, 3, 'AP/JohnP', 'Trev/Murph', '2025-04-22T18:00:00.000Z'],
  [2, 4, 'Clauss/Wade', 'Sketch/Rob', '2025-04-22T18:00:00.000Z'],
  [2, 5, 'Hot/Huerter', 'Ashley/Alli', '2025-04-22T18:00:00.000Z'],
  
  // Week 3 - April 29, 2025
  [3, 1, 'Ryan/Drew', 'AP/JohnP', '2025-04-29T18:00:00.000Z'],
  [3, 2, 'Trev/Murph', 'Clauss/Wade', '2025-04-29T18:00:00.000Z'],
  [3, 3, 'Sketch/Rob', 'Brett/Tony', '2025-04-29T18:00:00.000Z'],
  [3, 4, 'Brew/Jake', 'Hot/Huerter', '2025-04-29T18:00:00.000Z'],
  [3, 5, 'Ashley/Alli', 'Nick/Brent', '2025-04-29T18:00:00.000Z'],
  
  // Week 4 - May 6, 2025
  [4, 1, 'Nick/Brent', 'AP/JohnP', '2025-05-06T18:00:00.000Z'],
  [4, 2, 'Hot/Huerter', 'Sketch/Rob', '2025-05-06T18:00:00.000Z'],
  [4, 3, 'Ashley/Alli', 'Brew/Jake', '2025-05-06T18:00:00.000Z'],
  [4, 4, 'Brett/Tony', 'Trev/Murph', '2025-05-06T18:00:00.000Z'],
  [4, 5, 'Clauss/Wade', 'Ryan/Drew', '2025-05-06T18:00:00.000Z'],
  
  // Week 5 - May 13, 2025
  [5, 1, 'Sketch/Rob', 'Ashley/Alli', '2025-05-13T18:00:00.000Z'],
  [5, 2, 'Brew/Jake', 'Nick/Brent', '2025-05-13T18:00:00.000Z'],
  [5, 3, 'Ryan/Drew', 'Brett/Tony', '2025-05-13T18:00:00.000Z'],
  [5, 4, 'AP/JohnP', 'Clauss/Wade', '2025-05-13T18:00:00.000Z'],
  [5, 5, 'Trev/Murph', 'Hot/Huerter', '2025-05-13T18:00:00.000Z'],
  
  // Week 6 - May 20, 2025
  [6, 1, 'Nick/Brent', 'Clauss/Wade', '2025-05-20T18:00:00.000Z'],
  [6, 2, 'Brett/Tony', 'AP/JohnP', '2025-05-20T18:00:00.000Z'],
  [6, 3, 'Hot/Huerter', 'Ryan/Drew', '2025-05-20T18:00:00.000Z'],
  [6, 4, 'Ashley/Alli', 'Trev/Murph', '2025-05-20T18:00:00.000Z'],
  [6, 5, 'Brew/Jake', 'Sketch/Rob', '2025-05-20T18:00:00.000Z'],
  
  // Week 7 - May 27, 2025
  [7, 1, 'Ryan/Drew', 'Ashley/Alli', '2025-05-27T18:00:00.000Z'],
  [7, 2, 'Trev/Murph', 'Brew/Jake', '2025-05-27T18:00:00.000Z'],
  [7, 3, 'AP/JohnP', 'Hot/Huerter', '2025-05-27T18:00:00.000Z'],
  [7, 4, 'Clauss/Wade', 'Brett/Tony', '2025-05-27T18:00:00.000Z'],
  [7, 5, 'Nick/Brent', 'Sketch/Rob', '2025-05-27T18:00:00.000Z'],
  
  // Week 8 - June 3, 2025
  [8, 1, 'Brew/Jake', 'AP/JohnP', '2025-06-03T18:00:00.000Z'],
  [8, 2, 'Sketch/Rob', 'Trev/Murph', '2025-06-03T18:00:00.000Z'],
  [8, 3, 'Ashley/Alli', 'Clauss/Wade', '2025-06-03T18:00:00.000Z'],
  [8, 4, 'Hot/Huerter', 'Brett/Tony', '2025-06-03T18:00:00.000Z'],
  [8, 5, 'Nick/Brent', 'Ryan/Drew', '2025-06-03T18:00:00.000Z'],
  
  // Week 9 - June 10, 2025
  [9, 1, 'AP/JohnP', 'Ashley/Alli', '2025-06-10T18:00:00.000Z'],
  [9, 2, 'Clauss/Wade', 'Hot/Huerter', '2025-06-10T18:00:00.000Z'],
  [9, 3, 'Brett/Tony', 'Nick/Brent', '2025-06-10T18:00:00.000Z'],
  [9, 4, 'Ryan/Drew', 'Brew/Jake', '2025-06-10T18:00:00.000Z'],
  [9, 5, 'Trev/Murph', 'Sketch/Rob', '2025-06-10T18:00:00.000Z'],
  
  // Week 11 - June 24, 2025
  [11, 1, 'Brett/Tony', 'Trev/Murph', '2025-06-24T18:00:00.000Z'],
  [11, 2, 'Ryan/Drew', 'Clauss/Wade', '2025-06-24T18:00:00.000Z'],
  [11, 3, 'AP/JohnP', 'Hot/Huerter', '2025-06-24T18:00:00.000Z'],
  [11, 4, 'Ashley/Alli', 'Brew/Jake', '2025-06-24T18:00:00.000Z'],
  [11, 5, 'Nick/Brent', 'Sketch/Rob', '2025-06-24T18:00:00.000Z'],
  
  // Week 12 - July 1, 2025
  [12, 1, 'Hot/Huerter', 'Brew/Jake', '2025-07-01T18:00:00.000Z'],
  [12, 2, 'Sketch/Rob', 'Trev/Murph', '2025-07-01T18:00:00.000Z'],
  [12, 3, 'Ashley/Alli', 'Clauss/Wade', '2025-07-01T18:00:00.000Z'],
  [12, 4, 'Nick/Brent', 'Ryan/Drew', '2025-07-01T18:00:00.000Z'],
  [12, 5, 'AP/JohnP', 'Brett/Tony', '2025-07-01T18:00:00.000Z'],
  
  // Week 13 - July 8, 2025
  [13, 1, 'Trev/Murph', 'Clauss/Wade', '2025-07-08T18:00:00.000Z'],
  [13, 2, 'AP/JohnP', 'Ashley/Alli', '2025-07-08T18:00:00.000Z'],
  [13, 3, 'Nick/Brent', 'Brew/Jake', '2025-07-08T18:00:00.000Z'],
  [13, 4, 'Ryan/Drew', 'Hot/Huerter', '2025-07-08T18:00:00.000Z'],
  [13, 5, 'Sketch/Rob', 'Brett/Tony', '2025-07-08T18:00:00.000Z'],
  
  // Week 14 - July 15, 2025
  [14, 1, 'Hot/Huerter', 'Sketch/Rob', '2025-07-15T18:00:00.000Z'],
  [14, 2, 'Nick/Brent', 'Clauss/Wade', '2025-07-15T18:00:00.000Z'],
  [14, 3, 'Ashley/Alli', 'Ryan/Drew', '2025-07-15T18:00:00.000Z'],
  [14, 4, 'Brew/Jake', 'Brett/Tony', '2025-07-15T18:00:00.000Z'],
  [14, 5, 'Trev/Murph', 'AP/JohnP', '2025-07-15T18:00:00.000Z']
];

export async function POST() {
  try {
    // Delete all existing data
    const tables = ['MatchScore', 'MatchPlayer', 'Match', 'Player', 'Team']
    
    for (const table of tables) {
      console.log(`Deleting all rows from ${table}...`);
      const { error } = await supabase
        .from(table)
        .delete()
        .neq('id', '') // Delete all rows
      
      if (error) {
        console.error(`Error deleting from ${table}:`, error);
        throw error;
      }
      console.log(`Successfully deleted all rows from ${table}`);
    }

    // Create teams
    const teamMap = new Map();
    for (let i = 0; i < teams.length; i++) {
      const teamName = teams[i];
      const teamId = uuidv4();
      
      // Create team
      console.log(`Creating team ${teamName}...`);
      const { data, error } = await supabase
        .from('Team')
        .insert([
          { 
            id: teamId,
            name: teamName,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ])
        .select()
      
      if (error) {
        console.error(`Error creating team ${teamName}:`, error);
        throw error;
      }
      
      teamMap.set(teamName, teamId);
      console.log(`Created team: ${teamName} with ID: ${teamId}`);
    }
    
    // Create players
    for (const player of playerData) {
      const teamId = teamMap.get(player.teamName);
      
      if (!teamId) {
        console.error(`Could not find team ID for ${player.teamName}`);
        continue;
      }
      
      // Create player
      const playerId = uuidv4();
      console.log(`Creating player ${player.name}...`);
      const { data, error } = await supabase
        .from('Player')
        .insert([
          {
            id: playerId,
            name: player.name,
            handicapIndex: player.handicap,
            teamId: teamId,
            playerType: 'PRIMARY',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ])
        .select()
      
      if (error) {
        console.error(`Error creating player ${player.name}:`, error);
        throw error;
      }
      
      console.log(`Created player: ${player.name} with handicap ${player.handicap} for team ${player.teamName} (ID: ${playerId})`);
    }
    
    // Create matches
    for (const [weekNumber, startingHole, homeTeamName, awayTeamName, date] of scheduleData) {
      const homeTeamId = teamMap.get(homeTeamName);
      const awayTeamId = teamMap.get(awayTeamName);
      
      if (!homeTeamId || !awayTeamId) {
        console.error(`Could not find team IDs for ${homeTeamName} vs ${awayTeamName}`);
        continue;
      }
      
      // Create match
      const matchId = uuidv4();
      console.log(`Creating match: Week ${weekNumber}, ${homeTeamName} vs ${awayTeamName}, Starting Hole: ${startingHole}...`);
      const { data, error } = await supabase
        .from('Match')
        .insert([
          {
            id: matchId,
            date: new Date(date),
            weekNumber: Number(weekNumber),
            homeTeamId,
            awayTeamId,
            startingHole: Number(startingHole),
            status: 'SCHEDULED',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ])
        .select()
      
      if (error) {
        console.error(`Error creating match: Week ${weekNumber}, ${homeTeamName} vs ${awayTeamName}:`, error);
        throw error;
      }
      
      console.log(`Created match: Week ${weekNumber}, ${homeTeamName} vs ${awayTeamName}, Starting Hole: ${startingHole}`);

      // Get players for both teams
      const { data: homePlayers, error: homePlayersError } = await supabase
        .from('Player')
        .select('id')
        .eq('teamId', homeTeamId)

      if (homePlayersError) {
        console.error(`Error fetching home team players:`, homePlayersError);
        throw homePlayersError;
      }

      const { data: awayPlayers, error: awayPlayersError } = await supabase
        .from('Player')
        .select('id')
        .eq('teamId', awayTeamId)

      if (awayPlayersError) {
        console.error(`Error fetching away team players:`, awayPlayersError);
        throw awayPlayersError;
      }

      // Create MatchPlayer records for home team
      for (const player of homePlayers) {
        const { error: matchPlayerError } = await supabase
          .from('MatchPlayer')
          .insert([
            {
              id: uuidv4(),
              matchId,
              playerId: player.id,
              isSubstitute: false,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          ])

        if (matchPlayerError) {
          console.error(`Error creating match player record:`, matchPlayerError);
          throw matchPlayerError;
        }
      }

      // Create MatchPlayer records for away team
      for (const player of awayPlayers) {
        const { error: matchPlayerError } = await supabase
          .from('MatchPlayer')
          .insert([
            {
              id: uuidv4(),
              matchId,
              playerId: player.id,
              isSubstitute: false,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          ])

        if (matchPlayerError) {
          console.error(`Error creating match player record:`, matchPlayerError);
          throw matchPlayerError;
        }
      }
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in force setup:', error)
    return NextResponse.json(
      { error: 'Failed to force setup', details: error },
      { status: 500 }
    )
  }
}