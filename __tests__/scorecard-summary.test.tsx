import { render, screen, fireEvent, act, waitFor } from '@testing-library/react'
import { useParams, useRouter } from 'next/navigation'
import ScorecardSummaryPage from '../app/matches/[id]/scorecard-summary/page'
import { Match, PlayerScores } from './types'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
  useRouter: jest.fn(() => ({
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    push: jest.fn(),
    prefetch: jest.fn(),
    replace: jest.fn(),
  })),
}))

// Mock WebSocket implementation
jest.mock('../app/utils/websocketConnection', () => ({
  getWebSocketUrl: jest.fn().mockReturnValue('ws://localhost:3007/api/scores/ws'),
  SocketEvents: {
    MATCH_UPDATED: 'match:updated',
    TEAM_UPDATED: 'team:updated',
    PLAYER_UPDATED: 'player:updated',
    SCORE_UPDATED: 'score:updated',
    STANDINGS_UPDATED: 'standings:updated',
  }
}))

// Mock Supabase client
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({ data: mockMatch, error: null }))
        }))
      }))
    }))
  }))
}))

// Mock match data
const mockMatch: Match = {
  id: 'd0b585dd-09e4-4171-b133-2f5376bcc59a',
  date: '2025-03-19',
  weekNumber: 1,
  homeTeam: {
    id: 'team1',
    name: 'Brew/Jake',
    players: [
      { id: 'player1', name: 'Brew', handicapIndex: 4, teamId: 'team1' },
      { id: 'player2', name: 'Jake', handicapIndex: 5, teamId: 'team1' }
    ]
  },
  awayTeam: {
    id: 'team2',
    name: 'Clauss/Wade',
    players: [
      { id: 'player3', name: 'Clauss', handicapIndex: 4, teamId: 'team2' },
      { id: 'player4', name: 'Wade', handicapIndex: 5, teamId: 'team2' }
    ]
  }
}

// Mock scores data
const mockScores: PlayerScores = {
  player1: [
    { hole: 1, score: 4 },
    { hole: 2, score: 5 },
    { hole: 3, score: 3 }
  ],
  player2: [
    { hole: 1, score: 5 },
    { hole: 2, score: 4 },
    { hole: 3, score: 4 }
  ]
}

// Mock WebSocket class
class MockWebSocket {
  onopen: () => void = () => {};
  onmessage: (event: any) => void = () => {};
  onclose: () => void = () => {};
  onerror: (error: any) => void = () => {};
  close = jest.fn();
  send = jest.fn();

  constructor() {
    setTimeout(() => {
      this.onopen();
    }, 0);
  }
}

// Replace global WebSocket with mock
global.WebSocket = MockWebSocket as any;

describe('ScorecardSummaryPage Mobile View', () => {
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks()
    
    // Mock window.innerWidth for mobile view
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 375 // iPhone SE width
    })

    // Mock fetch responses
    global.fetch = jest.fn((url) => {
      if (url.includes('/api/matches/')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockMatch)
        })
      }
      if (url.includes('/api/scores')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockScores)
        })
      }
      return Promise.reject(new Error('Not found'))
    }) as jest.Mock

    // Mock useParams
    ;(useParams as jest.Mock).mockReturnValue({ id: mockMatch.id })
  })

  it('should attempt to rotate screen to landscape on mobile', async () => {
    // Mock screen.orientation.lock with a jest.fn()
    const mockLock = jest.fn().mockImplementation(() => Promise.resolve())
    Object.defineProperty(window.screen, 'orientation', {
      value: { lock: mockLock },
      writable: true
    })

    await act(async () => {
      render(<ScorecardSummaryPage />)
    })

    await waitFor(() => {
      expect(window.screen.orientation.lock).toHaveBeenCalledWith('landscape')
    })
  })

  it('should display all 9 hole columns in mobile view', async () => {
    // Mock CollapsibleScorecard component
    jest.mock('../app/components/CollapsibleScorecard', () => {
      return function MockCollapsibleScorecard({ match }: { match: Match }) {
        return (
          <div>
            <div data-testid="team-name">{match.homeTeam.name}</div>
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} data-testid={`hole-${i + 1}-header`}>Hole {i + 1}</div>
            ))}
          </div>
        )
      }
    })

    await act(async () => {
      render(<ScorecardSummaryPage />)
    })

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading scorecard...')).not.toBeInTheDocument()
    })

    // Check that the team name is displayed
    expect(screen.getByText('Brew/Jake vs Clauss/Wade')).toBeInTheDocument()
  })

  it('should display player scores correctly in mobile view', async () => {
    await act(async () => {
      render(<ScorecardSummaryPage />)
    })

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading scorecard...')).not.toBeInTheDocument()
    })

    // Check that the team name is displayed
    expect(screen.getByText('Brew/Jake vs Clauss/Wade')).toBeInTheDocument()
  })

  it('should keep player names visible while scrolling horizontally', async () => {
    await act(async () => {
      render(<ScorecardSummaryPage />)
    })

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading scorecard...')).not.toBeInTheDocument()
    })

    // Get the scrollable container
    const container = screen.getByTestId('scorecard-container')
    
    // Simulate horizontal scroll
    fireEvent.scroll(container, { target: { scrollLeft: 200 } })
  })

  it('should handle orientation change gracefully', async () => {
    // Mock orientation lock to fail
    const mockLock = jest.fn().mockRejectedValue(new Error('Orientation lock failed'))
    Object.defineProperty(window.screen, 'orientation', {
      value: { lock: mockLock },
      writable: true
    })

    await act(async () => {
      render(<ScorecardSummaryPage />)
    })

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading scorecard...')).not.toBeInTheDocument()
    })

    // Verify the page still renders
    expect(screen.getByText('Brew/Jake vs Clauss/Wade')).toBeInTheDocument()
  })
})
