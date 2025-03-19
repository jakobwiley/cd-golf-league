'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { X } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'
import HoleByHoleScorecard, { Match as ScorecardMatch } from '../../../components/HoleByHoleScorecard'

// Create Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Team {
  id: string
  name: string
  players?: Array<{
    id: string
    name: string
    handicapIndex: number
    teamId: string
  }>
}

interface Match extends Omit<ScorecardMatch, 'homeTeam' | 'awayTeam'> {
  homeTeam: Team
  awayTeam: Team
}

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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030f0f] flex items-center justify-center">
        <div className="text-white">Loading match...</div>
      </div>
    )
  }

  if (error || !match || !match.homeTeam || !match.awayTeam) {
    return (
      <div className="min-h-screen bg-[#030f0f] flex items-center justify-center">
        <div className="text-red-500">{error || 'Match not found'}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#030f0f] relative">
      {/* Futuristic background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#00df82]/20 to-[#4CAF50]/10" />
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full bg-[url('/grid-pattern.svg')] bg-repeat bg-[length:50px_50px]" />
        </div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#00df82]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-[#4CAF50]/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="relative overflow-hidden rounded-3xl backdrop-blur-sm bg-gradient-to-r from-[#00df82]/30 to-[#4CAF50]/20 p-6 mb-8">
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent" />
            <div className="relative flex items-center justify-between">
              <div>
                <h1 className="text-white font-audiowide text-2xl mb-2">
                  {match.homeTeam.name} vs {match.awayTeam.name}
                </h1>
                <p className="text-white/70 font-light">
                  Week {match.weekNumber} - {format(new Date(match.date), 'MMMM d, yyyy')}
                </p>
              </div>
              <button
                onClick={() => router.back()}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Use the existing HoleByHoleScorecard component */}
          <HoleByHoleScorecard 
            match={match as ScorecardMatch} 
            onClose={() => router.back()} 
            isFullScreen={true}
            disableWebSocket={true}
          />
        </div>
      </div>
    </div>
  )
}
