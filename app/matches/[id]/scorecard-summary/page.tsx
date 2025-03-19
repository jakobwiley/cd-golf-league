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
        // First try to lock orientation
        if ('orientation' in window.screen && 'lock' in window.screen.orientation) {
          await window.screen.orientation.lock('landscape')
        }
        // Then request fullscreen
        if (containerRef.current) {
          await containerRef.current.requestFullscreen()
        }
      } catch (err) {
        console.error('Fullscreen or orientation error:', err)
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
                  <th className="p-3 text-center text-white font-audiowide">Gross</th>
                  <th className="p-3 text-center text-white font-audiowide">Net</th>
                </tr>
              </thead>
              <tbody>
                {/* Home Team */}
                <tr className="border-b border-[#00df82]/10 bg-[#00df82]/5">
                  <td colSpan={12} className="p-2 text-left text-[#00df82] font-audiowide text-sm">
                    {match.homeTeam.name}
                  </td>
                </tr>
                {match.homeTeam.players?.map((player) => (
                  <tr key={player.id} className="border-b border-[#00df82]/10">
                    <td className="p-3 text-left text-white sticky left-0 bg-[#030f0f]/90">
                      <div>{player.name}</div>
                      <div className="text-xs text-[#00df82]/70">CHP: {player.handicapIndex}</div>
                    </td>
                    {Array.from({ length: 9 }, (_, i) => i + 1).map(hole => (
                      <td key={hole} className="p-3 text-center text-white">
                        {scores[player.id]?.find(s => s.hole === hole)?.score || '-'}
                      </td>
                    ))}
                    <td className="p-3 text-center text-white">{calculateTotal(player.id)}</td>
                    <td className="p-3 text-center text-[#00df82]">{calculateTotal(player.id)}</td>
                  </tr>
                ))}

                {/* Away Team */}
                <tr className="border-b border-[#00df82]/10 bg-[#00df82]/5">
                  <td colSpan={12} className="p-2 text-left text-[#00df82] font-audiowide text-sm">
                    {match.awayTeam.name}
                  </td>
                </tr>
                {match.awayTeam.players?.map((player) => (
                  <tr key={player.id} className="border-b border-[#00df82]/10">
                    <td className="p-3 text-left text-white sticky left-0 bg-[#030f0f]/90">
                      <div>{player.name}</div>
                      <div className="text-xs text-[#00df82]/70">CHP: {player.handicapIndex}</div>
                    </td>
                    {Array.from({ length: 9 }, (_, i) => i + 1).map(hole => (
                      <td key={hole} className="p-3 text-center text-white">
                        {scores[player.id]?.find(s => s.hole === hole)?.score || '-'}
                      </td>
                    ))}
                    <td className="p-3 text-center text-white">{calculateTotal(player.id)}</td>
                    <td className="p-3 text-center text-[#00df82]">{calculateTotal(player.id)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
