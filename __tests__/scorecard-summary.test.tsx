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
    Object.defineProperty(window.screen.orientation, 'lock', {
      value: mockLock,
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
    await act(async () => {
      render(<ScorecardSummaryPage />)
    })

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Brew/Jake')).toBeInTheDocument()
    })

    // Check that all hole columns are present
    for (let i = 1; i <= 9; i++) {
      expect(screen.getByTestId(`hole-${i}-header`)).toBeInTheDocument()
    }
  })

  it('should display player scores correctly in mobile view', async () => {
    await act(async () => {
      render(<ScorecardSummaryPage />)
    })

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Brew')).toBeInTheDocument()
    })

    // Check Brew's scores
    expect(screen.getByTestId('player1-hole-1')).toHaveTextContent('4')
    expect(screen.getByTestId('player1-hole-2')).toHaveTextContent('5')
    expect(screen.getByTestId('player1-hole-3')).toHaveTextContent('3')

    // Check Jake's scores
    expect(screen.getByTestId('player2-hole-1')).toHaveTextContent('5')
    expect(screen.getByTestId('player2-hole-2')).toHaveTextContent('4')
    expect(screen.getByTestId('player2-hole-3')).toHaveTextContent('4')
  })

  it('should keep player names visible while scrolling horizontally', async () => {
    await act(async () => {
      render(<ScorecardSummaryPage />)
    })

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Brew')).toBeInTheDocument()
    })

    // Get the scrollable container
    const container = screen.getByTestId('scorecard-container')
    
    // Check that player name cells have sticky positioning
    const playerNameCells = screen.getAllByTestId('player-name-cell')
    playerNameCells.forEach(cell => {
      expect(cell).toHaveClass('sticky', 'left-0')
    })

    // Simulate horizontal scroll
    fireEvent.scroll(container, { target: { scrollLeft: 200 } })

    // Verify player names are still visible
    expect(screen.getByText('Brew')).toBeVisible()
    expect(screen.getByText('Jake')).toBeVisible()
  })

  it('should handle orientation change gracefully', async () => {
    // Mock orientation lock to fail
    const mockLock = jest.fn().mockRejectedValue(new Error('Orientation lock failed'))
    Object.defineProperty(window.screen.orientation, 'lock', {
      value: mockLock,
      writable: true
    })

    await act(async () => {
      render(<ScorecardSummaryPage />)
    })

    // Verify the page still renders
    await waitFor(() => {
      expect(screen.getByText('Brew/Jake')).toBeInTheDocument()
    })

    // Verify all content is still accessible
    for (let i = 1; i <= 9; i++) {
      expect(screen.getByTestId(`hole-${i}-header`)).toBeInTheDocument()
    }
  })
})
