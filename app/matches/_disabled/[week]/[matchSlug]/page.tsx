import { prisma } from '../../../../lib/prisma'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import HoleByHoleScorecard from '../../../components/HoleByHoleScorecard'

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

// Define the Match interface to match the component's expectations
interface Team {
  id: string;
  name: string;
  players?: any[];
}

interface Match {
  id: string;
  date: string;
  weekNumber: number;
  homeTeamId: string;
  awayTeamId: string;
  homeTeam: Team;
  awayTeam: Team;
  startingHole: number;
  status: string;
}

export default async function MatchPage({ params }: { params: { week: string, matchSlug: string } }) {
  const weekNumber = parseInt(params.week);
  const matchSlug = params.matchSlug;
  
  if (isNaN(weekNumber)) {
    notFound();
  }
  
  try {
    // Fetch all matches for this week
    const matches = await prisma.match.findMany({
      where: {
        weekNumber: weekNumber
      },
      include: {
        homeTeam: true,
        awayTeam: true
      }
    });
    
    // Find the match that matches the slug
    const matchData = matches.find(m => {
      const slug = createMatchSlug(m.homeTeam.name, m.awayTeam.name);
      return slug === matchSlug;
    });
    
    if (!matchData) {
      notFound();
    }
    
    // Convert the Prisma match to our Match interface
    const match: Match = {
      id: matchData.id,
      date: matchData.date.toISOString(),
      weekNumber: matchData.weekNumber,
      homeTeamId: matchData.homeTeamId,
      awayTeamId: matchData.awayTeamId,
      homeTeam: {
        id: matchData.homeTeam.id,
        name: matchData.homeTeam.name
      },
      awayTeam: {
        id: matchData.awayTeam.id,
        name: matchData.awayTeam.name
      },
      startingHole: matchData.startingHole,
      status: matchData.status
    };
    
    const formattedDate = formatDate(matchData.date);
    
    return (
      <div className="min-h-screen bg-[#030f0f] p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <Link href={`/matches/${weekNumber}`} className="text-[#00df82] hover:text-[#00df82]/80 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Back to Week {weekNumber} Matches
            </Link>
          </div>
          
          <div className="bg-gradient-to-r from-[#00df82]/20 to-transparent p-4 rounded-t-xl backdrop-blur-sm border border-[#00df82]/20">
            <h1 className="text-3xl font-audiowide text-white">
              {match.homeTeam.name} vs {match.awayTeam.name}
            </h1>
            <div className="flex flex-wrap items-center mt-2 gap-x-6 gap-y-2">
              <p className="text-[#00df82]/80 font-orbitron">Week {weekNumber}</p>
              <p className="text-[#00df82]/80 font-orbitron">{formattedDate}</p>
              <p className="text-[#00df82]/80 font-orbitron">Starting Hole: {match.startingHole}</p>
            </div>
          </div>
          
          <div className="bg-[#030f0f]/90 rounded-b-xl backdrop-blur-sm border-x border-b border-[#00df82]/20 p-4">
            <HoleByHoleScorecard 
              match={match} 
              onClose={() => {}} // No-op since this is a dedicated page
            />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching match:', error);
    return (
      <div className="min-h-screen bg-[#030f0f] p-4 flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-2xl font-audiowide mb-4">Error Loading Match</h1>
          <p className="text-[#00df82]/80">There was a problem loading the match details.</p>
          <Link href={`/matches/${weekNumber}`} className="mt-6 inline-block px-4 py-2 bg-[#00df82]/10 text-[#00df82] rounded-md font-audiowide text-sm hover:bg-[#00df82]/20 transition-colors">
            Return to Week {weekNumber} Matches
          </Link>
        </div>
      </div>
    );
  }
} 