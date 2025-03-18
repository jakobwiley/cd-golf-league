'use client'

import React, { useState, useEffect } from 'react';
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

export default function SchedulePage({ 
  initialMatches = [], 
  initialTeams = [] 
}: { 
  initialMatches?: Match[], 
  initialTeams?: Team[] 
}) {
  const [expandedWeeks, setExpandedWeeks] = useState<Record<number, boolean>>({});
  
  // Toggle week expansion
  const toggleWeek = (weekNumber: number) => {
    setExpandedWeeks(prev => ({
      ...prev,
      [weekNumber]: !prev[weekNumber]
    }));
  };

  // Initialize all weeks as collapsed initially
  useEffect(() => {
    if (initialMatches && initialMatches.length > 0) {
      const weeks = Array.from(new Set(initialMatches.map(match => match.weekNumber)));
      
      const initialExpandedState: Record<number, boolean> = {};
      weeks.forEach(week => {
        initialExpandedState[week] = false;
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
  
  // Get sorted week numbers
  const weekNumbers = Object.keys(matchesByWeek).map(Number).sort((a, b) => a - b);

  return (
    <div className="min-h-screen bg-[#002f1f]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Card */}
        <div className="mb-8 bg-[#004f3f] rounded-2xl p-6">
          <h1 className="text-4xl font-audiowide text-white mb-2">League Schedule</h1>
          <p className="text-[#00df82] mb-4">View upcoming matches</p>
          <p className="text-white/70 text-sm">
            Total matches: {Object.values(matchesByWeek).flat().length}, 
            Weeks: {weekNumbers.length}
          </p>
        </div>

        {/* Schedule List */}
        <div className="space-y-2">
          {weekNumbers.map(weekNumber => {
            const weekMatches = matchesByWeek[weekNumber] || [];
            const weekDate = weekMatches.length > 0 ? formatDate(weekMatches[0].date) : '';
            const isExpanded = expandedWeeks[weekNumber] || false;
            
            return (
              <div key={weekNumber}>
                {/* Week header */}
                <button 
                  onClick={() => toggleWeek(weekNumber)}
                  className="w-full text-left bg-[#001f1f] rounded-lg overflow-hidden group transition-all duration-200"
                >
                  <div className="px-6 py-4 flex items-center justify-between">
                    <h2 className="text-xl font-audiowide text-white">
                      Week {weekNumber} - {weekDate}
                    </h2>
                    <div className={`text-[#00df82] transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </button>
                
                {/* Match list */}
                {isExpanded && (
                  <div className="mt-1 space-y-1">
                    {weekMatches.map((match, index) => (
                      <div 
                        key={match.id} 
                        className="flex items-center bg-[#001f1f]/50 px-6 py-4 rounded-lg"
                      >
                        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#00df82]/10 mr-6">
                          <span className="text-[#00df82] font-mono">{match.startingHole}</span>
                        </div>
                        <div className="flex-1 grid grid-cols-3 gap-4 items-center">
                          <div className="text-right text-white font-audiowide">
                            {match.homeTeam?.name}
                          </div>
                          <div className="text-center text-[#00df82] font-audiowide">vs</div>
                          <div className="text-left text-white font-audiowide">
                            {match.awayTeam?.name}
                          </div>
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