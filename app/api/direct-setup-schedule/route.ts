import { NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'

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

export async function POST(request: Request) {
  try {
    console.log('Starting direct schedule setup...')
    
    // Create a map to store team references
    const teams = new Map<string, any>()
    
    // Delete any existing matches first
    const { data: existingMatches, error: matchesError } = await supabase
      .from('Match')
      .select('id')
    if (matchesError) {
      throw matchesError
    }
    
    if (existingMatches) {
      for (const match of existingMatches) {
        const { error: deleteError } = await supabase
          .from('Match')
          .delete()
          .eq('id', match.id)
        if (deleteError) {
          throw deleteError
        }
      }
    }
    console.log('Cleared existing matches')

    // Get all existing teams
    const { data: existingTeams, error: existingTeamsError } = await supabase
      .from('Team')
      .select('id, name')
    if (existingTeamsError) {
      throw existingTeamsError
    }
    console.log(`Found ${existingTeams?.length || 0} existing teams`)

    // Delete all existing teams
    if (existingTeams) {
      for (const team of existingTeams) {
        const { error: deleteTeamError } = await supabase
          .from('Team')
          .delete()
          .eq('id', team.id)
        if (deleteTeamError) {
          throw deleteTeamError
        }
        console.log(`Deleted team: ${team.name}`)
      }
    }
    
    // Create teams
    const teamNames = Array.from(new Set(scheduleData.map(entry => [entry[2], entry[3]]).flat()))
    for (const teamName of teamNames) {
      try {
        const { data: newTeam, error: teamError } = await supabase
          .from('Team')
          .insert({
            id: crypto.randomUUID(),
            name: teamName,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          })
          .select()
          .single()
        
        if (teamError || !newTeam) {
          throw teamError || new Error('Failed to create team')
        }
        
        console.log(`Created team: ${teamName} with ID: ${newTeam.id}`)
        teams.set(teamName, newTeam)
      } catch (error) {
        console.error(`Error creating team ${teamName}:`, error)
        throw error
      }
    }
    
    // Create all matches
    const matchesToCreate = scheduleData.map((entry) => {
      const weekNumber = entry[0] as number
      const startingHole = entry[1] as number
      const homeTeamName = entry[2] as string
      const awayTeamName = entry[3] as string
      const dateStr = entry[4] as string

      const homeTeam = teams.get(homeTeamName)
      const awayTeam = teams.get(awayTeamName)
      
      if (!homeTeam || !awayTeam) {
        throw new Error(`Missing team reference for match: ${homeTeamName} vs ${awayTeamName}`)
      }

      return {
        id: crypto.randomUUID(),
        date: new Date(dateStr).toISOString(),
        weekNumber,
        homeTeamId: homeTeam.id,
        awayTeamId: awayTeam.id,
        startingHole,
        status: 'SCHEDULED',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    })

    const { data: createdMatches, error } = await supabase
      .from('Match')
      .insert(matchesToCreate)
      .select()

    if (error) {
      throw error
    }

    console.log(`Successfully created ${matchesToCreate.length} matches`)
    return NextResponse.json(createdMatches)
  } catch (error) {
    console.error('Error setting up schedule:', error)
    return NextResponse.json(
      { error: 'Failed to set up schedule' },
      { status: 500 }
    )
  }
}
