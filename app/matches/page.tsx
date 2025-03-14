import { Suspense } from 'react'
import MatchesPage from './MatchesPage'
import LoadingSpinner from '../components/LoadingSpinner'
import { prisma } from '../lib/prisma'

export default async function MatchesPageServer() {
  // Fetch matches and teams from the database
  let matches = []
  let teams = []
  
  try {
    matches = await prisma.match.findMany({
      include: {
        homeTeam: true,
        awayTeam: true,
      },
      orderBy: [
        { weekNumber: 'asc' },
        { startingHole: 'asc' }
      ]
    })
    
    teams = await prisma.team.findMany({
      orderBy: {
        name: 'asc'
      }
    })
  } catch (error) {
    console.error('Error fetching data:', error)
    // Continue with empty arrays - the client component will handle fallbacks
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <MatchesPage initialMatches={matches} initialTeams={teams} />
    </Suspense>
  )
} 