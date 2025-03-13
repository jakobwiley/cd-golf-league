// Script to add players to teams with their handicaps
const fetch = require('node-fetch');

// Player data with names and handicaps
const playerData = [
  { name: 'AP', handicap: 7.3, teamName: 'AP/JohnP' },
  { name: 'JohnP', handicap: 21.4, teamName: 'AP/JohnP' },
  
  { name: 'Brett', handicap: 10.3, teamName: 'Brett/Tony' },
  { name: 'Tony', handicap: 14.1, teamName: 'Brett/Tony' },
  
  { name: 'Drew', handicap: 10.6, teamName: 'Ryan/Drew' },
  { name: 'Ryan', handicap: 13.9, teamName: 'Ryan/Drew' },
  
  { name: 'Nick', handicap: 11.3, teamName: 'Nick/Brent' },
  { name: 'Brent', handicap: null, teamName: 'Nick/Brent' }, // Handicap not provided
  
  { name: 'Huerter', handicap: 11.8, teamName: 'Hot/Huerter' },
  { name: 'Hot', handicap: 17.2, teamName: 'Hot/Huerter' },
  
  { name: 'Sketch', handicap: 11.9, teamName: 'Sketch/Rob' },
  { name: 'Rob', handicap: 18.1, teamName: 'Sketch/Rob' },
  
  { name: 'Clauss', handicap: 12.5, teamName: 'Clauss/Wade' },
  { name: 'Wade', handicap: null, teamName: 'Clauss/Wade' }, // Handicap not provided
  
  { name: 'Murph', handicap: 12.6, teamName: 'Trev/Murph' },
  { name: 'Trev', handicap: 16, teamName: 'Trev/Murph' },
  
  { name: 'Brew', handicap: 13.4, teamName: 'Brew/Jake' },
  { name: 'Jake', handicap: 16.7, teamName: 'Brew/Jake' },
  
  { name: 'Ashley', handicap: 40.6, teamName: 'Ashley/Alli' },
  { name: 'Alli', handicap: null, teamName: 'Ashley/Alli' } // Handicap not provided
];

// Function to get teams
async function getTeams() {
  try {
    const response = await fetch('http://localhost:3000/api/teams');
    if (!response.ok) {
      throw new Error(`Failed to fetch teams: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching teams:', error.message);
    return [];
  }
}

// Function to add a player to a team
async function addPlayer(player, teamId) {
  try {
    const playerPayload = {
      name: player.name,
      handicap: player.handicap,
      teamId: teamId
    };

    console.log(`Adding player ${player.name} to team ${teamId}...`);
    
    const response = await fetch('http://localhost:3000/api/players', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(playerPayload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to add player: ${errorData.error || response.statusText}`);
    }

    const result = await response.json();
    console.log(`Successfully added player ${player.name} with handicap ${player.handicap || 'N/A'}`);
    return result;
  } catch (error) {
    console.error(`Error adding player ${player.name}:`, error.message);
    return null;
  }
}

// Main function to add all players
async function addAllPlayers() {
  try {
    // Get all teams
    const teams = await getTeams();
    if (!teams || teams.length === 0) {
      throw new Error('No teams found. Make sure the server is running and teams are created.');
    }

    console.log(`Found ${teams.length} teams`);

    // Create a map of team names to team IDs
    const teamMap = new Map();
    teams.forEach(team => {
      teamMap.set(team.name, team.id);
    });

    // Add each player to their respective team
    const addedPlayers = [];
    for (const player of playerData) {
      const teamId = teamMap.get(player.teamName);
      if (!teamId) {
        console.error(`Team "${player.teamName}" not found for player ${player.name}`);
        continue;
      }

      const addedPlayer = await addPlayer(player, teamId);
      if (addedPlayer) {
        addedPlayers.push(addedPlayer);
      }
    }

    console.log(`Successfully added ${addedPlayers.length} players`);
  } catch (error) {
    console.error('Error in addAllPlayers:', error.message);
  }
}

// Run the script
addAllPlayers().then(() => {
  console.log('Player addition process completed');
}); 