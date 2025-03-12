import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

// Player data with names and handicaps
const playerData = [
  { name: 'AP', handicap: 7.3, teamName: 'AP/JohnP' },
  { name: 'JohnP', handicap: 21.4, teamName: 'AP/JohnP' },
  
  { name: 'Brett', handicap: 10.3, teamName: 'Brett/Tony' },
  { name: 'Tony', handicap: 14.1, teamName: 'Brett/Tony' },
  
  { name: 'Drew', handicap: 10.6, teamName: 'Ryan/Drew' },
  { name: 'Ryan', handicap: 13.9, teamName: 'Ryan/Drew' },
  
  { name: 'Nick', handicap: 11.3, teamName: 'Nick/Brent' },
  { name: 'Brent', handicap: 12.0, teamName: 'Nick/Brent' }, // Added default handicap
  
  { name: 'Huerter', handicap: 11.8, teamName: 'Hot/Huerter' },
  { name: 'Hot', handicap: 17.2, teamName: 'Hot/Huerter' },
  
  { name: 'Sketch', handicap: 11.9, teamName: 'Sketch/Rob' },
  { name: 'Rob', handicap: 18.1, teamName: 'Sketch/Rob' },
  
  { name: 'Clauss', handicap: 12.5, teamName: 'Clauss/Wade' },
  { name: 'Wade', handicap: 15.0, teamName: 'Clauss/Wade' }, // Added default handicap
  
  { name: 'Murph', handicap: 12.6, teamName: 'Trev/Murph' },
  { name: 'Trev', handicap: 16, teamName: 'Trev/Murph' },
  
  { name: 'Brew', handicap: 13.4, teamName: 'Brew/Jake' },
  { name: 'Jake', handicap: 16.7, teamName: 'Brew/Jake' },
  
  { name: 'Ashley', handicap: 40.6, teamName: 'Ashley/Alli' },
  { name: 'Alli', handicap: 30.0, teamName: 'Ashley/Alli' } // Added default handicap
];

export async function GET() {
  try {
    console.log('Starting direct player addition...');
    
    // First, clear existing players
    console.log('Clearing existing players...');
    const deleteResult = await prisma.player.deleteMany({});
    console.log(`Deleted ${deleteResult.count} existing players`);
    
    // Get all teams
    console.log('Fetching existing teams...');
    const teams = await prisma.team.findMany();
    console.log(`Found ${teams.length} existing teams:`, teams.map(t => t.name).join(', '));
    
    // Create a map of team names to IDs
    const teamMap = new Map();
    teams.forEach(team => {
      teamMap.set(team.name, team.id);
      console.log(`Mapped team: ${team.name} -> ${team.id}`);
    });
    
    // Create players
    const createdPlayers = [];
    
    for (const player of playerData) {
      const teamId = teamMap.get(player.teamName);
      
      if (!teamId) {
        console.log(`Could not find team ID for ${player.teamName}`);
        continue;
      }
      
      try {
        // Use handicapIndex field instead of handicap
        const newPlayer = await prisma.player.create({
          data: {
            name: player.name,
            handicapIndex: player.handicap || 0, // Use 0 as default if handicap is null
            teamId: teamId
          },
          include: {
            team: true
          }
        });
        
        console.log(`Created player: ${player.name} with handicap ${player.handicap || 'N/A'} for team ${player.teamName} (ID: ${teamId})`);
        createdPlayers.push(newPlayer);
      } catch (error) {
        console.error(`Error creating player ${player.name}:`, error);
      }
    }
    
    // Return HTML response for better user experience
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Players Setup Complete</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
            h1 {
              color: #2563eb;
            }
            .card {
              background: #f9fafb;
              border-radius: 8px;
              padding: 20px;
              margin-bottom: 20px;
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }
            .success {
              color: #059669;
              font-weight: bold;
            }
            .player-list {
              margin-top: 20px;
            }
            .player-item {
              padding: 10px;
              border-bottom: 1px solid #e5e7eb;
            }
            .player-item:last-child {
              border-bottom: none;
            }
            .button {
              display: inline-block;
              background-color: #2563eb;
              color: white;
              padding: 10px 20px;
              border-radius: 4px;
              text-decoration: none;
              margin-top: 20px;
            }
            .button:hover {
              background-color: #1d4ed8;
            }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>Players Setup Complete</h1>
            <p class="success">Successfully added ${createdPlayers.length} players to the database.</p>
            
            <div class="player-list">
              <h2>Added Players:</h2>
              ${createdPlayers.map(player => `
                <div class="player-item">
                  <strong>${player.name}</strong> - Handicap: ${player.handicapIndex || 'N/A'} - Team: ${player.team?.name || 'Unknown'}
                </div>
              `).join('')}
            </div>
            
            <a href="/admin/players" class="button">View All Players</a>
          </div>
        </body>
      </html>
    `;
    
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error('Error in direct player addition:', error);
    return NextResponse.json({ error: 'Failed to add players' }, { status: 500 });
  }
} 