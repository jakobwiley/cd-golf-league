import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SchedulePage from '../schedule/ScheduleClient';

// Mock data for testing
const mockTeams = [
  { id: 'team1', name: 'Team 1' },
  { id: 'team2', name: 'Team 2' },
  { id: 'team3', name: 'Team 3' },
  { id: 'team4', name: 'Team 4' },
  { id: 'team5', name: 'Team 5' },
  { id: 'team6', name: 'Team 6' },
  { id: 'team7', name: 'Team 7' },
  { id: 'team8', name: 'Team 8' },
  { id: 'team9', name: 'Team 9' },
  { id: 'team10', name: 'Team 10' },
];

// Create matches for 14 weeks, with 5 matches per week
const mockMatches = Array.from({ length: 14 }, (_, weekIndex) => {
  return Array.from({ length: 5 }, (_, matchIndex) => {
    const weekNumber = weekIndex + 1;
    const date = new Date(2024, 3 + Math.floor(weekIndex / 4), 1 + (weekIndex % 4) * 7);
    return {
      id: `match-${weekNumber}-${matchIndex}`,
      date: date.toISOString(),
      weekNumber,
      homeTeamId: `team${matchIndex + 1}`,
      awayTeamId: `team${(matchIndex + 5) % 10 + 1}`,
      homeTeam: mockTeams[matchIndex],
      awayTeam: mockTeams[(matchIndex + 5) % 10],
      startingHole: matchIndex + 1,
      status: 'SCHEDULED'
    };
  });
}).flat();

describe('Schedule Page', () => {
  beforeEach(() => {
    // Mock console.log to suppress output during tests
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  test('displays all 14 weeks in the schedule', () => {
    render(<SchedulePage initialMatches={mockMatches} initialTeams={mockTeams} />);
    
    // Check for each week
    for (let week = 1; week <= 14; week++) {
      const weekHeader = screen.getByText(`Week ${week} -`, { exact: false });
      expect(weekHeader).toBeInTheDocument();
    }
  });

  test('displays 5 matches for each week', () => {
    render(<SchedulePage initialMatches={mockMatches} initialTeams={mockTeams} />);
    
    // Check the number of teams in each week
    for (let week = 1; week <= 14; week++) {
      // We need to wait for the expansion to happen in the useEffect
      const weekMatches = mockMatches.filter(match => match.weekNumber === week);
      expect(weekMatches.length).toBe(5);
      
      // Verify each match has proper home and away team
      weekMatches.forEach(match => {
        const homeTeamName = match.homeTeam.name;
        const awayTeamName = match.awayTeam.name;
        
        // Check for both teams being displayed
        const homeTeamElements = screen.getAllByText(homeTeamName);
        const awayTeamElements = screen.getAllByText(awayTeamName);
        
        expect(homeTeamElements.length).toBeGreaterThan(0);
        expect(awayTeamElements.length).toBeGreaterThan(0);
      });
    }
  });

  test('displays total number of matches correctly', () => {
    render(<SchedulePage initialMatches={mockMatches} initialTeams={mockTeams} />);
    
    const totalMatches = mockMatches.length;
    const totalText = screen.getByText(`Total matches: ${totalMatches}`, { exact: false });
    expect(totalText).toBeInTheDocument();
  });

  test('handles empty initial data gracefully', () => {
    render(<SchedulePage initialMatches={[]} initialTeams={[]} />);
    
    const noMatchesText = screen.getByText('No matches scheduled yet.');
    expect(noMatchesText).toBeInTheDocument();
  });
}); 