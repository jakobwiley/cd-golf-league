'use client'

import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ChevronDown, ChevronUp, ClipboardList } from 'lucide-react';
import { useRouter } from 'next/navigation';

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
  
  // Sort the weeks numerically
  return Object.entries(grouped)
    .map(([week, matches]) => ({
      week: parseInt(week),
      matches
    }))
    .sort((a, b) => a.week - b.week);
};

// Types
interface Team {
  id: string;
  name: string;
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

interface MatchesPageProps {
  initialMatches?: Match[];
  initialTeams?: Team[];
}

export default function MatchesPage({ initialMatches = [], initialTeams = [] }: MatchesPageProps) {
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>(initialMatches);
  const [expandedWeeks, setExpandedWeeks] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState(initialMatches.length === 0);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch matches if none are provided
  useEffect(() => {
    const fetchMatches = async () => {
      if (initialMatches.length === 0) {
        try {
          setLoading(true);
          
          const response = await fetch('/api/schedule');
          if (!response.ok) {
            throw new Error('Failed to fetch matches');
          }
          
          const data = await response.json();
          if (data && data.matches) {
            console.log(`Fetched ${data.matches.length} matches from API`);
            setMatches(data.matches);
          }
          
          setLoading(false);
        } catch (err) {
          console.error('Error fetching matches:', err);
          setError('Failed to load matches. Please try again later.');
          setLoading(false);
        }
      }
    };
    
    fetchMatches();
  }, [initialMatches]);
  
  // Group matches by week
  const groupedMatches = groupMatchesByWeek(matches);
  
  // Initialize with first week expanded
  useEffect(() => {
    if (matches.length > 0) {
      console.log(`Grouped matches by week: ${groupedMatches.length} weeks`);
      
      // Initialize all weeks as collapsed initially
      const initialExpandedState: Record<number, boolean> = {};
      
      // Expand only the first week
      if (groupedMatches.length > 0) {
        initialExpandedState[groupedMatches[0].week] = true;
      }
      
      setExpandedWeeks(initialExpandedState);
    }
  }, [matches]);
  
  // Toggle week expansion
  const toggleWeek = (week: number) => {
    setExpandedWeeks(prev => ({
      ...prev,
      [week]: !prev[week]
    }));
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
            <h1 className="text-3xl md:text-4xl font-audiowide text-white mb-2">Matches</h1>
            <p className="text-lg text-white/90 font-orbitron tracking-wide">View and play upcoming matches</p>
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
                  <div className="divide-y divide-[#00df82]/10">
                    {matches.map(match => (
                      <div key={match.id} className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#00df82]/5 to-transparent opacity-0 hover:opacity-100 transition-opacity"></div>
                        
                        {/* Desktop view */}
                        <div className="hidden md:flex items-center py-3 px-6 relative z-10">
                          {/* Starting Hole */}
                          <div className="mr-4">
                            <div className="w-10 h-10 rounded-full bg-[#00df82]/10 border border-[#00df82]/30 flex items-center justify-center text-white font-orbitron">
                              {match.startingHole}
                            </div>
                          </div>
                          
                          {/* Teams */}
                          <div className="flex items-center mr-6">
                            <span className="font-orbitron text-white">{match.homeTeam.name}</span>
                            <span className="text-[#00df82] mx-2 font-audiowide">vs</span>
                            <span className="font-orbitron text-white">{match.awayTeam.name}</span>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex space-x-3">
                            <button
                              onClick={() => router.push(`/matches/${match.id}`)}
                              className="group relative overflow-hidden px-5 py-2 text-white bg-gradient-to-r from-[#00df82]/40 to-[#4CAF50]/30 hover:from-[#00df82]/60 hover:to-[#4CAF50]/50 rounded-lg transition-all duration-300 border border-[#00df82]/50 hover:border-[#00df82] backdrop-blur-sm text-sm font-audiowide shadow-[0_0_15px_rgba(0,223,130,0.3)] hover:shadow-[0_0_20px_rgba(0,223,130,0.5)] transform hover:scale-105"
                            >
                              <div className="absolute inset-0 bg-gradient-to-br from-[#00df82]/20 to-transparent opacity-50"></div>
                              <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-[#00df82]/20 to-transparent skew-x-15 group-hover:animate-shimmer"></div>
                              <span className="relative flex items-center">
                                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#00df82" strokeWidth="2"/>
                                  <path d="M15 12L10 15.4641V8.5359L15 12Z" fill="#00df82"/>
                                </svg>
                                Play Match
                              </span>
                            </button>
                            <button
                              onClick={() => router.push(`/matches/${match.id}/scorecard-summary`)}
                              className="group relative overflow-hidden px-5 py-2 text-white bg-gradient-to-r from-[#00df82]/40 to-[#4CAF50]/30 hover:from-[#00df82]/60 hover:to-[#4CAF50]/50 rounded-lg transition-all duration-300 border border-[#00df82]/50 hover:border-[#00df82] backdrop-blur-sm text-sm font-audiowide shadow-[0_0_15px_rgba(0,223,130,0.3)] hover:shadow-[0_0_20px_rgba(0,223,130,0.5)] transform hover:scale-105"
                            >
                              <div className="absolute inset-0 bg-gradient-to-br from-[#00df82]/20 to-transparent opacity-50"></div>
                              <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-[#00df82]/20 to-transparent skew-x-15 group-hover:animate-shimmer"></div>
                              <span className="relative flex items-center">
                                <ClipboardList className="w-4 h-4 mr-2" />
                                View Scorecard
                              </span>
                            </button>
                          </div>
                        </div>
                        
                        {/* Mobile view */}
                        <div className="md:hidden p-4 relative z-10">
                          <div className="flex items-center mb-3">
                            <div className="w-8 h-8 rounded-full bg-[#00df82]/10 border border-[#00df82]/30 flex items-center justify-center text-white font-orbitron text-sm mr-3">
                              {match.startingHole}
                            </div>
                            <div className="flex items-center">
                              <span className="font-orbitron text-white text-sm">{match.homeTeam.name}</span>
                              <span className="text-[#00df82] mx-2 font-audiowide text-sm">vs</span>
                              <span className="font-orbitron text-white text-sm">{match.awayTeam.name}</span>
                            </div>
                          </div>
                          <div className="flex flex-col space-y-2">
                            <button
                              onClick={() => router.push(`/matches/${match.id}`)}
                              className="w-full group relative overflow-hidden px-4 py-2 text-white bg-gradient-to-r from-[#00df82]/40 to-[#4CAF50]/30 hover:from-[#00df82]/60 hover:to-[#4CAF50]/50 rounded-lg transition-all duration-300 border border-[#00df82]/50 hover:border-[#00df82] backdrop-blur-sm text-xs font-audiowide shadow-[0_0_15px_rgba(0,223,130,0.3)] hover:shadow-[0_0_20px_rgba(0,223,130,0.5)]"
                            >
                              <div className="absolute inset-0 bg-gradient-to-br from-[#00df82]/20 to-transparent opacity-50"></div>
                              <span className="relative flex items-center justify-center">
                                <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#00df82" strokeWidth="2"/>
                                  <path d="M15 12L10 15.4641V8.5359L15 12Z" fill="#00df82"/>
                                </svg>
                                Play Match
                              </span>
                            </button>
                            <button
                              onClick={() => router.push(`/matches/${match.id}/scorecard-summary`)}
                              className="w-full group relative overflow-hidden px-4 py-2 text-white bg-gradient-to-r from-[#00df82]/40 to-[#4CAF50]/30 hover:from-[#00df82]/60 hover:to-[#4CAF50]/50 rounded-lg transition-all duration-300 border border-[#00df82]/50 hover:border-[#00df82] backdrop-blur-sm text-xs font-audiowide shadow-[0_0_15px_rgba(0,223,130,0.3)] hover:shadow-[0_0_20px_rgba(0,223,130,0.5)]"
                            >
                              <div className="absolute inset-0 bg-gradient-to-br from-[#00df82]/20 to-transparent opacity-50"></div>
                              <span className="relative flex items-center justify-center">
                                <ClipboardList className="w-4 h-4 mr-1" />
                                View Scorecard
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
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