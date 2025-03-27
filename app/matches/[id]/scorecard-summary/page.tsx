'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { ArrowLeft, RotateCcw } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'
import CollapsibleScorecard from '../../../components/CollapsibleScorecard';
import { Match } from '../../../types'
import { getWebSocketUrl, SocketEvents } from '../../../utils/websocketConnection'

// Create Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface PageParams extends Record<string, string | string[]> {
  id: string | string[];
}

export default function ScorecardSummaryPage() {
  const rawParams = useParams()
  const params: PageParams = rawParams as PageParams
  const router = useRouter()
  const [match, setMatch] = React.useState<Match | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [isPortrait, setIsPortrait] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<number>(Date.now())
  const socketRef = useRef<WebSocket | null>(null)
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Function to fetch match data with scores
  const fetchMatchData = async () => {
    try {
      // First get the basic match data
      const { data: match, error } = await supabase
        .from('Match')
        .select(`
          *,
          homeTeam:homeTeamId (
            id, 
            name
          ),
          awayTeam:awayTeamId (
            id,
            name
          )
        `)
        .eq('id', params.id)
        .single()

      if (error) throw error
      if (!match) throw new Error('Match not found')
      
      // Then get only PRIMARY players for each team
      const { data: homePlayers, error: homePlayersError } = await supabase
        .from('Player')
        .select('id, name, handicapIndex, teamId, playerType')
        .eq('teamId', match.homeTeamId)
        .eq('playerType', 'PRIMARY')
        .limit(2)
      
      if (homePlayersError) throw homePlayersError
      
      const { data: awayPlayers, error: awayPlayersError } = await supabase
        .from('Player')
        .select('id, name, handicapIndex, teamId, playerType')
        .eq('teamId', match.awayTeamId)
        .eq('playerType', 'PRIMARY')
        .limit(2)
      
      if (awayPlayersError) throw awayPlayersError
      
      // Attach players to the teams
      match.homeTeam.players = homePlayers || []
      match.awayTeam.players = awayPlayers || []
      
      // Fetch scores for this match
      const scoresResponse = await fetch(`/api/scores?matchId=${params.id}`, {
        cache: 'no-store'
      })
      
      if (!scoresResponse.ok) {
        throw new Error('Failed to fetch scores')
      }
      
      const scores = await scoresResponse.json()
      
      // Attach scores to the match object
      match.scores = scores
      
      setMatch(match as Match)
      setLastUpdated(Date.now())
    } catch (error) {
      console.error('Error fetching match:', error)
      setError('Failed to load match')
    } finally {
      setLoading(false)
    }
  }

  // Initial data fetch
  useEffect(() => {
    fetchMatchData()
  }, [params.id])

  // Setup real-time updates
  useEffect(() => {
    // Try to connect to WebSocket for real-time updates
    const connectWebSocket = () => {
      try {
        // Use the consolidated WebSocket URL function
        const wsUrl = getWebSocketUrl();
        
        console.log(`Connecting to WebSocket at ${wsUrl}`);
        const ws = new WebSocket(wsUrl);
        
        ws.onopen = () => {
          console.log('WebSocket connection established');
          // Clear polling interval if it exists
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
          }
        };
        
        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.event === SocketEvents.SCORE_UPDATED && data.matchId === params.id) {
              console.log('Received score update via WebSocket');
              fetchMatchData();
            }
          } catch (error) {
            console.error('Error processing WebSocket message:', error);
          }
        };
        
        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          // Fall back to polling if WebSocket fails
          setupPolling();
        };
        
        ws.onclose = () => {
          console.log('WebSocket connection closed');
          // Fall back to polling if WebSocket closes
          setupPolling();
        };
        
        socketRef.current = ws;
      } catch (error) {
        console.error('Error setting up WebSocket:', error);
        // Fall back to polling if WebSocket setup fails
        setupPolling();
      }
    };
    
    // Fallback to polling if WebSocket is not available
    const setupPolling = () => {
      if (!pollingIntervalRef.current) {
        console.log('Setting up polling for score updates');
        pollingIntervalRef.current = setInterval(() => {
          console.log('Polling for score updates');
          fetchMatchData();
        }, 5000); // Poll every 5 seconds
      }
    };
    
    // Start with WebSocket
    connectWebSocket();
    
    // Cleanup function
    return () => {
      // Close WebSocket connection
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
      
      // Clear polling interval
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [params.id]);

  // Handle orientation detection
  useEffect(() => {
    const checkOrientation = () => {
      setIsPortrait(window.innerHeight > window.innerWidth)
    }
    
    // Check orientation on initial load
    checkOrientation()
    
    // Add event listener for orientation changes
    window.addEventListener('resize', checkOrientation)
    
    // Clean up event listener
    return () => {
      window.removeEventListener('resize', checkOrientation)
    }
  }, [])

  const goBackToMatch = () => {
    router.push(`/matches`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030f0f] flex items-center justify-center relative overflow-hidden">
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
        <div className="text-white relative z-10">Loading match...</div>
      </div>
    )
  }

  if (error || !match || !match.homeTeam || !match.awayTeam) {
    return (
      <div className="min-h-screen bg-[#030f0f] flex items-center justify-center relative overflow-hidden">
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
        <div className="text-red-500 relative z-10">{error || 'Match not found'}</div>
      </div>
    )
  }

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
      
      <div className="relative z-10">
        <div className="max-w-6xl mx-auto py-8" data-component-name="ScorecardSummaryPage">
          <div className="flex items-center justify-between p-4 bg-[#030f0f]/70 border-b border-[#00df82]/20" data-component-name="ScorecardSummaryPage">
            <h2 className="text-xl font-audiowide text-white" data-component-name="ScorecardSummaryPage">Scorecard Summary</h2>
            <button 
              onClick={goBackToMatch}
              className="group relative overflow-hidden px-5 py-2 text-white bg-gradient-to-r from-[#00df82]/40 to-[#4CAF50]/30 hover:from-[#00df82]/60 hover:to-[#4CAF50]/50 rounded-lg transition-all duration-300 border border-[#00df82]/50 hover:border-[#00df82] backdrop-blur-sm text-sm font-audiowide shadow-[0_0_15px_rgba(0,223,130,0.3)] hover:shadow-[0_0_20px_rgba(0,223,130,0.5)] transform hover:scale-105"
              data-component-name="ScorecardSummaryPage"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#00df82]/20 to-transparent opacity-50"></div>
              <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-[#00df82]/20 to-transparent skew-x-15 group-hover:animate-shimmer"></div>
              <span className="relative flex items-center">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Matches
              </span>
            </button>
          </div>
          
          {/* Mobile orientation message */}
          {isPortrait && (
            <div className="md:hidden fixed inset-0 bg-[#030f0f]/90 z-50 flex flex-col items-center justify-center p-6 text-center">
              <RotateCcw className="w-16 h-16 text-[#00df82] mb-4 animate-pulse transform rotate-90" />
              <h3 className="text-xl font-audiowide text-white mb-2">Please Rotate Your Device</h3>
              <p className="text-[#00df82]/70 max-w-xs">
                For the best experience viewing the scorecard, please rotate your device to landscape orientation.
              </p>
            </div>
          )}
          
          {match && (
            <div className="bg-[#030f0f]/70 border border-[#00df82]/20 rounded-lg overflow-hidden">
              <CollapsibleScorecard match={match} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
