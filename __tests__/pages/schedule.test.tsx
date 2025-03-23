import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ScheduleClient from '../../app/schedule/ScheduleClient';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}));

// Define a simplified Team type for testing
interface TestTeam {
  id: string;
  name: string;
}

// Define a simplified Match type for testing
interface TestMatch {
  id: string;
  week: number;
  weekNumber: number;
  date: string;
  homeTeam: TestTeam;
  awayTeam: TestTeam;
  homeTeamId: string;
  awayTeamId: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED';
  startingHole: number;
}

// Mock data for testing
const mockMatches: TestMatch[] = [
  {
    id: 'match1',
    week: 1,
    weekNumber: 1,
    date: new Date('2025-04-01').toISOString(),
    homeTeam: { id: 'team1', name: 'Team 1' },
    awayTeam: { id: 'team2', name: 'Team 2' },
    homeTeamId: 'team1',
    awayTeamId: 'team2',
    status: 'SCHEDULED',
    startingHole: 1
  },
  {
    id: 'match2',
    week: 1,
    weekNumber: 1,
    date: new Date('2025-04-01').toISOString(),
    homeTeam: { id: 'team3', name: 'Team 3' },
    awayTeam: { id: 'team4', name: 'Team 4' },
    homeTeamId: 'team3',
    awayTeamId: 'team4',
    status: 'SCHEDULED',
    startingHole: 1
  },
  {
    id: 'match3',
    week: 2,
    weekNumber: 2,
    date: new Date('2025-04-08').toISOString(),
    homeTeam: { id: 'team1', name: 'Team 1' },
    awayTeam: { id: 'team3', name: 'Team 3' },
    homeTeamId: 'team1',
    awayTeamId: 'team3',
    status: 'SCHEDULED',
    startingHole: 1
  }
];

describe('Schedule Page', () => {
  it('renders the schedule page with correct title', () => {
    render(<ScheduleClient initialMatches={mockMatches as any} />);
    expect(screen.getByText('Match Schedule')).toBeInTheDocument();
  });

  it('groups matches by week correctly', () => {
    render(<ScheduleClient initialMatches={mockMatches as any} />);
    
    // Should show 2 weeks
    expect(screen.getByText('Week 1')).toBeInTheDocument();
    expect(screen.getByText('Week 2')).toBeInTheDocument();
  });

  it('expands week when clicked to show matches', async () => {
    render(<ScheduleClient initialMatches={mockMatches as any} />);
    
    // Initially, matches should not be visible
    expect(screen.queryByText('Team 1 vs Team 2')).not.toBeInTheDocument();
    
    // Click to expand Week 1
    fireEvent.click(screen.getByText('Week 1'));
    
    // Wait for animation to complete and check if matches are visible
    await waitFor(() => {
      expect(screen.getByText('Team 1')).toBeInTheDocument();
      expect(screen.getByText('Team 2')).toBeInTheDocument();
      expect(screen.getByText('Team 3')).toBeInTheDocument();
      expect(screen.getByText('Team 4')).toBeInTheDocument();
    });
  });

  it('shows Play Match button for scheduled matches', async () => {
    render(<ScheduleClient initialMatches={mockMatches as any} />);
    
    // Expand Week 1
    fireEvent.click(screen.getByText('Week 1'));
    
    // Check if Play Match buttons are visible
    await waitFor(() => {
      const playMatchButtons = screen.getAllByText('Play Match');
      expect(playMatchButtons.length).toBeGreaterThan(0);
    });
  });

  it('navigates to match page when Play Match is clicked', async () => {
    const mockRouter = { push: jest.fn() };
    require('next/navigation').useRouter.mockReturnValue(mockRouter);
    
    render(<ScheduleClient initialMatches={mockMatches as any} />);
    
    // Expand Week 1
    fireEvent.click(screen.getByText('Week 1'));
    
    // Wait for buttons to appear
    await waitFor(() => {
      const playMatchButtons = screen.getAllByText('Play Match');
      fireEvent.click(playMatchButtons[0]);
    });
    
    // Check if router.push was called with the correct path
    expect(mockRouter.push).toHaveBeenCalledWith('/matches/match1');
  });
});
