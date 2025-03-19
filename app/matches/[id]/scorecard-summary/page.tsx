'use client'

import React, { useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { X } from 'lucide-react'
import { Match, Team, Player } from '../../../types'
import { calculateCourseHandicap } from '../../../lib/handicap'

interface PageParams extends Record<string, string | string[]> {
  id: string | string[];
}

export default function ScorecardSummaryPage() {
  const rawParams = useParams()
  const params: PageParams = rawParams as PageParams
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const [match, setMatch] = React.useState<Match | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  // Enter fullscreen and landscape mode on mount
  useEffect(() => {
    const setupView = async () => {
      if (containerRef.current) {
        try {
          await containerRef.current.requestFullscreen()
          if ('orientation' in window.screen && 'lock' in window.screen.orientation) {
            await window.screen.orientation.lock('landscape')
          }
        } catch (err) {
          console.error('Fullscreen or orientation error:', err)
        }
      }
    }
    
    setupView()

    // Cleanup on unmount
    return () => {
      if (document.fullscreenElement) {
        document.exitFullscreen()
      }
      if ('orientation' in window.screen && 'unlock' in window.screen.orientation) {
        window.screen.orientation.unlock()
      }
    }
  }, [])

  // Fetch match data
  useEffect(() => {
    const fetchMatch = async () => {
      try {
        const matchId = Array.isArray(params.id) ? params.id[0] : params.id
        const response = await fetch(`/api/matches/${matchId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch match')
        }
        const data = await response.json()
        setMatch(data)
        setLoading(false)
      } catch (err) {
        console.error('Error fetching match:', err)
        setError('Failed to load match data')
        setLoading(false)
      }
    }

    fetchMatch()
  }, [params.id])

  const handleClose = () => {
    router.back()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030f0f] flex items-center justify-center">
        <div className="text-white">Loading scorecard summary...</div>
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
    <div 
      ref={containerRef}
      className="min-h-screen bg-[#030f0f] relative overflow-auto"
    >
      {/* Header with match info and close button */}
      <div className="sticky top-0 z-50 bg-[#030f0f]/95 backdrop-blur-sm border-b border-[#00df82]/30 p-4 flex justify-between items-center">
        <div>
          <h2 className="text-white font-audiowide text-lg">
            {match.homeTeam.name} vs {match.awayTeam.name}
          </h2>
          <p className="text-[#00df82]/70 text-sm">
            Week {match.weekNumber} - {format(new Date(match.date), 'MMMM d, yyyy')}
          </p>
        </div>
        <button
          onClick={handleClose}
          className="group relative overflow-hidden p-2 text-white bg-gradient-to-r from-[#00df82]/40 to-[#4CAF50]/30 hover:from-[#00df82]/60 hover:to-[#4CAF50]/50 rounded-lg transition-all duration-300 border border-[#00df82]/50 hover:border-[#00df82] backdrop-blur-sm"
          aria-label="Close Scorecard Summary"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Scorecard Summary Content */}
      <div className="p-4">
        <div className="bg-[#030f0f]/90 rounded-xl backdrop-blur-sm border border-[#00df82]/20 overflow-hidden">
          {/* Add your existing scorecard summary table here */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#00df82]/10">
                  <th className="p-3 text-left text-white font-audiowide sticky left-0 bg-[#030f0f]/90">Player</th>
                  {Array.from({ length: 9 }, (_, i) => i + 1).map(hole => (
                    <th key={hole} className="p-3 text-center text-white font-audiowide min-w-[60px]">
                      {hole}
                    </th>
                  ))}
                  <th className="p-3 text-center text-white font-audiowide">Total</th>
                </tr>
              </thead>
              <tbody>
                {/* Add your player rows here */}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
