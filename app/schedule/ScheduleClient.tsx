'use client'

import React, { useState, useEffect } from 'react';
import { prisma } from '../../lib/prisma'
import Link from 'next/link';

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

// Group matches by week
function groupMatchesByWeek(matches: any[]) {
  if (!Array.isArray(matches)) {
    console.error('Expected matches to be an array, got:', typeof matches);
    return {};
  }
  
  const grouped = {};
  
  matches.forEach(match => {
    if (!match || typeof match !== 'object') {
      console.warn('Invalid match object:', match);
      return;
    }
    
    const weekNumber = match.weekNumber;
    if (!weekNumber) {
      console.warn('Match missing weekNumber:', match.id);
      return;
    }
    
    if (!grouped[weekNumber]) {
      grouped[weekNumber] = [];
    }
    grouped[weekNumber].push(match);
  });
  
  return grouped;
}

export default function SchedulePage({ 
  initialMatches = [], 
  initialTeams = [] 
}: { 
  initialMatches?: Match[], 
  initialTeams?: Team[] 
}) {
  const [expandedWeeks, setExpandedWeeks] = useState<Record<number, boolean>>({});
  
  console.log('ScheduleClient received initialMatches:', initialMatches?.length);
  console.log('ScheduleClient received initialTeams:', initialTeams?.length);
  
  if (initialMatches && initialMatches.length > 0) {
    console.log('First match sample:', initialMatches[0]);
  }
  
  // Toggle week expansion
  const toggleWeek = (weekNumber: number) => {
    setExpandedWeeks(prev => ({
      ...prev,
      [weekNumber]: !prev[weekNumber]
    }));
  };

  // Initialize all weeks as expanded initially for easier testing
  useEffect(() => {
    if (initialMatches && initialMatches.length > 0) {
      const weeks = Array.from(new Set(initialMatches.map(match => match.weekNumber)));
      
      const initialExpandedState: Record<number, boolean> = {};
      weeks.forEach(week => {
        initialExpandedState[week] = true;
      });
      
      setExpandedWeeks(initialExpandedState);
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
  
  console.log('Grouped matches by week:', Object.keys(matchesByWeek).length, 'weeks');
  
  // Get sorted week numbers
  const weekNumbers = Object.keys(matchesByWeek).map(Number).sort((a, b) => a - b);
  console.log('Week numbers:', weekNumbers);

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
        {/* Updated header to match the rest of the app */}
        <div className="relative overflow-hidden rounded-3xl backdrop-blur-sm bg-gradient-to-r from-[#00df82]/30 to-[#4CAF50]/20 mb-8">
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent"></div>
          <div className="relative px-8 py-6">
            <h1 className="text-4xl font-audiowide text-white mb-2">League Schedule</h1>
            <p className="text-white/90 font-orbitron tracking-wide">View upcoming matches</p>
            <p className="text-white/70 text-sm mt-2">Total matches: {initialMatches?.length || 0}, Weeks: {weekNumbers.length}</p>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-2xl transform translate-x-1/4 -translate-y-1/4"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-black/20 to-transparent rounded-full blur-xl transform -translate-x-1/4 translate-y-1/4"></div>
        </div>
        
        {weekNumbers.length === 0 ? (
          <div className="relative overflow-hidden rounded-xl backdrop-blur-sm bg-[#030f0f]/70 p-8 max-w-lg w-full border border-[#00df82]/30 text-center py-8">
            <p className="text-white/70 mb-4 font-orbitron">No matches scheduled yet.</p>
          </div>
        ) : (
          weekNumbers.map(weekNumber => {
            // Get the date for this week (using the first match's date)
            const weekMatches = matchesByWeek[weekNumber] || [];
            const weekDate = weekMatches.length > 0 ? weekMatches[0].date : '';
            const formattedDate = weekDate ? formatDate(weekDate) : '';
            const isExpanded = expandedWeeks[weekNumber] || false;
            
            return (
              <div key={weekNumber} className="mb-4">
                {/* Collapsible week header */}
                <button 
                  onClick={() => toggleWeek(weekNumber)}
                  className="w-full text-left relative overflow-hidden rounded-xl backdrop-blur-sm bg-[#030f0f]/70 border border-[#00df82]/30 px-6 py-4 transition-all duration-300 hover:bg-[#030f0f]/90 group"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-[#00df82]/5 to-transparent"></div>
                  <div className="relative flex justify-between items-center">
                    <h2 className="text-2xl font-audiowide text-white">
                      Week {weekNumber} - {formattedDate}
                    </h2>
                    <div className={`text-[#00df82] transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </button>
                
                {/* Collapsible content */}
                {isExpanded && weekMatches.length > 0 && (
                  <div className="relative overflow-hidden rounded-b-xl backdrop-blur-sm bg-[#030f0f]/70 border-x border-b border-[#00df82]/30 mt-px">
                    <div className="absolute inset-0 bg-gradient-to-b from-[#00df82]/5 to-transparent"></div>
                    
                    {/* Mobile-friendly table layout */}
                    <div className="grid grid-cols-1 divide-y divide-[#00df82]/10">
                      {weekMatches.map((match, idx) => (
                        <div key={match.id} className="p-4">
                          <div className="flex flex-col sm:flex-row items-center sm:justify-start">
                            {/* Starting Hole */}
                            <div className="flex items-center justify-center mb-3 sm:mb-0 sm:mr-6">
                              <span className="inline-flex items-center justify-center bg-[#00df82]/10 text-[#00df82] rounded-full h-10 w-10 font-orbitron text-sm">
                                {match.startingHole}
                              </span>
                            </div>
                            
                            {/* Teams - Adjusted to be closer to starting hole */}
                            <div className="flex flex-1 flex-col sm:flex-row sm:items-center w-full sm:w-auto">
                              {/* Home Team */}
                              <div className="mb-2 sm:mb-0 text-center sm:text-right">
                                <div className="text-white font-orbitron">
                                  {match.homeTeam?.name || `Unknown (${match.homeTeamId})`}
                                </div>
                              </div>
                              
                              {/* VS Divider */}
                              <div className="text-[#00df82] mx-2 mb-2 sm:mb-0 text-center">vs</div>
                              
                              {/* Away Team */}
                              <div className="text-center sm:text-left">
                                <div className="text-white font-orbitron">
                                  {match.awayTeam?.name || `Unknown (${match.awayTeamId})`}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
} 