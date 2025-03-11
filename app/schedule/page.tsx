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
      <div className="min-h-screen bg-[#030f0f] flex items-center justify-center p-4">
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a] p-8 max-w-lg w-full shadow-lg border border-white/10">
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-xl transform translate-x-1/4 -translate-y-1/4"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-red-500/5 rounded-full blur-xl transform -translate-x-1/4 translate-y-1/4"></div>
          
          <div className="relative">
            <h2 className="text-2xl font-bold text-white mb-4">Database Connection Error</h2>
            <p className="text-white/70 mb-6">
              Unable to connect to the database. The application is running in development mode with mock data.
            </p>
            <div className="bg-black/30 p-4 rounded-lg text-sm font-mono text-white/60 overflow-auto mb-6">
              {error instanceof Error ? error.message : 'Unknown error occurred'}
            </div>
            
            <div className="flex justify-end">
              <a href="/" className="px-4 py-2 bg-[#4CAF50] text-white rounded-lg hover:bg-[#3d9c40] transition-colors">
                Return to Home
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }
} 