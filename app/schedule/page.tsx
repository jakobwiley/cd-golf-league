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
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">League Schedule</h1>
          <Link href="/api/direct-setup-schedule" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Setup Schedule
          </Link>
        </div>
        
        {weekNumbers.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No matches scheduled yet.</p>
            <Link href="/api/direct-setup-schedule" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Setup Schedule
            </Link>
          </div>
        ) : (
          weekNumbers.map(weekNumber => (
            <div key={weekNumber} className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Week {weekNumber}</h2>
              
              {matchesByWeek[weekNumber].length > 0 && (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Starting Hole
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Home Team
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Away Team
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {matchesByWeek[weekNumber].map((match) => (
                          <tr key={match.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(match.date)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {match.startingHole}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {match.homeTeam?.name || 'Unknown Team'}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {match.awayTeam?.name || 'Unknown Team'}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                match.status === 'COMPLETED' 
                                  ? 'bg-green-100 text-green-800' 
                                  : match.status === 'IN_PROGRESS'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-gray-100 text-gray-800'
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