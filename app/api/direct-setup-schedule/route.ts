import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

// Schedule data based on the raw data provided
// Format: [weekNumber, startingHole, homeTeamName, awayTeamName, date]
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
  [9, 5, 'Trev/Murph', 'Sketch/Rob', '2025-06-10T18:00:00.000Z']
];

// Define the match type
interface Match {
  id: string;
  weekNumber: number;
  startingHole: number;
  date: Date;
  homeTeamId: string;
  awayTeamId: string;
  homeTeam: {
    id: string;
    name: string;
  };
  awayTeam: {
    id: string;
    name: string;
  };
  status: string;
}

export async function GET(request: Request) {
  try {
    console.log('Starting direct schedule setup...');
    
    // First, clear existing matches
    console.log('Clearing existing matches...');
    const deleteResult = await prisma.match.deleteMany({});
    console.log(`Deleted ${deleteResult.count} existing matches`);
    
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
    
    // Create matches
    const createdMatches: Match[] = [];
    
    for (const [weekNumber, startingHole, homeTeamName, awayTeamName, date] of scheduleData) {
      const homeTeamId = teamMap.get(homeTeamName);
      const awayTeamId = teamMap.get(awayTeamName);
      
      if (!homeTeamId || !awayTeamId) {
        console.log(`Could not find team IDs for ${homeTeamName} vs ${awayTeamName}`);
        continue;
      }
      
      try {
        const match = await prisma.match.create({
          data: {
            date: new Date(date),
            weekNumber: Number(weekNumber),
            homeTeamId,
            awayTeamId,
            startingHole: Number(startingHole),
            status: 'SCHEDULED'
          },
          include: {
            homeTeam: true,
            awayTeam: true
          }
        });
        
        console.log(`Created match: Week ${weekNumber}, ${homeTeamName} (${homeTeamId}) vs ${awayTeamName} (${awayTeamId}), Starting Hole: ${startingHole}`);
        createdMatches.push(match as Match);
      } catch (error) {
        console.error(`Error creating match for Week ${weekNumber}, ${homeTeamName} vs ${awayTeamName}:`, error);
      }
    }
    
    // Return HTML response for better user experience
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Schedule Setup Complete</title>
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
            .week-section {
              margin-top: 20px;
              border-top: 1px solid #e5e7eb;
              padding-top: 15px;
            }
            .match-item {
              padding: 10px;
              border-bottom: 1px solid #e5e7eb;
            }
            .match-item:last-child {
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
            <h1>Schedule Setup Complete</h1>
            <p class="success">Successfully created ${createdMatches.length} matches for the Country Drive Golf League!</p>
            
            ${Object.entries(createdMatches.reduce((acc, match) => {
              const week = match.weekNumber;
              if (!acc[week]) acc[week] = [];
              acc[week].push(match);
              return acc;
            }, {} as Record<number, Match[]>)).map(([week, matches]) => `
              <div class="week-section">
                <h2>Week ${week}</h2>
                ${matches.map(match => `
                  <div class="match-item">
                    <strong>Hole ${match.startingHole}:</strong> ${match.homeTeam.name} vs ${match.awayTeam.name} - ${new Date(match.date).toLocaleDateString()}
                  </div>
                `).join('')}
              </div>
            `).join('')}
            
            <a href="/schedule" class="button">View Schedule</a>
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
    console.error('Error in direct schedule setup:', error);
    return NextResponse.json({ error: 'Failed to set up schedule' }, { status: 500 });
  }
} 