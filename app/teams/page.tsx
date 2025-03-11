import { prisma } from '../../lib/prisma'
import TeamsList from '../components/TeamsList'

export default async function TeamsPage() {
  let teams = [];
  
  try {
    teams = await prisma.team.findMany({
      include: {
        players: {
          orderBy: {
            name: 'asc'
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });
  } catch (error) {
    console.error('Error fetching teams:', error);
    // Return empty array if there's an error
  }

  return (
    <div className="min-h-screen bg-[#030f0f]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#92E3A9] to-[#4CAF50] mb-8">
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent"></div>
          <div className="relative px-8 py-6">
            <h1 className="text-4xl font-bold text-white mb-2 font-grifter">Teams</h1>
            <p className="text-white/90 font-grifter">Manage your teams and players</p>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-2xl transform translate-x-1/4 -translate-y-1/4"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-black/20 to-transparent rounded-full blur-xl transform -translate-x-1/4 translate-y-1/4"></div>
        </div>

        <TeamsList teams={teams} />
      </div>
    </div>
  )
} 