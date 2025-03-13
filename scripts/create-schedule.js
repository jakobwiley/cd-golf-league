// Script to create schedule entries for the Country Drive Golf League
const fetch = require('node-fetch');

// Team IDs from the mock data
const teams = [
  { id: 'team1', name: 'Nick/Brent' },
  { id: 'team2', name: 'Hot/Huerter' },
  { id: 'team3', name: 'Ashley/Alli' },
  { id: 'team4', name: 'Brew/Jake' },
  { id: 'team5', name: 'Sketch/Rob' },
  { id: 'team6', name: 'Trev/Murph' },
  { id: 'team7', name: 'Ryan/Drew' },
  { id: 'team8', name: 'AP/JohnP' },
  { id: 'team9', name: 'Clauss/Wade' },
  { id: 'team10', name: 'Brett/Tony' }
];

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
  [7, 3, 'Sketch/Rob', 'Nick/Brent', '2025-05-27T18:00:00.000Z'],
  [7, 4, 'AP/JohnP', 'Hot/Huerter', '2025-05-27T18:00:00.000Z'],
  [7, 5, 'Clauss/Wade', 'Brett/Tony', '2025-05-27T18:00:00.000Z'],
  
  // Week 8 - June 3, 2025
  [8, 1, 'Sketch/Rob', 'Trev/Murph', '2025-06-03T18:00:00.000Z'],
  [8, 2, 'Ashley/Alli', 'AP/JohnP', '2025-06-03T18:00:00.000Z'],
  [8, 3, 'Hot/Huerter', 'Clauss/Wade', '2025-06-03T18:00:00.000Z'],
  [8, 4, 'Nick/Brent', 'Brett/Tony', '2025-06-03T18:00:00.000Z'],
  [8, 5, 'Brew/Jake', 'Ryan/Drew', '2025-06-03T18:00:00.000Z'],
  
  // Week 9 - June 10, 2025
  [9, 1, 'Clauss/Wade', 'Ashley/Alli', '2025-06-10T18:00:00.000Z'],
  [9, 2, 'Brett/Tony', 'Hot/Huerter', '2025-06-10T18:00:00.000Z'],
  [9, 3, 'Trev/Murph', 'Nick/Brent', '2025-06-10T18:00:00.000Z'],
  [9, 4, 'Ryan/Drew', 'Sketch/Rob', '2025-06-10T18:00:00.000Z'],
  [9, 5, 'AP/JohnP', 'Brew/Jake', '2025-06-10T18:00:00.000Z'],
  
  // Week 10 - June 17, 2025
  // No matches scheduled for Week 10 according to the data
  
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

// Function to find team ID by name
function findTeamIdByName(name) {
  const team = teams.find(t => t.name === name);
  return team ? team.id : null;
}

// Function to create a match
async function createMatch(weekNumber, startingHole, homeTeamName, awayTeamName, date) {
  const homeTeamId = findTeamIdByName(homeTeamName);
  const awayTeamId = findTeamIdByName(awayTeamName);
  
  if (!homeTeamId || !awayTeamId) {
    console.error(`Could not find team IDs for ${homeTeamName} vs ${awayTeamName}`);
    return;
  }
  
  const matchData = {
    date,
    weekNumber,
    homeTeamId,
    awayTeamId,
    startingHole,
    status: 'SCHEDULED'
  };
  
  try {
    const response = await fetch('http://localhost:3000/api/schedule', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(matchData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to create match: ${errorData.error}`);
    }
    
    const match = await response.json();
    console.log(`Created match: Week ${weekNumber}, ${homeTeamName} vs ${awayTeamName}, Starting Hole: ${startingHole}`);
    return match;
  } catch (error) {
    console.error(`Error creating match: ${error.message}`);
  }
}

// Function to clear all existing matches
async function clearSchedule() {
  try {
    const response = await fetch('http://localhost:3000/api/schedule/clear', {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to clear schedule: ${errorData.error}`);
    }
    
    const result = await response.json();
    console.log(`Cleared schedule: ${result.count} matches deleted`);
  } catch (error) {
    console.error(`Error clearing schedule: ${error.message}`);
  }
}

// Main function to create the schedule
async function createSchedule() {
  // Clear existing schedule
  await clearSchedule();
  
  // Create matches
  for (const [weekNumber, startingHole, homeTeamName, awayTeamName, date] of scheduleData) {
    await createMatch(weekNumber, startingHole, homeTeamName, awayTeamName, date);
  }
  
  console.log('Schedule creation completed!');
}

// Run the script
createSchedule().catch(error => {
  console.error('Error creating schedule:', error);
}); 