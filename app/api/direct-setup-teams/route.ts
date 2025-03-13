import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

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
    const existingTeams = await prisma.team.findMany()
    console.log(`Found ${existingTeams.length} existing teams`)
    
    // Delete existing teams
    const deletedTeams = []
    for (const team of existingTeams) {
      console.log(`Deleting team: ${team.name} (${team.id})`)
      
      try {
        // Delete all players in the team
        await prisma.player.deleteMany({
          where: { teamId: team.id }
        })
        
        // Delete the team
        const deletedTeam = await prisma.team.delete({
          where: { id: team.id }
        })
        
        deletedTeams.push(deletedTeam)
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
        // Create the team directly using the Prisma client
        const newTeam = await prisma.team.create({
          data: { name: teamName }
        })
        
        createdTeams.push(newTeam)
        console.log(`Successfully created team: ${teamName} with ID: ${newTeam.id}`)
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
    return NextResponse.json(
      { 
        error: 'Failed to set up teams directly',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
} 