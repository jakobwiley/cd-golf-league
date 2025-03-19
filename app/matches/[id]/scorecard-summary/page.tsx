'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { X } from 'lucide-react'
import { Match, Team, Player } from '../../../types'
import { calculateCourseHandicap } from '../../../lib/handicap'

interface PageParams extends Record<string, string | string[]> {
  id: string | string[];
}

interface PlayerScores {
  [key: string]: {
    hole: number;
    score: number;
  }[];
}

export default function ScorecardSummaryPage() {
  const rawParams = useParams()
  const params: PageParams = rawParams as PageParams
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const [match, setMatch] = React.useState<Match | null>(null)
  const [scores, setScores] = useState<PlayerScores>({})
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  // Enter landscape mode and fullscreen on mount
  useEffect(() => {
    const setupView = async () => {
      try {
        // Only try to lock orientation if the device supports it
        if ('orientation' in window.screen && 'lock' in window.screen.orientation && 'type' in window.screen.orientation) {
          try {
            await window.screen.orientation.lock('landscape')
          } catch (orientationErr) {
            console.log('Orientation lock not supported or not allowed')
          }
        }

        // Only try fullscreen if the element is available
        if (containerRef.current && document.fullscreenEnabled) {
          try {
            await containerRef.current.requestFullscreen()
          } catch (fullscreenErr) {
            console.log('Fullscreen not supported or not allowed')
          }
        }
      } catch (err) {
        console.log('View setup partially failed:', err)
      }
    }
    
    setupView()

    // Cleanup on unmount
    return () => {
      try {
        if (document.fullscreenElement) {
          document.exitFullscreen()
        }
        if ('orientation' in window.screen && 'unlock' in window.screen.orientation) {
          window.screen.orientation.unlock()
        }
      } catch (err) {
        console.log('Cleanup error:', err)
      }
    }
  }, [])

  // Fetch match data and scores
  useEffect(() => {
    const fetchData = async () => {
      try {
        const matchId = Array.isArray(params.id) ? params.id[0] : params.id
        
        // Fetch match data
        const matchResponse = await fetch(`/api/matches/${matchId}`)
        if (!matchResponse.ok) throw new Error('Failed to fetch match')
        const matchData = await matchResponse.json()
        setMatch(matchData)

        // Fetch scores
        const scoresResponse = await fetch(`/api/scores?matchId=${matchId}`)
        if (!scoresResponse.ok) throw new Error('Failed to fetch scores')
        const scoresData = await scoresResponse.json()
        setScores(scoresData)
        
        setLoading(false)
      } catch (err) {
        console.error('Error fetching data:', err)
        setError('Failed to load match data')
        setLoading(false)
      }
    }

    fetchData()
  }, [params.id])

  const calculateTotal = (playerId: string) => {
    return scores[playerId]?.reduce((total, score) => total + score.score, 0) || 0
  }

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
      className="min-h-screen bg-[#030f0f] relative"
    >
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl backdrop-blur-sm bg-gradient-to-r from-[#00df82]/30 to-[#4CAF50]/20 p-6 mb-8">
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent" />
        <div className="relative">
          <h1 className="text-white font-audiowide text-2xl mb-2">
            {match.homeTeam.name} vs {match.awayTeam.name}
          </h1>
          <p className="text-white/70 font-light">
            Week {match.weekNumber} - {format(new Date(match.date), 'MMMM d, yyyy')}
          </p>
        </div>
      </div>

      {/* Scorecard Summary Content */}
      <div className="p-4">
        <div className="bg-[#030f0f]/90 rounded-xl backdrop-blur-sm border border-[#00df82]/20">
          <div className="overflow-x-auto -mx-4 sm:mx-0" data-testid="scorecard-container">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-[#00df82]/10">
                  <thead>
                    <tr>
                      <th scope="col" className="p-3 text-left text-white font-audiowide sticky left-0 bg-[#030f0f]/90 min-w-[120px] z-10" data-testid="player-header">
                        Player
                      </th>
                      {Array.from({ length: 9 }, (_, i) => i + 1).map(hole => (
                        <th
                          key={hole}
                          scope="col"
                          className="p-3 text-center text-white font-audiowide w-16"
                          data-testid={`hole-${hole}-header`}
                        >
                          {hole}
                        </th>
                      ))}
                      <th scope="col" className="p-3 text-center text-white font-audiowide w-20">
                        Gross
                      </th>
                      <th scope="col" className="p-3 text-center text-white font-audiowide w-20">
                        Net
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#00df82]/10">
                    {/* Home Team */}
                    <tr className="bg-[#00df82]/5">
                      <td colSpan={12} className="p-2 text-left text-[#00df82] font-audiowide text-sm">
                        {match.homeTeam.name}
                      </td>
                    </tr>
                    {match.homeTeam.players?.map((player) => (
                      <tr key={player.id}>
                        <td className="p-3 text-left text-white sticky left-0 bg-[#030f0f]/90 whitespace-nowrap z-10" data-testid="player-name-cell">
                          <div>{player.name}</div>
                          <div className="text-xs text-[#00df82]/70">CHP: {calculateCourseHandicap(player.handicapIndex)}</div>
                        </td>
                        {Array.from({ length: 9 }, (_, i) => i + 1).map(hole => (
                          <td key={hole} className="p-3 text-center text-white" data-testid={`${player.id}-hole-${hole}`}>
                            {scores[player.id]?.find(s => s.hole === hole)?.score || '-'}
                          </td>
                        ))}
                        <td className="p-3 text-center text-white" data-testid={`${player.id}-gross`}>
                          {calculateTotal(player.id)}
                        </td>
                        <td className="p-3 text-center text-[#00df82]" data-testid={`${player.id}-net`}>
                          {calculateTotal(player.id)}
                        </td>
                      </tr>
                    ))}

                    {/* Away Team */}
                    <tr className="bg-[#00df82]/5">
                      <td colSpan={12} className="p-2 text-left text-[#00df82] font-audiowide text-sm">
                        {match.awayTeam.name}
                      </td>
                    </tr>
                    {match.awayTeam.players?.map((player) => (
                      <tr key={player.id}>
                        <td className="p-3 text-left text-white sticky left-0 bg-[#030f0f]/90 whitespace-nowrap z-10" data-testid="player-name-cell">
                          <div>{player.name}</div>
                          <div className="text-xs text-[#00df82]/70">CHP: {calculateCourseHandicap(player.handicapIndex)}</div>
                        </td>
                        {Array.from({ length: 9 }, (_, i) => i + 1).map(hole => (
                          <td key={hole} className="p-3 text-center text-white" data-testid={`${player.id}-hole-${hole}`}>
                            {scores[player.id]?.find(s => s.hole === hole)?.score || '-'}
                          </td>
                        ))}
                        <td className="p-3 text-center text-white" data-testid={`${player.id}-gross`}>
                          {calculateTotal(player.id)}
                        </td>
                        <td className="p-3 text-center text-[#00df82]" data-testid={`${player.id}-net`}>
                          {calculateTotal(player.id)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
