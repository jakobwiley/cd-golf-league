'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { ArrowLeft, RotateCcw } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'
import CollapsibleScorecard from '../../../components/CollapsibleScorecard';
import { getWebSocketUrl, SocketEvents } from '../../../utils/websocketConnection'

// Create Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface PageParams extends Record<string, string | string[]> {
  id: string | string[];
}

// Define a player type that includes isSubstitute
interface PlayerWithSubstitute {
  id: string
  name: string
  handicapIndex: number
  teamId: string
  playerType: "PRIMARY" | "SUBSTITUTE"
  isSubstitute: boolean
}

// Define type for match player
interface MatchPlayer {
  id: string
  matchId: string
  playerId: string
  isSubstitute: boolean
  substituteFor: string | null
  originalPlayerId: string | null
  Player: {
    id: string
    name: string
    handicapIndex: number
    teamId: string
    playerType: "PRIMARY" | "SUBSTITUTE"
  } | null
}

// Define a type for the Supabase response
interface SupabaseMatchPlayer {
  id: string
  matchId: string
  playerId: string
  isSubstitute: boolean
  substituteFor: string | null
  originalPlayerId: string | null
  Player: {
    id: string
    name: string
    handicapIndex: number
    teamId: string
    playerType: string
  } | null
}

// Define the LocalMatch type
interface LocalMatch {
  id: string
  date: string
  status: "COMPLETED" | "SCHEDULED" | "IN_PROGRESS"
  homeTeamId: string
  awayTeamId: string
  weekNumber?: number
  startingHole: number
  homeTeam: {
    id: string
    name: string
    players?: PlayerWithSubstitute[]
  }
  awayTeam: {
    id: string
    name: string
    players?: PlayerWithSubstitute[]
  }
  scores?: any[]
}

