import { NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'

// Teams to add
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
      throw fetchError
    }
    console.log(`Found ${existingTeams.length} existing teams`)
    
    // Delete existing teams
    const deletedTeams = []
    for (const team of existingTeams) {
      console.log(`Deleting team: ${team.name} (${team.id})`)
      
      try {
        // Delete the team
        const { error: deleteError } = await supabase
          .from('Team')
          .delete()
          .eq('id', team.id)
        if (deleteError) {
          throw deleteError
        }
        
        deletedTeams.push(team)
        console.log(`Successfully deleted team: ${team.name}`)
      } catch (error) {
        console.error(`Error deleting team ${team.id}:`, error)
      }
    }
    
    // Create new teams
    const createdTeams = []
    for (const teamName of teams) {
      console.log(`Creating team: ${teamName}`)
      
      try {
        // Create the team directly using the Supabase client
        const { data: newTeam, error: createError } = await supabase
          .from('Team')
          .insert([{
            name: teamName,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }])
        if (createError) {
          throw createError
        }
        
        createdTeams.push(newTeam[0])
        console.log(`Successfully created team: ${teamName} with ID: ${newTeam[0].id}`)
      } catch (error) {
        console.error(`Error creating team ${teamName}:`, error)
      }
    }
    
    // Return the results
    return NextResponse.json({
      message: 'Direct team setup completed',
      deletedTeams,
      createdTeams
    })
  } catch (error) {
    console.error('Error in direct team setup:', error)
    return NextResponse.json({ error: 'Failed to set up teams' }, { status: 500 })
  }
}