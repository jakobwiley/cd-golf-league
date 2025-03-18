import { NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'
import { v4 as uuidv4 } from 'uuid'

// Teams to add
const teams = [
  'Nick/Brent',
  'Hot/Huerter',
  'Ashley/Alli',
  'Brew/Jake',
  'Sketch/Rob',
  'Trev/Murph',
  'Ryan/Drew',
  'AP/JohnP',
  'Clauss/Wade',
  'Brett/Tony'
]

export async function GET() {
  try {
    // Log the start of the process
    console.log('Starting direct team setup...')
    
    // Get existing teams
    console.log('Fetching existing teams...')
    const { data: existingTeams, error: fetchError } = await supabase
      .from('Team')
      .select('id, name')

    if (fetchError) {
      console.error('Error fetching teams:', fetchError)
      return NextResponse.json({ error: 'Failed to fetch teams' }, { status: 500 })
    }

    console.log('Found', existingTeams?.length, 'existing teams')
    
    // Delete existing teams
    for (const team of existingTeams || []) {
      // First delete all matches referencing this team
      const { error: matchDeleteError } = await supabase
        .from('Match')
        .delete()
        .or(`homeTeamId.eq.${team.id},awayTeamId.eq.${team.id}`)

      if (matchDeleteError) {
        console.error(`Error deleting matches for team ${team.name}:`, matchDeleteError)
      }

      // Then delete the team
      const { error: teamDeleteError } = await supabase
        .from('Team')
        .delete()
        .eq('id', team.id)

      if (teamDeleteError) {
        console.error(`Error deleting team ${team.name}:`, teamDeleteError)
      } else {
        console.log(`Deleted team: ${team.name} (${team.id})`)
      }
    }
    
    // Create new teams
    const createdTeams: { id: string; name: string }[] = []
    for (const teamName of teams) {
      const teamId = uuidv4()
      const { data: newTeam, error: createError } = await supabase
        .from('Team')
        .insert([{
          id: teamId,
          name: teamName,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }])
        .select()
        .single()

      if (createError) {
        console.error(`Error creating team ${teamName}:`, createError)
      } else if (newTeam) {
        createdTeams.push({ id: newTeam.id, name: newTeam.name })
        console.log(`Created team: ${teamName}`)
      }
    }
    
    // Return the results
    return NextResponse.json({
      message: 'Direct team setup completed',
      createdTeams
    })
  } catch (error) {
    console.error('Error in direct team setup:', error)
    return NextResponse.json({ error: 'Failed to set up teams' }, { status: 500 })
  }
}