import React from 'react';
import { prisma } from '../../lib/prisma'
import Link from 'next/link';

// Helper function to format date
function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

// Group matches by week
function groupMatchesByWeek(matches: any[]) {
  const grouped = {};
  
  matches.forEach(match => {
    const weekNumber = match.weekNumber;
    if (!grouped[weekNumber]) {
      grouped[weekNumber] = [];
    }
    grouped[weekNumber].push(match);
  });
  
  return grouped;
}

export default async function SchedulePage() {
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

    // Group matches by week
    const matchesByWeek = groupMatchesByWeek(matches);
    
    // Get sorted week numbers
    const weekNumbers = Object.keys(matchesByWeek).map(Number).sort((a, b) => a - b);

    return (
      <div className="min-h-screen bg-[#030f0f] relative overflow-hidden">
        {/* Futuristic background elements */}
        <div className="absolute inset-0 z-0">
          {/* Gradient base */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#00df82]/20 to-[#4CAF50]/10" />
          
          {/* Animated grid lines */}
          <div className="absolute inset-0 opacity-10">
            <div className="h-full w-full bg-[url('/grid-pattern.svg')] bg-repeat bg-[length:50px_50px]" />
          </div>
          
          {/* Glowing orbs */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#00df82]/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-[#4CAF50]/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-audiowide text-white">League Schedule</h1>
            <Link 
              href="/api/direct-setup-schedule" 
              className="group relative overflow-hidden px-6 py-3 bg-[#030f0f]/70 text-[#00df82] rounded-lg border border-[#00df82]/30 hover:border-[#00df82]/50 backdrop-blur-sm transition-all duration-300 hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#00df82]/5 to-transparent"></div>
              <div className="absolute -top-10 -right-10 w-20 h-20 bg-[#00df82]/10 rounded-full blur-3xl group-hover:bg-[#00df82]/20 transition-all duration-500"></div>
              <span className="relative font-audiowide">Setup Schedule</span>
            </Link>
          </div>
          
          {weekNumbers.length === 0 ? (
            <div className="relative overflow-hidden rounded-xl backdrop-blur-sm bg-[#030f0f]/70 p-8 max-w-lg w-full border border-[#00df82]/30 text-center py-8">
              <p className="text-white/70 mb-4">No matches scheduled yet.</p>
              <Link 
                href="/api/direct-setup-schedule" 
                className="group relative overflow-hidden px-6 py-3 bg-[#030f0f]/70 text-[#00df82] rounded-lg border border-[#00df82]/30 hover:border-[#00df82]/50 backdrop-blur-sm transition-all duration-300 hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#00df82]/5 to-transparent"></div>
                <div className="absolute -top-10 -right-10 w-20 h-20 bg-[#00df82]/10 rounded-full blur-3xl group-hover:bg-[#00df82]/20 transition-all duration-500"></div>
                <span className="relative font-audiowide">Setup Schedule</span>
              </Link>
            </div>
          ) : (
            weekNumbers.map(weekNumber => (
              <div key={weekNumber} className="mb-8">
                <h2 className="text-3xl font-audiowide text-white mb-4">Week {weekNumber}</h2>
                
                {matchesByWeek[weekNumber].length > 0 && (
                  <div className="relative overflow-hidden rounded-xl backdrop-blur-sm bg-[#030f0f]/70 border border-[#00df82]/30">
                    <div className="absolute inset-0 bg-gradient-to-b from-[#00df82]/5 to-transparent"></div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full">
                        <thead>
                          <tr className="border-b border-[#00df82]/30">
                            <th className="px-6 py-3 text-left text-xs font-medium text-[#00df82] uppercase tracking-wider">
                              Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-[#00df82] uppercase tracking-wider">
                              Starting Hole
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-[#00df82] uppercase tracking-wider">
                              Home Team
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-[#00df82] uppercase tracking-wider">
                              Away Team
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-[#00df82] uppercase tracking-wider">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {matchesByWeek[weekNumber].map((match, idx) => (
                            <tr key={match.id} className={idx !== matchesByWeek[weekNumber].length - 1 ? "border-b border-[#00df82]/10" : ""}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-white/70">
                                {formatDate(match.date)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-white/70">
                                {match.startingHole}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-white">
                                  {match.homeTeam?.name || 'Unknown Team'}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-white">
                                  {match.awayTeam?.name || 'Unknown Team'}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  match.status === 'COMPLETED' 
                                    ? 'bg-[#00df82]/20 text-[#00df82]' 
                                    : match.status === 'IN_PROGRESS'
                                    ? 'bg-yellow-500/20 text-yellow-400'
                                    : 'bg-white/10 text-white/70'
                                }`}>
                                  {match.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    )
  } catch (error) {
    console.error('Database error:', error)
    return (
      <div className="min-h-screen bg-[#030f0f] flex items-center justify-center p-4 relative overflow-hidden">
        {/* Futuristic background elements */}
        <div className="absolute inset-0 z-0">
          {/* Gradient base */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#00df82]/20 to-[#4CAF50]/10" />
          
          {/* Animated grid lines */}
          <div className="absolute inset-0 opacity-10">
            <div className="h-full w-full bg-[url('/grid-pattern.svg')] bg-repeat bg-[length:50px_50px]" />
          </div>
          
          {/* Glowing orbs */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#00df82]/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-[#4CAF50]/10 rounded-full blur-3xl" />
        </div>

        <div className="relative overflow-hidden rounded-xl backdrop-blur-sm bg-[#030f0f]/70 p-8 max-w-lg w-full border border-[#00df82]/30 z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-[#00df82]/5 to-transparent"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-xl transform translate-x-1/4 -translate-y-1/4"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-red-500/5 rounded-full blur-xl transform -translate-x-1/4 translate-y-1/4"></div>
          
          <div className="relative">
            <h2 className="text-2xl font-audiowide text-white mb-4">Database Connection Error</h2>
            <p className="text-white/70 mb-6">
              Unable to connect to the database. The application is running in development mode with mock data.
            </p>
            <div className="bg-black/30 backdrop-blur-sm p-4 rounded-lg text-sm font-mono text-white/60 overflow-auto mb-6 border border-white/10">
              {error instanceof Error ? error.message : 'Unknown error occurred'}
            </div>
            
            <div className="flex justify-end">
              <a href="/" className="group relative overflow-hidden px-6 py-3 bg-[#030f0f]/70 text-[#00df82] rounded-lg border border-[#00df82]/30 hover:border-[#00df82]/50 backdrop-blur-sm transition-all duration-300 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-[#00df82]/5 to-transparent"></div>
                <div className="absolute -top-10 -right-10 w-20 h-20 bg-[#00df82]/10 rounded-full blur-3xl group-hover:bg-[#00df82]/20 transition-all duration-500"></div>
                <span className="relative font-audiowide">Return to Home</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }
} 