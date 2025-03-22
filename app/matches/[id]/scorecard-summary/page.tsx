'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { ArrowLeft, RotateCcw } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'
import CollapsibleScorecard from '../../../components/CollapsibleScorecard';
import { Match } from '../../../types'

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

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        const { data: match, error } = await supabase
          .from('Match')
          .select('*, homeTeam:Team!Match_homeTeamId_fkey(*, players:Player(id, name, handicapIndex, teamId)), awayTeam:Team!Match_awayTeamId_fkey(*, players:Player(id, name, handicapIndex, teamId))')
          .eq('id', params.id)
          .single()

        if (error) throw error
        if (!match) throw new Error('Match not found')
        
        setMatch(match as Match)
      } catch (error) {
        console.error('Error fetching match:', error)
        setError('Failed to load match')
      } finally {
        setLoading(false)
      }
    }

    fetchMatch()
  }, [params.id])

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
    router.push(`/matches/${params.id}`)
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
                Back to Match
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
