import { prisma } from '../../../lib/prisma'
import Link from 'next/link'
import { notFound } from 'next/navigation'

// Helper function to create a URL-friendly slug
function createMatchSlug(homeTeam: string, awayTeam: string) {
  return `${homeTeam.toLowerCase().replace(/\s+/g, '-')}-vs-${awayTeam.toLowerCase().replace(/\s+/g, '-')}`;
}

// Helper function to format date
function formatDate(dateString: string | Date) {
  const date = dateString instanceof Date ? dateString : new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}

export default async function WeekMatchesPage({ params }: { params: { week: string } }) {
  const weekNumber = parseInt(params.week);
  
  if (isNaN(weekNumber)) {
    notFound();
  }
  
  try {
    // Fetch matches for this week
    const matches = await prisma.match.findMany({
      where: {
        weekNumber: weekNumber
      },
      include: {
        homeTeam: true,
        awayTeam: true
      },
      orderBy: {
        startingHole: 'asc'
      }
    });
    
    if (matches.length === 0) {
      notFound();
    }
    
    // Get the date from the first match (all matches in a week should have the same date)
    const weekDate = matches[0]?.date ? formatDate(matches[0].date) : 'Date not available';
    
    return (
      <div className="min-h-screen bg-[#030f0f] p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <Link href="/matches" className="text-[#00df82] hover:text-[#00df82]/80 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Back to All Matches
            </Link>
          </div>
          
          <div className="bg-gradient-to-r from-[#00df82]/20 to-transparent p-4 rounded-t-xl backdrop-blur-sm border border-[#00df82]/20">
            <h1 className="text-3xl font-audiowide text-white">Week {weekNumber} Matches</h1>
            <p className="text-[#00df82]/80 mt-2 font-orbitron">{weekDate}</p>
          </div>
          
          <div className="bg-[#030f0f]/90 rounded-b-xl backdrop-blur-sm border-x border-b border-[#00df82]/20 p-4">
            <div className="grid grid-cols-1 gap-4">
              {matches.map((match) => {
                const matchSlug = createMatchSlug(match.homeTeam.name, match.awayTeam.name);
                
                return (
                  <Link 
                    key={match.id} 
                    href={`/matches/${weekNumber}/${matchSlug}`}
                    className="block relative overflow-hidden rounded-xl backdrop-blur-sm bg-[#030f0f]/70 border border-[#00df82]/30 p-4 transition-all duration-300 hover:bg-[#030f0f]/90 hover:border-[#00df82]/50 hover:scale-[1.01]"
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-[#00df82]/5 to-transparent"></div>
                    <div className="relative flex flex-col sm:flex-row items-center">
                      {/* Starting Hole */}
                      <div className="flex items-center justify-center mb-3 sm:mb-0 sm:mr-6">
                        <span className="inline-flex items-center justify-center bg-[#00df82]/10 text-[#00df82] rounded-full h-12 w-12 font-orbitron text-lg">
                          {match.startingHole}
                        </span>
                      </div>
                      
                      {/* Teams */}
                      <div className="flex flex-1 flex-col sm:flex-row sm:items-center w-full sm:w-auto">
                        {/* Home Team */}
                        <div className="mb-2 sm:mb-0 text-center sm:text-right sm:flex-1">
                          <div className="text-white font-orbitron text-lg">
                            {match.homeTeam?.name || 'Unknown Team'}
                          </div>
                        </div>
                        
                        {/* VS Divider */}
                        <div className="text-[#00df82] mx-4 mb-2 sm:mb-0 text-center font-bold">vs</div>
                        
                        {/* Away Team */}
                        <div className="text-center sm:text-left sm:flex-1">
                          <div className="text-white font-orbitron text-lg">
                            {match.awayTeam?.name || 'Unknown Team'}
                          </div>
                        </div>
                      </div>
                      
                      {/* View Button */}
                      <div className="mt-3 sm:mt-0 sm:ml-4">
                        <div className="px-4 py-2 bg-[#00df82]/10 text-[#00df82] rounded-md font-audiowide text-sm hover:bg-[#00df82]/20 transition-colors">
                          View Scorecard
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching week matches:', error);
    return (
      <div className="min-h-screen bg-[#030f0f] p-4 flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-2xl font-audiowide mb-4">Error Loading Matches</h1>
          <p className="text-[#00df82]/80">There was a problem loading the matches for Week {weekNumber}.</p>
          <Link href="/matches" className="mt-6 inline-block px-4 py-2 bg-[#00df82]/10 text-[#00df82] rounded-md font-audiowide text-sm hover:bg-[#00df82]/20 transition-colors">
            Return to All Matches
          </Link>
        </div>
      </div>
    );
  }
} 