import { prisma } from '../../lib/prisma'
import SchedulePage from './ScheduleClient'

export default async function SchedulePageServer() {
  try {
    const teams = await prisma.team.findMany({
      orderBy: {
        name: 'asc'
      }
    })

    const matches = await prisma.match.findMany({
      include: {
        homeTeam: true,
        awayTeam: true
      },
      orderBy: [
        { weekNumber: 'asc' },
        { startingHole: 'asc' }
      ]
    })

    return <SchedulePage initialMatches={matches} initialTeams={teams} />
  } catch (error) {
    console.error('Database error:', error)
    return <SchedulePage initialMatches={[]} initialTeams={[]} />
  }
} 