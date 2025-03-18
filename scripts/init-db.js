import { supabase } from '../lib/supabase'
import { v4 as uuidv4 } from 'uuid'

async function main() {
  try {
    console.log('Clearing existing data...')
    
    // Clear existing data
    await supabase.from('MatchScore').delete().neq('id', '')
    await supabase.from('MatchPoints').delete().neq('id', '')
    await supabase.from('MatchPlayer').delete().neq('id', '')
    await supabase.from('Match').delete().neq('id', '')
    await supabase.from('Player').delete().neq('id', '')
    await supabase.from('Team').delete().neq('id', '')
    
    console.log('Creating teams...')
    
    // Create teams
    const teams = [
      { name: 'Nick/Brent' },
      { name: 'Hot/Huerter' },
      { name: 'Ashley/Alli' },
      { name: 'Brew/Jake' },
      { name: 'Sketch/Rob' },
      { name: 'Trev/Murph' },
      { name: 'Ryan/Drew' },
      { name: 'AP/JohnP' },
      { name: 'Clauss/Wade' },
      { name: 'Brett/Tony' }
    ]
    
    const createdTeams = {}
    
    for (const team of teams) {
      const { data, error } = await supabase
        .from('Team')
        .insert([{ id: uuidv4(), name: team.name }])
        .select()
        .single()
        
      if (error) {
        console.error('Error creating team:', error)
        throw error
      }
      
      createdTeams[team.name] = data
    }
    
    console.log('Creating players...')
    
    // Create players
    const players = [
      { name: 'AP', handicapIndex: 7.3, teamName: 'AP/JohnP', playerType: 'PRIMARY' },
      { name: 'JohnP', handicapIndex: 21.4, teamName: 'AP/JohnP', playerType: 'PRIMARY' },
      
      { name: 'Brett', handicapIndex: 10.3, teamName: 'Brett/Tony', playerType: 'PRIMARY' },
      { name: 'Tony', handicapIndex: 14.1, teamName: 'Brett/Tony', playerType: 'PRIMARY' },
      
      { name: 'Drew', handicapIndex: 10.6, teamName: 'Ryan/Drew', playerType: 'PRIMARY' },
      { name: 'Ryan', handicapIndex: 13.9, teamName: 'Ryan/Drew', playerType: 'PRIMARY' },
      
      { name: 'Nick', handicapIndex: 11.3, teamName: 'Nick/Brent', playerType: 'PRIMARY' },
      { name: 'Brent', handicapIndex: 12.0, teamName: 'Nick/Brent', playerType: 'PRIMARY' },
      
      { name: 'Huerter', handicapIndex: 11.8, teamName: 'Hot/Huerter', playerType: 'PRIMARY' },
      { name: 'Hot', handicapIndex: 17.2, teamName: 'Hot/Huerter', playerType: 'PRIMARY' },
      
      { name: 'Sketch', handicapIndex: 11.9, teamName: 'Sketch/Rob', playerType: 'PRIMARY' },
      { name: 'Rob', handicapIndex: 18.1, teamName: 'Sketch/Rob', playerType: 'PRIMARY' },
      
      { name: 'Clauss', handicapIndex: 12.5, teamName: 'Clauss/Wade', playerType: 'PRIMARY' },
      { name: 'Wade', handicapIndex: 15.0, teamName: 'Clauss/Wade', playerType: 'PRIMARY' },
      
      { name: 'Murph', handicapIndex: 12.6, teamName: 'Trev/Murph', playerType: 'PRIMARY' },
      { name: 'Trev', handicapIndex: 16.0, teamName: 'Trev/Murph', playerType: 'PRIMARY' },
      
      { name: 'Brew', handicapIndex: 13.4, teamName: 'Brew/Jake', playerType: 'PRIMARY' },
      { name: 'Jake', handicapIndex: 16.7, teamName: 'Brew/Jake', playerType: 'PRIMARY' },
      
      { name: 'Ashley', handicapIndex: 40.6, teamName: 'Ashley/Alli', playerType: 'PRIMARY' },
      { name: 'Alli', handicapIndex: 30.0, teamName: 'Ashley/Alli', playerType: 'PRIMARY' }
    ]
    
    for (const player of players) {
      const team = createdTeams[player.teamName]
      if (!team) {
        throw new Error(`Team not found for player ${player.name}`)
      }
      
      const { error } = await supabase
        .from('Player')
        .insert([{
          id: uuidv4(),
          name: player.name,
          handicapIndex: player.handicapIndex,
          teamId: team.id,
          playerType: player.playerType
        }])
        
      if (error) {
        console.error('Error creating player:', error)
        throw error
      }
    }
    
    console.log('Creating matches...')
    
    // Create matches
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
    ]
    
    for (const [weekNumber, startingHole, homeTeamName, awayTeamName, date] of scheduleData) {
      const homeTeam = createdTeams[homeTeamName]
      const awayTeam = createdTeams[awayTeamName]
      
      if (!homeTeam || !awayTeam) {
        throw new Error(`Teams not found for match: ${homeTeamName} vs ${awayTeamName}`)
      }
      
      const { error } = await supabase
        .from('Match')
        .insert([{
          id: uuidv4(),
          date: date,
          weekNumber: weekNumber,
          homeTeamId: homeTeam.id,
          awayTeamId: awayTeam.id,
          startingHole: startingHole,
          status: 'SCHEDULED'
        }])
        
      if (error) {
        console.error('Error creating match:', error)
        throw error
      }
    }
    
    console.log('Database initialized successfully!')
  } catch (error) {
    console.error('Error initializing database:', error)
    process.exit(1)
  }
}

main()