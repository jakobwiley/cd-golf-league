import { prisma } from '../../lib/prisma'
import SchedulePageClient from './SchedulePageClient'

export default async function SchedulePage() {
  try {
    const teams = await prisma.team.findMany({
      orderBy: {
        name: 'asc'
      }
    })

    const matches = await prisma.match.findMany({
      orderBy: [
        { date: 'asc' },
        { weekNumber: 'asc' }
      ],
      include: {
        homeTeam: true,
        awayTeam: true
      }
    })

    return <SchedulePageClient teams={teams} matches={matches} />
  } catch (error) {
    console.error('Database error:', error)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-lg w-full">
          <h2 className="text-xl font-semibold text-[#2D452D] mb-4">Database Connection Error</h2>
          <p className="text-gray-600 mb-4">
            Unable to connect to the database. Please ensure your database is properly configured and try again.
          </p>
          <div className="bg-gray-50 p-4 rounded-lg text-sm font-mono overflow-auto">
            {error instanceof Error ? error.message : 'Unknown error occurred'}
          </div>
        </div>
      </div>
    )
  }
} 