'use client'

import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import HoleByHoleScorecard from '../../components/HoleByHoleScorecard'
import MatchPointTracker from '../../components/MatchPointTracker'
import { CheckCircle } from 'lucide-react';
import { Match } from '../../types'

export default function MatchPage() {
  const rawParams = useParams()
  const params = rawParams as { id: string }
  const router = useRouter()
  const [match, setMatch] = React.useState<Match | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [homePoints, setHomePoints] = useState(0)
  const [awayPoints, setAwayPoints] = useState(0)

  React.useEffect(() => {
    const fetchMatch = async () => {
      try {
        const response = await fetch(`/api/matches/${params.id}`)
        if (!response.ok) throw new Error('Failed to fetch match')
        const data = await response.json()
        
        // Ensure players are loaded for the match
        if (!data.homeTeam.players || !data.awayTeam.players) {
          // Fetch primary players for both teams
          const homePlayersResponse = await fetch(`/api/players?teamId=${data.homeTeamId}&playerType=PRIMARY`)
          const awayPlayersResponse = await fetch(`/api/players?teamId=${data.awayTeamId}&playerType=PRIMARY`)
          
          if (homePlayersResponse.ok && awayPlayersResponse.ok) {
            const homePlayersData = await homePlayersResponse.json()
            const awayPlayersData = await awayPlayersResponse.json()
            
            data.homeTeam.players = homePlayersData.players || []
            data.awayTeam.players = awayPlayersData.players || []
          }
        }
        
        setMatch(data)
      } catch (err) {
        console.error('Error fetching match:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchMatch()
  }, [params.id])

  // Function to update points from the HoleByHoleScorecard
  const updatePoints = (home: number, away: number) => {
    setHomePoints(home)
    setAwayPoints(away)
  }

  const handleViewScorecard = () => {
    router.push(`/matches/${params.id}/scorecard-summary`);
  };

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
      
      <div className="relative z-10 pt-8">
        <div className="relative">
          {/* Remove the duplicate FINALIZED badge since MatchPointTracker already shows it */}
          <MatchPointTracker 
            match={match}
            homePoints={homePoints}
            awayPoints={awayPoints}
            onViewScorecard={handleViewScorecard}
          />
        </div>
        <HoleByHoleScorecard 
          match={match} 
          onPointsUpdate={updatePoints}
          onClose={() => router.push('/matches')}
          onViewScorecard={handleViewScorecard}
        />
      </div>
    </div>
  )
}
