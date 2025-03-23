'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp, ClipboardList } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

// Helper function to format date
function formatDate(dateString: string) {
  if (!dateString) {
    console.warn('Invalid date string:', dateString);
    return 'Date TBD';
  }
  
  try {
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.warn('Invalid date value:', dateString);
      return 'Date TBD';
    }
    
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Date TBD';
  }
}

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

export default function SchedulePage({ 
  initialMatches = [], 
  initialTeams = [] 
}: { 
  initialMatches?: Match[], 
  initialTeams?: Team[] 
}) {
  const router = useRouter();
  const [expandedWeeks, setExpandedWeeks] = useState<Record<number, boolean>>({});
  
  // Toggle week expansion
  const toggleWeek = (weekNumber: number) => {
    console.log('Toggling week', weekNumber, 'current state:', expandedWeeks[weekNumber]);
    setExpandedWeeks(prev => {
      const newState = {
        ...prev,
        [weekNumber]: !prev[weekNumber]
      };
      console.log('New expanded state:', newState);
      return newState;
    });
  };

  // Initialize with first week expanded
  useEffect(() => {
    if (initialMatches && initialMatches.length > 0) {
      const now = new Date();
      
      // Group matches by week with dates
      const weekDates = initialMatches.reduce((acc: Record<number, Date>, match) => {
        if (!acc[match.weekNumber]) {
          acc[match.weekNumber] = new Date(match.date);
        }
        return acc;
      }, {});
      
      // Find the next upcoming week
      const nextWeek = Object.entries(weekDates)
        .map(([week, date]) => ({ week: Number(week), date }))
        .sort((a, b) => a.week - b.week)
        .find(({ date }) => date >= now)?.week || 1;  // Default to week 1 if no upcoming week
      
      console.log('Setting active week:', nextWeek);
      
      // Initialize all weeks as collapsed except the next week
      const initialExpandedState: Record<number, boolean> = {};
      Object.keys(weekDates).forEach(week => {
        initialExpandedState[Number(week)] = Number(week) === nextWeek;
      });
      
      setExpandedWeeks(initialExpandedState);
      
      // Scroll to the active week
      setTimeout(() => {
        const weekElement = document.getElementById(`week-${nextWeek}`);
        if (weekElement) {
          weekElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [initialMatches]);

  // Group matches by week
  const matchesByWeek: Record<number, Match[]> = {};
  
  if (Array.isArray(initialMatches)) {
    initialMatches.forEach(match => {
      if (match && match.weekNumber) {
        if (!matchesByWeek[match.weekNumber]) {
          matchesByWeek[match.weekNumber] = [];
        }
        matchesByWeek[match.weekNumber].push(match);
      }
    });
  }
  
  // Get sorted week numbers
  const weekNumbers = Object.keys(matchesByWeek).map(Number).sort((a, b) => a - b);

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
            <h1 className="text-3xl md:text-4xl font-audiowide text-white mb-2">League Schedule</h1>
            <p className="text-lg text-white/90 font-orbitron tracking-wide">View upcoming matches</p>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-2xl transform translate-x-1/4 -translate-y-1/4"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-black/20 to-transparent rounded-full blur-xl transform -translate-x-1/4 translate-y-1/4"></div>
        </div>

        {/* Schedule List */}
        <div className="space-y-2">
          {weekNumbers.map(weekNumber => {
            const weekMatches = matchesByWeek[weekNumber] || [];
            const isExpanded = expandedWeeks[weekNumber] || false;
            const weekDate = weekMatches[0]?.date ? format(new Date(weekMatches[0].date), 'MMMM d') : 'TBD';
            
            return (
              <div key={weekNumber} id={`week-${weekNumber}`} className="relative overflow-hidden rounded-2xl border border-[#00df82]/50 backdrop-blur-sm bg-[#030f0f]/50">
                <div className="absolute inset-0 bg-gradient-to-br from-[#00df82]/20 to-transparent"></div>
                <button
                  className="w-full px-6 py-4 flex items-center justify-between text-white hover:bg-white/5 transition-colors relative z-10"
                  onClick={() => toggleWeek(weekNumber)}
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-xl font-audiowide">Week {weekNumber}</span>
                    <span className="text-base text-white/60 font-orbitron">{weekDate}</span>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </button>
                {/* Match list */}
                {isExpanded && (
                  <div className="mt-1 space-y-1">
                    {weekMatches.map((match, index) => (
                      <div 
                        key={match.id} 
                        className="flex flex-col md:flex-row md:items-center bg-[#001f1f]/50 px-4 py-3 mx-2 rounded-lg"
                      >
                        {/* Match info - always on one line */}
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-[#00df82]/10 border border-[#00df82]/30 flex items-center justify-center text-white font-orbitron mr-3">
                            {match.startingHole}
                          </div>
                          <div className="flex items-center">
                            <div className="text-white font-audiowide text-base">
                              {match.homeTeam?.name}
                            </div>
                            <div className="text-[#00df82] font-audiowide mx-2 text-base">vs</div>
                            <div className="text-white font-audiowide text-base">
                              {match.awayTeam?.name}
                            </div>
                          </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex flex-col md:flex-row mt-2 md:mt-0 space-y-2 md:space-y-0 md:space-x-2 md:ml-auto w-full md:w-auto">
                          <button
                            onClick={() => router.push(`/matches/${match.id}`)}
                            className="group relative overflow-hidden px-4 py-2 text-white bg-gradient-to-r from-[#00df82]/40 to-[#4CAF50]/30 hover:from-[#00df82]/60 hover:to-[#4CAF50]/50 rounded-lg transition-all duration-300 border border-[#00df82]/50 hover:border-[#00df82] backdrop-blur-sm text-sm font-audiowide shadow-[0_0_15px_rgba(0,223,130,0.3)] hover:shadow-[0_0_20px_rgba(0,223,130,0.5)] transform hover:scale-105 w-full md:w-auto"
                          >
                            <div className="absolute inset-0 bg-gradient-to-br from-[#00df82]/20 to-transparent opacity-50"></div>
                            <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-[#00df82]/20 to-transparent skew-x-15 group-hover:animate-shimmer"></div>
                            <span className="relative flex items-center justify-center">
                              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#00df82" strokeWidth="2"/>
                                <path d="M15 12L10 15.4641V8.5359L15 12Z" fill="#00df82"/>
                              </svg>
                              Play Match
                            </span>
                          </button>
                          <button
                            onClick={() => router.push(`/matches/${match.id}/scorecard-summary`)}
                            className="group relative overflow-hidden px-4 py-2 text-white bg-gradient-to-r from-[#00df82]/40 to-[#4CAF50]/30 hover:from-[#00df82]/60 hover:to-[#4CAF50]/50 rounded-lg transition-all duration-300 border border-[#00df82]/50 hover:border-[#00df82] backdrop-blur-sm text-sm font-audiowide shadow-[0_0_15px_rgba(0,223,130,0.3)] hover:shadow-[0_0_20px_rgba(0,223,130,0.5)] transform hover:scale-105 w-full md:w-auto"
                          >
                            <div className="absolute inset-0 bg-gradient-to-br from-[#00df82]/20 to-transparent opacity-50"></div>
                            <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-[#00df82]/20 to-transparent skew-x-15 group-hover:animate-shimmer"></div>
                            <span className="relative flex items-center justify-center">
                              <ClipboardList className="w-4 h-4 mr-2" stroke="#00df82" />
                              View Scorecard
                            </span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}