'use client'

import React, { useEffect, useState } from 'react'
import { Match } from '../types'
import MatchPointTracker from './MatchPointTracker'

interface MatchScoreTrackerProps {
  match: Match
  onViewScorecard: () => void
}

interface ScoreData {
  playerId: string
  hole: number
  score: number
}

export default function MatchScoreTracker({ match, onViewScorecard }: MatchScoreTrackerProps) {
  const [homePoints, setHomePoints] = useState(0)
  const [awayPoints, setAwayPoints] = useState(0)
  const [loading, setLoading] = useState(true)

  // Fetch scores directly from the API
  useEffect(() => {
    const fetchScores = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/scores?matchId=${match.id}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache'
          }
        })

        if (!response.ok) {
          throw new Error('Failed to fetch scores')
        }

        const scores = await response.json() as ScoreData[]
        
        // Get unique holes with scores
        const holes = Array.from(new Set(scores.map((s: ScoreData) => s.hole))).sort((a: number, b: number) => a - b)
        
        // Get players for each team
        const matchResponse = await fetch(`/api/matches/${match.id}`)
        if (!matchResponse.ok) {
          throw new Error('Failed to fetch match details')
        }
        
        const matchDetails = await matchResponse.json()
        
        // Organize scores by player and hole
        const playerScores: Record<string, Record<number, number>> = {}
        
        scores.forEach((score: ScoreData) => {
          if (!playerScores[score.playerId]) {
            playerScores[score.playerId] = {}
          }
          playerScores[score.playerId][score.hole] = score.score
        })
        
        // Calculate points for each hole
        let totalHomePoints = 0
        let totalAwayPoints = 0
        
        holes.forEach(hole => {
          // Get scores for this hole
          const homeTeamScores: number[] = []
          const awayTeamScores: number[] = []
          
          // Get home team scores
          matchDetails.homeTeam?.players?.forEach((player: any) => {
            const score = playerScores[player.id]?.[hole]
            if (score !== undefined) {
              homeTeamScores.push(score)
            }
          })
          
          // Get away team scores
          matchDetails.awayTeam?.players?.forEach((player: any) => {
            const score = playerScores[player.id]?.[hole]
            if (score !== undefined) {
              awayTeamScores.push(score)
            }
          })
          
          // Skip if either team doesn't have scores
          if (homeTeamScores.length === 0 || awayTeamScores.length === 0) {
            return
          }
          
          // Find the best (lowest) score for each team
          const bestHomeScore = Math.min(...homeTeamScores)
          const bestAwayScore = Math.min(...awayTeamScores)
          
          // Award points based on the best scores
          if (bestHomeScore < bestAwayScore) {
            totalHomePoints += 1
          } else if (bestAwayScore < bestHomeScore) {
            totalAwayPoints += 1
          } else {
            // Tie - each team gets 0.5 points
            totalHomePoints += 0.5
            totalAwayPoints += 0.5
          }
        })
        
        setHomePoints(totalHomePoints)
        setAwayPoints(totalAwayPoints)
      } catch (error) {
        console.error('Error fetching scores:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchScores()
    
    // Set up interval to refresh scores every 30 seconds
    const interval = setInterval(() => {
      fetchScores()
    }, 30000)
    
    return () => clearInterval(interval)
  }, [match.id])

  return (
    <MatchPointTracker
      match={match}
      homePoints={homePoints}
      awayPoints={awayPoints}
      onViewScorecard={onViewScorecard}
    />
  )
}
