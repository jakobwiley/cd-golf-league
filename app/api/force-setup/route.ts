import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

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

// Direct access to the global mock data
const globalForPrisma = global as unknown as { 
  mockTeams: any[],
  mockPlayers: any[],
  mockMatches: any[]
}

export async function GET() {
  try {
    console.log('Starting force setup...');
    
    // Initialize global arrays if they don't exist
    if (!globalForPrisma.mockTeams) globalForPrisma.mockTeams = [];
    if (!globalForPrisma.mockPlayers) globalForPrisma.mockPlayers = [];
    if (!globalForPrisma.mockMatches) globalForPrisma.mockMatches = [];
    
    // Clear existing data
    globalForPrisma.mockTeams.length = 0;
    globalForPrisma.mockPlayers.length = 0;
    globalForPrisma.mockMatches.length = 0;
    
    console.log('Cleared existing data');
    
    // Create teams
    const teamMap = new Map();
    for (let i = 0; i < teams.length; i++) {
      const teamName = teams[i];
      const teamId = `team${i + 1}`;
      
      // Add to mock teams
      globalForPrisma.mockTeams.push({
        id: teamId,
        name: teamName,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      teamMap.set(teamName, teamId);
      console.log(`Created team: ${teamName} with ID: ${teamId}`);
    }
    
    // Create players
    for (const player of playerData) {
      const teamId = teamMap.get(player.teamName);
      
      if (!teamId) {
        console.log(`Could not find team ID for ${player.teamName}`);
        continue;
      }
      
      // Add to mock players
      globalForPrisma.mockPlayers.push({
        id: `player${globalForPrisma.mockPlayers.length + 1}`,
        name: player.name,
        playerType: 'PRIMARY',
        handicapIndex: player.handicap || 0,
        teamId: teamId,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      console.log(`Created player: ${player.name} with handicap ${player.handicap} for team ${player.teamName} (ID: ${teamId})`);
    }
    
    // Create matches
    for (const [weekNumber, startingHole, homeTeamName, awayTeamName, date] of scheduleData) {
      const homeTeamId = teamMap.get(homeTeamName);
      const awayTeamId = teamMap.get(awayTeamName);
      
      if (!homeTeamId || !awayTeamId) {
        console.log(`Could not find team IDs for ${homeTeamName} vs ${awayTeamName}`);
        continue;
      }
      
      // Add to mock matches
      globalForPrisma.mockMatches.push({
        id: `match${globalForPrisma.mockMatches.length + 1}`,
        date: new Date(date),
        weekNumber: Number(weekNumber),
        homeTeamId,
        awayTeamId,
        startingHole: Number(startingHole),
        status: 'SCHEDULED',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      console.log(`Created match: Week ${weekNumber}, ${homeTeamName} vs ${awayTeamName}, Starting Hole: ${startingHole}`);
    }
    
    // Return HTML response
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Force Setup Complete</title>
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
            .section {
              margin-top: 20px;
              border-top: 1px solid #e5e7eb;
              padding-top: 15px;
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
            <h1>Force Setup Complete</h1>
            <p class="success">Successfully initialized all data for the Country Drive Golf League!</p>
            
            <div class="section">
              <h2>Teams Created: ${globalForPrisma.mockTeams.length}</h2>
              <p>All teams have been created successfully.</p>
            </div>
            
            <div class="section">
              <h2>Players Created: ${globalForPrisma.mockPlayers.length}</h2>
              <p>All players have been added to their respective teams.</p>
            </div>
            
            <div class="section">
              <h2>Matches Created: ${globalForPrisma.mockMatches.length}</h2>
              <p>All matches have been scheduled for the season.</p>
            </div>
            
            <div>
              <a href="/teams" class="button">View Teams</a>
              <a href="/matches" class="button">View Matches</a>
              <a href="/admin" class="button" style="background-color: #6b7280;">Back to Admin</a>
            </div>
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
    console.error('Error in force setup:', error);
    return NextResponse.json(
      { 
        error: 'Failed to force setup',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 