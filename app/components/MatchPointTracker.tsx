'use client'

import React from 'react'
import { Match } from '../types'
import { ClipboardList } from 'lucide-react'

interface MatchPointTrackerProps {
  match: Match
  homePoints: number
  awayPoints: number
  onViewScorecard?: () => void
}

export default function MatchPointTracker({ match, homePoints, awayPoints, onViewScorecard }: MatchPointTrackerProps) {
  if (!match || !match.homeTeam || !match.awayTeam) {
    return null
  }

  return (
    <div className="max-w-6xl mx-auto mb-2 md:mb-4 relative" data-component-name="MatchPointTracker">
      {/* Futuristic background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden rounded-lg">
        <div className="absolute inset-0 bg-gradient-to-br from-[#00df82]/20 to-[#4CAF50]/10" />
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full bg-[url('/grid-pattern.svg')] bg-repeat bg-[length:50px_50px]" />
        </div>
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-[#00df82]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/3 w-48 h-48 bg-[#4CAF50]/10 rounded-full blur-3xl" />
      </div>

      <div className="relative overflow-hidden rounded-lg backdrop-blur-sm bg-gradient-to-r from-[#00df82]/30 to-[#4CAF50]/20 border border-[#00df82]/20 p-2 md:p-4 shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-2xl transform translate-x-1/4 -translate-y-1/4"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-black/20 to-transparent rounded-full blur-xl transform -translate-x-1/4 translate-y-1/4"></div>
        
        <div className="relative">
          <h2 className="text-sm md:text-xl font-audiowide text-white text-center mb-1 md:mb-4">Match Scorecard</h2>
          
          <div className="bg-[#001a0d]/80 border border-[#00df82]/10 rounded-lg p-2 md:p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              {/* Home Team */}
              <div className="flex flex-col items-center space-y-0 md:space-y-1 flex-1">
                <div className="text-xs md:text-md font-orbitron text-white">{match.homeTeam.name}</div>
                <div className="text-3xl md:text-5xl font-audiowide text-[#00df82]">{Number(homePoints).toFixed(1)}</div>
              </div>
              
              {/* Divider */}
              <div className="text-lg md:text-xl font-audiowide text-[#00df82] mx-2 md:mx-4">vs</div>
              
              {/* Away Team */}
              <div className="flex flex-col items-center space-y-0 md:space-y-1 flex-1">
                <div className="text-xs md:text-md font-orbitron text-white">{match.awayTeam.name}</div>
                <div className="text-3xl md:text-5xl font-audiowide text-[#00df82]">{Number(awayPoints).toFixed(1)}</div>
              </div>
            </div>
          </div>
          
          {onViewScorecard && (
            <div className="mt-3 md:mt-6">
              <button 
                onClick={onViewScorecard}
                className="w-full group relative overflow-hidden px-3 md:px-5 py-2 text-white bg-gradient-to-r from-[#00df82]/20 to-[#4CAF50]/10 hover:from-[#00df82]/40 hover:to-[#4CAF50]/30 rounded-lg transition-all duration-300 border border-[#00df82]/30 hover:border-[#00df82] backdrop-blur-sm text-sm font-audiowide shadow-[0_0_10px_rgba(0,223,130,0.2)] hover:shadow-[0_0_15px_rgba(0,223,130,0.4)] transform hover:scale-105"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-[#00df82]/10 to-transparent skew-x-15 group-hover:animate-shimmer"></div>
                <span className="relative flex items-center justify-center">
                  <ClipboardList className="w-4 h-4 mr-2" />
                  View Scorecard
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
