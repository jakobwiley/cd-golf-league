'use client'

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Match, Team } from '../types';
import { calculateHolePoints } from '../lib/scoring';
import MatchPointTracker from '../components/MatchPointTracker';

// Helper function to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return format(date, 'MMMM d, yyyy');
};

// Helper function to group matches by week
const groupMatchesByWeek = (matches: Match[]) => {
  const grouped: Record<number, Match[]> = {};
  
  matches.forEach(match => {
    const week = match.weekNumber;
    if (!grouped[week]) {
      grouped[week] = [];
    }
    grouped[week].push(match);
  });
  
  // Sort matches within each week by starting hole number in ascending order
  Object.keys(grouped).forEach(week => {
    grouped[parseInt(week)].sort((a, b) => {
      // Default to hole 1 if startingHole is not defined
      const aHole = a.startingHole || 1;
      const bHole = b.startingHole || 1;
      return aHole - bHole;
    });
  });
  
  // Sort the weeks numerically
  return Object.entries(grouped)
    .map(([week, matches]) => ({
      week: parseInt(week),
      matches
    }))
    .sort((a, b) => a.week - b.week);
};

interface LiveMatchesPageProps {
  initialMatches?: Match[];
  initialTeams?: Team[];
}

export default function LiveMatchesPage({ initialMatches = [], initialTeams = [] }: LiveMatchesPageProps) {
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>(initialMatches);
  const [matchDetails, setMatchDetails] = useState<Record<string, Match>>({});
  const [expandedWeeks, setExpandedWeeks] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState(initialMatches.length === 0);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch matches if none are provided
  useEffect(() => {
    const fetchMatches = async () => {
      if (initialMatches.length === 0) {
        try {
          setLoading(true);
          
          const response = await fetch('/api/matches', {
            cache: 'no-store',
            headers: {
              'Cache-Control': 'no-cache'
            }
          });
          
          if (!response.ok) {
            throw new Error('Failed to fetch matches');
          }
          
          const data = await response.json();
          
          if (Array.isArray(data)) {
            setMatches(data);
          } else {
            console.error('Unexpected API response format:', data);
            setError('Unexpected API response format');
          }
          
          setLoading(false);
        } catch (err) {
          console.error('Error fetching matches:', err);
          setError('Failed to load matches. Please try again later.');
          setLoading(false);
        }
      } else {
        // Use the initial matches provided as props
        console.log(`Using ${initialMatches.length} initial matches`);
        setLoading(false);
      }
    };
    
    fetchMatches();
  }, [initialMatches]);

  // Group matches by week
  const groupedMatches = groupMatchesByWeek(matches);
  
  // Initialize with first week expanded and fetch its match details
  useEffect(() => {
    if (matches.length > 0) {
      console.log(`Grouped matches by week: ${groupedMatches.length} weeks`);
      
      // Initialize all weeks as collapsed initially
      const initialExpandedState: Record<number, boolean> = {};
      
      // Expand only the first week
      if (groupedMatches.length > 0) {
        const firstWeek = groupedMatches[0].week;
        initialExpandedState[firstWeek] = true;
        
        // Fetch details for all matches in the first week
        const weekMatches = groupedMatches[0].matches;
        console.log('Auto-expanding week 1, fetching matches:', weekMatches);
        weekMatches.forEach(match => fetchMatchDetails(match.id));
      }
      
      setExpandedWeeks(initialExpandedState);
    }
  }, [matches]);

  // Fetch match details and scores when a week is expanded
  const fetchMatchDetails = async (matchId: string) => {
    if (!matchDetails[matchId]) {
      try {
        console.log('Fetching details for match:', matchId);
        const [matchResponse, scoresResponse, playersResponse] = await Promise.all([
          fetch(`/api/matches/${matchId}`),
          fetch(`/api/scores?matchId=${matchId}`),
          fetch('/api/players')
        ]);
        
        if (!matchResponse.ok) throw new Error('Failed to fetch match details');
        if (!scoresResponse.ok) throw new Error('Failed to fetch match scores');
        if (!playersResponse.ok) throw new Error('Failed to fetch players');
        
        const matchData = await matchResponse.json();
        const scoresData = await scoresResponse.json();
        const playersData = await playersResponse.json();
        
        console.log('Received match details:', matchData);
        console.log('Received match scores:', scoresData);
        console.log('Received players:', playersData);
        
        // Get players for each team
        const homeTeamPlayers = playersData.filter((p: any) => p.teamId === matchData.homeTeamId);
        const awayTeamPlayers = playersData.filter((p: any) => p.teamId === matchData.awayTeamId);
        
        // Combine match data with scores and players
        const fullMatchData = {
          ...matchData,
          scores: scoresData,
          homeTeam: {
            ...matchData.homeTeam,
            players: homeTeamPlayers
          },
          awayTeam: {
            ...matchData.awayTeam,
            players: awayTeamPlayers
          }
        };
        
        setMatchDetails(prev => ({
          ...prev,
          [matchId]: fullMatchData
        }));
      } catch (err) {
        console.error('Error fetching match details:', err);
      }
    }
  };

  // Toggle week expansion and fetch match details
  const toggleWeek = async (week: number) => {
    const isExpanding = !expandedWeeks[week];
    setExpandedWeeks(prev => ({
      ...prev,
      [week]: !prev[week]
    }));

    // If expanding, fetch details for all matches in the week
    if (isExpanding) {
      const weekMatches = groupedMatches.find(g => g.week === week)?.matches || [];
      await Promise.all(weekMatches.map(match => fetchMatchDetails(match.id)));
    }
  };

  return (
    <div className="min-h-screen bg-[#030f0f] relative overflow-hidden">
      {/* Futuristic background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#00df82]/20 to-[#4CAF50]/10" />
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full bg-[url('/grid-pattern.svg')] bg-repeat bg-[length:50px_50px]" />
        </div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#00df82]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-[#4CAF50]/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative overflow-hidden rounded-3xl backdrop-blur-sm bg-gradient-to-r from-[#00df82]/30 to-[#4CAF50]/20 mb-8">
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent"></div>
          <div className="relative px-6 py-8">
            <h1 className="text-3xl md:text-4xl font-audiowide text-white mb-2">Live Matches</h1>
            <p className="text-lg text-white/90 font-orbitron tracking-wide">View live match scores for all weeks</p>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-2xl transform translate-x-1/4 -translate-y-1/4"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-black/20 to-transparent rounded-full blur-xl transform -translate-x-1/4 translate-y-1/4"></div>
        </div>
      
        {loading && <div className="text-center text-white">Loading matches...</div>}
        {error && <div className="text-center text-red-500">{error}</div>}
        
        {groupedMatches.length === 0 ? (
          <div className="text-center text-white">No matches found. Please try refreshing the page.</div>
        ) : (
          <div className="space-y-6">
            {groupedMatches.map(({ week, matches }) => (
              <div key={week} className="relative overflow-hidden rounded-2xl border border-[#00df82]/30 backdrop-blur-sm bg-[#030f0f]/50">
                <div className="absolute inset-0 bg-gradient-to-br from-[#00df82]/5 to-transparent"></div>
                <button
                  className="w-full px-6 py-4 flex items-center justify-between text-white hover:bg-white/5 transition-colors relative z-10"
                  onClick={() => toggleWeek(week)}
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-xl font-audiowide">Week {week}</span>
                    <span className="text-base text-white/60 font-orbitron">
                      {matches[0]?.date ? formatDate(matches[0].date) : 'TBD'}
                    </span>
                  </div>
                  {expandedWeeks[week] ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </button>
                
                {expandedWeeks[week] && (
                  <div className="px-4 pb-4 space-y-4">
                    {matches.map(match => {
                      const detailedMatch = matchDetails[match.id] || match;
                      console.log('Rendering match:', match.id);
                      console.log('Detailed match data:', detailedMatch);
                      const { totalHomePoints, totalAwayPoints } = calculateHolePoints(detailedMatch);
                      console.log('Calculated points:', { totalHomePoints, totalAwayPoints });
                      
                      return (
                        <div key={match.id} className="pt-4 first:pt-0">
                          <MatchPointTracker 
                            match={detailedMatch}
                            homePoints={totalHomePoints}
                            awayPoints={totalAwayPoints}
                            onViewScorecard={() => router.push(`/matches/${match.id}/scorecard-summary`)}
                          />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
