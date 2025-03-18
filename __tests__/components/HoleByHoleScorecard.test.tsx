import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import HoleByHoleScorecard from '../../app/components/HoleByHoleScorecard';

// Define test-specific types
interface Player {
  id: string;
  name: string;
  handicapIndex: number;
  teamId: string;
}

type TestTeam = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  players?: Player[];
};

type TestMatch = {
  id: string;
  date: string;
  weekNumber: number;
  status: string;
  homeTeamId: string;
  awayTeamId: string;
  startingHole: number;
  createdAt: string;
  updatedAt: string;
  homeTeam: TestTeam;
  awayTeam: TestTeam;
};

// Mock fetch
global.fetch = jest.fn();

// Mock WebSocket
class MockWebSocket {
  onmessage: ((event: any) => void) | null = null;
  close = jest.fn();
  send = jest.fn();
  
  constructor() {
    setTimeout(() => {
      if (this.onmessage) {
        this.onmessage({ data: JSON.stringify({ type: 'SCORE_UPDATED' }) });
      }
    }, 100);
  }
}

global.WebSocket = MockWebSocket as any;

// Mock players
const mockPlayers = {
  home: [
    {
      id: 'home-player-1',
      name: 'Home Player 1',
      handicapIndex: 10.5,
      teamId: 'home-team-id'
    },
    {
      id: 'home-player-2',
      name: 'Home Player 2',
      handicapIndex: 15.2,
      teamId: 'home-team-id'
    }
  ],
  away: [
    {
      id: 'away-player-1',
      name: 'Away Player 1',
      handicapIndex: 8.3,
      teamId: 'away-team-id'
    },
    {
      id: 'away-player-2',
      name: 'Away Player 2',
      handicapIndex: 12.7,
      teamId: 'away-team-id'
    }
  ]
} as { home: Player[], away: Player[] };

// Mock match data
const mockMatch: TestMatch = {
  id: 'test-match-id',
  date: new Date().toISOString(),
  weekNumber: 1,
  status: 'IN_PROGRESS',
  homeTeamId: 'home-team-id',
  awayTeamId: 'away-team-id',
  startingHole: 1,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  homeTeam: {
    id: 'home-team-id',
    name: 'Home Team',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    players: mockPlayers.home
  },
  awayTeam: {
    id: 'away-team-id',
    name: 'Away Team',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    players: mockPlayers.away
  }
};

describe('HoleByHoleScorecard', () => {
  beforeEach(() => {
    // Reset fetch mock
    (global.fetch as jest.Mock).mockReset();
    
    // Mock successful fetch responses
    (global.fetch as jest.Mock).mockImplementation((url) => {
      if (url.includes('/api/scores?matchId=')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([])
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true })
      });
    });
  });

  it('loads and displays initial match data', async () => {
    render(
      <HoleByHoleScorecard
        match={mockMatch}
        onClose={() => {}}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Match Scorecard')).toBeInTheDocument();
      expect(screen.getByText('Home Team')).toBeInTheDocument();
      expect(screen.getByText('Away Team')).toBeInTheDocument();
    });
  });

  it('auto-saves score when entered', async () => {
    const mockFetch = global.fetch as jest.Mock;
    
    render(
      <HoleByHoleScorecard
        match={mockMatch}
        onClose={() => {}}
      />
    );

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Match Scorecard')).toBeInTheDocument();
    });

    // Find score input for first home player, hole 1
    const scoreInput = screen.getAllByRole('spinbutton')[0];
    
    // Enter score
    await act(async () => {
      fireEvent.change(scoreInput, { target: { value: '4' } });
    });

    // Verify auto-save was triggered
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/scores', expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('4')
      }));
    });
  });

  it('retries failed save attempts', async () => {
    const mockFetch = global.fetch as jest.Mock;
    
    // First save attempt fails, second succeeds
    mockFetch
      .mockImplementationOnce(() => Promise.reject(new Error('Network error')))
      .mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true })
      }));

    render(
      <HoleByHoleScorecard
        match={mockMatch}
        onClose={() => {}}
      />
    );

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Match Scorecard')).toBeInTheDocument();
    });

    // Find score input for first home player, hole 1
    const scoreInput = screen.getAllByRole('spinbutton')[0];
    
    // Enter score
    await act(async () => {
      fireEvent.change(scoreInput, { target: { value: '4' } });
    });

    // Verify error message appears
    await waitFor(() => {
      expect(screen.getByText('Failed to save score. Will retry automatically.')).toBeInTheDocument();
    });

    // Wait for retry
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(2);
    }, { timeout: 6000 }); // Wait for retry timeout
  });

  it('maintains score state during failed saves', async () => {
    const mockFetch = global.fetch as jest.Mock;
    
    // All save attempts fail
    mockFetch.mockImplementation(() => Promise.reject(new Error('Network error')));

    render(
      <HoleByHoleScorecard
        match={mockMatch}
        onClose={() => {}}
      />
    );

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Match Scorecard')).toBeInTheDocument();
    });

    // Find score input for first home player, hole 1
    const scoreInput = screen.getAllByRole('spinbutton')[0];
    
    // Enter score
    await act(async () => {
      fireEvent.change(scoreInput, { target: { value: '4' } });
    });

    // Verify score remains in input despite save failure
    expect(scoreInput).toHaveValue(4);
  });

  it('updates scores from WebSocket messages', async () => {
    const mockFetch = global.fetch as jest.Mock;
    
    // Mock new scores coming in via WebSocket
    const newScores = [
      {
        matchId: mockMatch.id,
        playerId: mockPlayers.home[0].id,
        hole: 1,
        score: 5
      }
    ];

    mockFetch
      .mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve([])
      }))
      .mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve(newScores)
      }));

    render(
      <HoleByHoleScorecard
        match={mockMatch}
        onClose={() => {}}
      />
    );

    // Wait for WebSocket update to trigger score reload
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });
}); 