export default function ScorecardSummaryPage() {
  const rawParams = useParams()
  const params: PageParams = rawParams as PageParams
  const router = useRouter()
  const [match, setMatch] = React.useState<LocalMatch | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [isPortrait, setIsPortrait] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<number>(Date.now())
  const socketRef = useRef<WebSocket | null>(null)
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const lastFetchTimeRef = useRef<number>(0)
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Function to fetch match data with scores
  const fetchMatchData = async (force = false) => {
    // Debounce fetches to prevent too many updates
    const now = Date.now();
    if (!force && now - lastFetchTimeRef.current < 5000) {
      // If less than 5 seconds since last fetch, debounce the request
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      
      debounceTimeoutRef.current = setTimeout(() => {
        fetchMatchData(true);
      }, 5000 - (now - lastFetchTimeRef.current));
      
      return;
    }
    
    lastFetchTimeRef.current = now;
    
    // Only show loading state on initial load, not on updates
    if (!match) {
      setLoading(true)
    }
    try {
      // Fetch match details
      const { data: matchData, error: matchError } = await supabase
        .from('Match')
        .select(`
          id,
          date,
          status,
          homeTeamId,
          awayTeamId,
          weekNumber,
          startingHole,
          homeTeam:homeTeamId(id, name),
          awayTeam:awayTeamId(id, name)
        `)
        .eq('id', params.id)
        .single()

      if (matchError) throw matchError

      if (!matchData) {
        throw new Error('Match not found')
      }

      const match = matchData as unknown as LocalMatch

      // Fetch players for this match
      const { data: matchPlayers, error: matchPlayersError } = await supabase
        .from('MatchPlayer')
        .select(`
          id,
          matchId,
          playerId,
          isSubstitute,
          substituteFor,
          originalPlayerId,
          Player:playerId(id, name, handicapIndex, teamId, playerType)
        `)
        .eq('matchId', params.id)

      if (matchPlayersError) throw matchPlayersError

      // Group players by team
      const homeTeamPlayers: PlayerWithSubstitute[] = []
      const awayTeamPlayers: PlayerWithSubstitute[] = []

      // Process match players and handle substitutes
      if (matchPlayers && matchPlayers.length > 0) {
        // Type the matchPlayers array - first convert to unknown then to our type
        const typedMatchPlayers = (matchPlayers as unknown) as SupabaseMatchPlayer[];
        
        // Filter players by team
        const homePlayers = typedMatchPlayers.filter(mp => mp.Player && mp.Player.teamId === match.homeTeamId)
        const awayPlayers = typedMatchPlayers.filter(mp => mp.Player && mp.Player.teamId === match.awayTeamId)

        // Process home team players
        const homePrimaryPlayers: PlayerWithSubstitute[] = homePlayers
          .filter(mp => !mp.isSubstitute && mp.Player)
          .map(mp => ({
            id: mp.Player!.id,
            name: mp.Player!.name,
            handicapIndex: mp.Player!.handicapIndex,
            teamId: mp.Player!.teamId,
            playerType: mp.Player!.playerType as "PRIMARY" | "SUBSTITUTE",
            isSubstitute: false
          }));

        const homeSubstitutes: PlayerWithSubstitute[] = homePlayers
          .filter(mp => mp.isSubstitute && mp.Player)
          .map(mp => ({
            id: mp.Player!.id,
            name: mp.Player!.name,
            handicapIndex: mp.Player!.handicapIndex,
            teamId: mp.Player!.teamId,
            playerType: mp.Player!.playerType as "PRIMARY" | "SUBSTITUTE",
            isSubstitute: true
          }));

        // Process away team players
        const awayPrimaryPlayers: PlayerWithSubstitute[] = awayPlayers
          .filter(mp => !mp.isSubstitute && mp.Player)
          .map(mp => ({
            id: mp.Player!.id,
            name: mp.Player!.name,
            handicapIndex: mp.Player!.handicapIndex,
            teamId: mp.Player!.teamId,
            playerType: mp.Player!.playerType as "PRIMARY" | "SUBSTITUTE",
            isSubstitute: false
          }));

        const awaySubstitutes: PlayerWithSubstitute[] = awayPlayers
          .filter(mp => mp.isSubstitute && mp.Player)
          .map(mp => ({
            id: mp.Player!.id,
            name: mp.Player!.name,
            handicapIndex: mp.Player!.handicapIndex,
            teamId: mp.Player!.teamId,
            playerType: mp.Player!.playerType as "PRIMARY" | "SUBSTITUTE",
            isSubstitute: true
          }));

        // Add all players to their respective teams
        homeTeamPlayers.push(...homePrimaryPlayers);
        
        // Determine active players (primary or substitutes)
        if (homeSubstitutes.length > 0) {
          homeTeamPlayers.push(...homeSubstitutes);
        }
        
        awayTeamPlayers.push(...awayPrimaryPlayers);
        
        if (awaySubstitutes.length > 0) {
          awayTeamPlayers.push(...awaySubstitutes);
        }
      }
      
      // Ensure we only have 2 players per team
      const finalHomePlayers = homeTeamPlayers.slice(0, 2)
      const finalAwayPlayers = awayTeamPlayers.slice(0, 2)
      
      // Attach players to the teams
      if (match.homeTeam) {
        match.homeTeam.players = finalHomePlayers
      }
      if (match.awayTeam) {
        match.awayTeam.players = finalAwayPlayers
      }
      
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
      
      // Update state in a way that minimizes re-renders
      const now = Date.now();
      
      // Only do a full update on initial load or if it's been more than 30 seconds
      if (!match || !lastUpdated || (now - lastUpdated > 30000)) {
        setMatch(match as LocalMatch);
        setLastUpdated(now);
      } else {
        // For more frequent updates, just update the scores to prevent full re-renders
        setMatch(prevMatch => {
          if (!prevMatch) return match as LocalMatch;
          
          // Create a shallow copy to avoid unnecessary re-renders
          const updatedMatch = { ...prevMatch };
          updatedMatch.scores = scores;
          
          return updatedMatch;
        });
      }
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
              // Use the debounced fetch to prevent flashing
              fetchMatchData(false);
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
          // Use the debounced fetch to prevent flashing
          fetchMatchData(false);
        }, 30000); // Poll every 30 seconds instead of 10 to reduce updates
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
      
      // Clear any pending debounce timeouts
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
        debounceTimeoutRef.current = null;
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
    // If match is completed, go to matches list
    if (match && match.status === 'COMPLETED') {
      router.push('/matches')
    } else {
      // Otherwise go back to the specific match
      router.push(`/matches/${params.id}`)
    }
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
                {match && match.status === 'COMPLETED' 
                  ? 'Back to Matches' 
                  : 'Back to Match'}
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
          
          {/* Hidden but useful for debugging */}
          <div className="hidden text-xs text-gray-500 text-right">
            Last updated: {new Date(lastUpdated).toLocaleTimeString()}
          </div>
          
          {match && (
            <div className="bg-[#030f0f]/70 border border-[#00df82]/20 rounded-lg overflow-hidden transition-opacity duration-300 ease-in-out">
              <CollapsibleScorecard match={match as any} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
