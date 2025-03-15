'use client'

import React, { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { holeHandicaps, calculateCourseHandicap } from '../lib/handicap'

interface Player {
  id: string
  name: string
  handicapIndex: number
  teamId: string
}

interface Team {
  id: string
  name: string
  players?: Player[]
}

interface Match {
  id: string
  date: string
  weekNumber: number
  homeTeamId: string
  awayTeamId: string
  homeTeam: Team
  awayTeam: Team
  startingHole: number
  status: string
}

interface HoleScore {
  hole: number
  score: number
}

interface PlayerScores {
  [playerId: string]: HoleScore[]
}

interface HoleByHoleScorecardProps {
  match: Match
  onClose?: () => void
}

// Fallback player data in case the API doesn't return players
const fallbackPlayerData = [
  { id: 'player1', name: 'AP', handicapIndex: 7.3, teamId: 'team8', playerType: 'PRIMARY' },
  { id: 'player2', name: 'JohnP', handicapIndex: 21.4, teamId: 'team8', playerType: 'PRIMARY' },
  
  { id: 'player3', name: 'Brett', handicapIndex: 10.3, teamId: 'team10', playerType: 'PRIMARY' },
  { id: 'player4', name: 'Tony', handicapIndex: 14.1, teamId: 'team10', playerType: 'PRIMARY' },
  
  { id: 'player5', name: 'Drew', handicapIndex: 10.6, teamId: 'team7', playerType: 'PRIMARY' },
  { id: 'player6', name: 'Ryan', handicapIndex: 13.9, teamId: 'team7', playerType: 'PRIMARY' },
  
  { id: 'player7', name: 'Nick', handicapIndex: 11.3, teamId: 'team1', playerType: 'PRIMARY' },
  { id: 'player8', name: 'Brent', handicapIndex: 12.0, teamId: 'team1', playerType: 'PRIMARY' },
  
  { id: 'player9', name: 'Huerter', handicapIndex: 11.8, teamId: 'team2', playerType: 'PRIMARY' },
  { id: 'player10', name: 'Hot', handicapIndex: 17.2, teamId: 'team2', playerType: 'PRIMARY' },
  
  { id: 'player11', name: 'Sketch', handicapIndex: 11.9, teamId: 'team5', playerType: 'PRIMARY' },
  { id: 'player12', name: 'Rob', handicapIndex: 18.1, teamId: 'team5', playerType: 'PRIMARY' },
  
  { id: 'player13', name: 'Clauss', handicapIndex: 12.5, teamId: 'team9', playerType: 'PRIMARY' },
  { id: 'player14', name: 'Wade', handicapIndex: 15.0, teamId: 'team9', playerType: 'PRIMARY' },
  
  { id: 'player15', name: 'Murph', handicapIndex: 12.6, teamId: 'team6', playerType: 'PRIMARY' },
  { id: 'player16', name: 'Trev', handicapIndex: 16.0, teamId: 'team6', playerType: 'PRIMARY' },
  
  { id: 'player17', name: 'Brew', handicapIndex: 13.4, teamId: 'team4', playerType: 'PRIMARY' },
  { id: 'player18', name: 'Jake', handicapIndex: 16.7, teamId: 'team4', playerType: 'PRIMARY' },
  
  { id: 'player19', name: 'Ashley', handicapIndex: 40.6, teamId: 'team3', playerType: 'PRIMARY' },
  { id: 'player20', name: 'Alli', handicapIndex: 30.0, teamId: 'team3', playerType: 'PRIMARY' }
];

// Calculate strokes given for a player on a specific hole
function calculateStrokesGiven(courseHandicap: number, holeHandicap: number): number {
  if (courseHandicap <= 0) return 0;
  
  // First allocation: one stroke per hole starting from the hardest hole
  // until all strokes are allocated
  const firstAllocation = holeHandicap <= courseHandicap ? 1 : 0;
  
  // Second allocation: if player gets more than 18 strokes, they get 
  // additional strokes starting from the hardest hole again
  const secondAllocation = holeHandicap <= (courseHandicap - 18) ? 1 : 0;
  
  // Third allocation: if player gets more than 36 strokes
  const thirdAllocation = holeHandicap <= (courseHandicap - 36) ? 1 : 0;
  
  return firstAllocation + secondAllocation + thirdAllocation;
}

// Calculate net score for a player on a specific hole
function calculateNetScore(grossScore: number, strokesGiven: number): number {
  if (grossScore <= 0) return 0; // No score entered yet
  return Math.max(1, grossScore - strokesGiven); // Net score can't be less than 1
}

// Calculate if a player gets a stroke on a specific hole
const getStrokesGiven = (handicapIndex: number, hole: number) => {
  const courseHandicap = calculateCourseHandicap(handicapIndex);
  const holeHandicapValue = holeHandicaps[hole as keyof typeof holeHandicaps];
  
  // Use the existing calculateStrokesGiven function which has the correct USGA logic
  return calculateStrokesGiven(courseHandicap, holeHandicapValue);
}

// Add a function to calculate strokes given based on matchup
const getStrokesGivenForMatchup = (playerHandicapIndex: number, hole: number, allPlayers: Player[]) => {
  // Calculate course handicaps for all players
  const courseHandicaps = allPlayers.map(player => calculateCourseHandicap(player.handicapIndex));
  
  // Find the lowest course handicap in the match
  const lowestCourseHandicap = Math.min(...courseHandicaps);
  
  // Calculate the player's course handicap
  const playerCourseHandicap = calculateCourseHandicap(playerHandicapIndex);
  
  // Calculate the difference between player's handicap and the lowest handicap
  const handicapDifference = playerCourseHandicap - lowestCourseHandicap;
  
  // If player has the lowest handicap or negative difference, they get no strokes
  if (handicapDifference <= 0) return 0;
  
  // Get the hole's handicap value (difficulty rating 1-9)
  const holeHandicapValue = holeHandicaps[hole as keyof typeof holeHandicaps];
  
  // First allocation: one stroke per hole starting from the hardest hole
  // until all strokes are allocated
  const firstAllocation = holeHandicapValue <= handicapDifference ? 1 : 0;
  
  // Second allocation: if player gets more than 9 strokes, they get 
  // additional strokes starting from the hardest hole again
  const secondAllocation = holeHandicapValue <= (handicapDifference - 9) ? 1 : 0;
  
  // Third allocation: if player gets more than 18 strokes
  const thirdAllocation = holeHandicapValue <= (handicapDifference - 18) ? 1 : 0;
  
  // Return the total number of strokes given on this hole
  return firstAllocation + secondAllocation + thirdAllocation;
}

export default function HoleByHoleScorecard({ match, onClose }: HoleByHoleScorecardProps) {
  const [homeTeamPlayers, setHomeTeamPlayers] = useState<Player[]>([])
  const [awayTeamPlayers, setAwayTeamPlayers] = useState<Player[]>([])
  const [allPlayers, setAllPlayers] = useState<Player[]>([])
  const [playerScores, setPlayerScores] = useState<PlayerScores>({})
  const [activeHole, setActiveHole] = useState<number>(match.startingHole)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [scorecardExpanded, setScorecardExpanded] = useState<boolean>(false)
  // New state variables for match scoring
  const [holePoints, setHolePoints] = useState<{[hole: number]: {home: number, away: number}}>({})
  const [totalPoints, setTotalPoints] = useState<{home: number, away: number}>({home: 0, away: 0})

  // Array of holes 1-9
  const holes = Array.from({ length: 9 }, (_, i) => i + 1)

  // Par values for each hole at Country Drive
  const parValues = {
    1: 4,
    2: 4,
    3: 3,
    4: 4,
    5: 5,
    6: 3,
    7: 4,
    8: 5,
    9: 4
  }

  // Calculate the net score for a player on a specific hole
  const getPlayerNetScore = (playerId: string, hole: number): number | null => {
    const score = playerScores[playerId]?.[hole - 1]?.score;
    if (!score) return null;
    
    const player = [...homeTeamPlayers, ...awayTeamPlayers].find(p => p.id === playerId);
    if (!player) return null;
    
    const strokesGiven = getStrokesGivenForMatchup(player.handicapIndex, hole, allPlayers);
    return calculateNetScore(score, strokesGiven);
  }

  // Determine which team wins the point for a hole
  const calculateHoleWinner = (hole: number) => {
    const homeNetScores = homeTeamPlayers
      .map(player => ({
        playerId: player.id,
        netScore: getPlayerNetScore(player.id, hole)
      }))
      .filter(score => score.netScore !== null) as {playerId: string, netScore: number}[];
    
    const awayNetScores = awayTeamPlayers
      .map(player => ({
        playerId: player.id,
        netScore: getPlayerNetScore(player.id, hole)
      }))
      .filter(score => score.netScore !== null) as {playerId: string, netScore: number}[];
    
    // If either team doesn't have scores, no points are awarded
    if (homeNetScores.length === 0 || awayNetScores.length === 0) {
      return { home: 0, away: 0 };
    }
    
    // Find the lowest net score for each team
    const lowestHomeNetScore = Math.min(...homeNetScores.map(s => s.netScore));
    const lowestAwayNetScore = Math.min(...awayNetScores.map(s => s.netScore));
    
    // Determine the winner
    if (lowestHomeNetScore < lowestAwayNetScore) {
      return { home: 1, away: 0 };
    } else if (lowestAwayNetScore < lowestHomeNetScore) {
      return { home: 0, away: 1 };
    } else {
      // Tie - each team gets 0.5 points
      return { home: 0.5, away: 0.5 };
    }
  }

  // Calculate points for all holes and update state
  const updateMatchPoints = () => {
    const newHolePoints: {[hole: number]: {home: number, away: number}} = {};
    let newTotalPoints = {home: 0, away: 0};
    
    holes.forEach(hole => {
      const holeResult = calculateHoleWinner(hole);
      newHolePoints[hole] = holeResult;
      newTotalPoints.home += holeResult.home;
      newTotalPoints.away += holeResult.away;
    });
    
    setHolePoints(newHolePoints);
    setTotalPoints(newTotalPoints);
  }

  // Update match points whenever scores change
  useEffect(() => {
    if (!loading) {
      updateMatchPoints();
    }
  }, [playerScores, loading]);

  // Fetch players and initialize scores
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        let homeTeamData: any = { players: [] };
        let awayTeamData: any = { players: [] };
        
        try {
          // Fetch home team players
          const homeResponse = await fetch(`/api/teams/${match.homeTeamId}`)
          if (homeResponse.ok) {
            homeTeamData = await homeResponse.json()
          } else {
            console.error('Failed to fetch home team data, using fallback')
            // Use fallback data
            homeTeamData.players = fallbackPlayerData.filter(player => player.teamId === match.homeTeamId)
          }
        } catch (error) {
          console.error('Error fetching home team:', error)
          // Use fallback data
          homeTeamData.players = fallbackPlayerData.filter(player => player.teamId === match.homeTeamId)
        }
        
        try {
          // Fetch away team players
          const awayResponse = await fetch(`/api/teams/${match.awayTeamId}`)
          if (awayResponse.ok) {
            awayTeamData = await awayResponse.json()
          } else {
            console.error('Failed to fetch away team data, using fallback')
            // Use fallback data
            awayTeamData.players = fallbackPlayerData.filter(player => player.teamId === match.awayTeamId)
          }
        } catch (error) {
          console.error('Error fetching away team:', error)
          // Use fallback data
          awayTeamData.players = fallbackPlayerData.filter(player => player.teamId === match.awayTeamId)
        }
        
        if (homeTeamData.players && homeTeamData.players.length > 0) {
          setHomeTeamPlayers(homeTeamData.players)
        } else {
          console.warn('No home team players found, using fallback data')
          setHomeTeamPlayers(fallbackPlayerData.filter(player => player.teamId === match.homeTeamId))
        }
        
        if (awayTeamData.players && awayTeamData.players.length > 0) {
          setAwayTeamPlayers(awayTeamData.players)
        } else {
          console.warn('No away team players found, using fallback data')
          setAwayTeamPlayers(fallbackPlayerData.filter(player => player.teamId === match.awayTeamId))
        }
        
        // Set all players for handicap calculations
        const homePlayers = homeTeamData.players && homeTeamData.players.length > 0 
          ? homeTeamData.players 
          : fallbackPlayerData.filter(player => player.teamId === match.homeTeamId);
        
        const awayPlayers = awayTeamData.players && awayTeamData.players.length > 0 
          ? awayTeamData.players 
          : fallbackPlayerData.filter(player => player.teamId === match.awayTeamId);
        
        setAllPlayers([...homePlayers, ...awayPlayers]);
        
        // Fetch existing scores for this match
        const scoresResponse = await fetch(`/api/scores?matchId=${match.id}`)
        const scoresData = await scoresResponse.json()
        
        // Initialize player scores
        const initialScores: PlayerScores = {}
        
        // Initialize empty scores for all players and all holes
        const allPlayers = [...(homeTeamData.players || []), ...(awayTeamData.players || [])]
        
        allPlayers.forEach(player => {
          initialScores[player.id] = holes.map(hole => ({
            hole,
            score: 0
          }))
        })
        
        // If we have existing scores, populate them
        if (scoresData && scoresData.length > 0) {
          scoresData.forEach((score: any) => {
            if (initialScores[score.playerId]) {
              const holeIndex = score.hole - 1
              if (initialScores[score.playerId][holeIndex]) {
                initialScores[score.playerId][holeIndex].score = score.score
              }
            }
          })
        }
        
        setPlayerScores(initialScores)
      } catch (err) {
        console.error('Error fetching data:', err)
        setError('Failed to load match data')
        
        // Use fallback data
        setHomeTeamPlayers(fallbackPlayerData.filter(player => player.teamId === match.homeTeamId))
        setAwayTeamPlayers(fallbackPlayerData.filter(player => player.teamId === match.awayTeamId))
        
        // Set all players for handicap calculations using fallback data
        const homePlayers = fallbackPlayerData.filter(player => player.teamId === match.homeTeamId);
        const awayPlayers = fallbackPlayerData.filter(player => player.teamId === match.awayTeamId);
        setAllPlayers([...homePlayers, ...awayPlayers]);
        
        // Initialize player scores with fallback data
        const allPlayers = fallbackPlayerData.filter(player => 
          player.teamId === match.homeTeamId || player.teamId === match.awayTeamId
        )
        
        const initialScores: PlayerScores = {}
        allPlayers.forEach(player => {
          initialScores[player.id] = holes.map(hole => ({
            hole,
            score: 0
          }))
        })
        
        setPlayerScores(initialScores)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [match])

  // Handle score change for a player on a specific hole
  const handleScoreChange = (playerId: string, hole: number, score: number) => {
    setPlayerScores(prev => {
      const newScores = { ...prev }
      const playerScores = [...(newScores[playerId] || [])]
      const holeIndex = hole - 1
      
      if (playerScores[holeIndex]) {
        playerScores[holeIndex] = { ...playerScores[holeIndex], score }
      } else {
        playerScores[holeIndex] = { hole, score }
      }
      
      newScores[playerId] = playerScores
      return newScores
    })
  }

  // Calculate total score for a player
  const calculateTotal = (playerId: string) => {
    let total = 0;
    for (let i = 0; i < 18; i++) {
      if (playerScores[playerId]?.[i]?.score) {
        total += playerScores[playerId][i].score;
      }
    }
    return total > 0 ? total : 0;
  };

  // Helper function to calculate net score
  const calculateNetScore = (score: number, strokesGiven: number) => {
    return score - strokesGiven;
  };

  // Calculate net total score for a player
  const calculateNetTotal = (playerId: string) => {
    const grossTotal = calculateTotal(playerId);
    if (grossTotal === 0) return 0;
    
    const totalStrokes = holes.reduce((sum, hole) => 
      sum + getStrokesGivenForMatchup(
        allPlayers.find(p => p.id === playerId)?.handicapIndex || 0, 
        hole, 
        allPlayers
      ), 0);
    
    return grossTotal - totalStrokes;
  };

  // Save scores to the database
  const saveScores = async () => {
    try {
      setSaving(true)
      setError(null)
      
      // Format scores for API
      const scoresToSave = Object.entries(playerScores).flatMap(([playerId, holeScores]) => 
        holeScores
          .filter(holeScore => holeScore.score > 0) // Only save scores that have been entered
          .map(holeScore => ({
            matchId: match.id,
            playerId,
            hole: holeScore.hole,
            score: holeScore.score
          }))
      )
      
      if (scoresToSave.length === 0) {
        setError('Please enter at least one score')
        setSaving(false)
        return
      }
      
      const response = await fetch('/api/scores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ scores: scoresToSave }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to save scores')
      }
      
      setSuccess('Scores saved successfully!')
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null)
      }, 3000)
    } catch (err) {
      console.error('Error saving scores:', err)
      setError('Failed to save scores')
    } finally {
      setSaving(false)
    }
  }

  // Navigate to next hole
  const goToNextHole = () => {
    setActiveHole(current => {
      const next = current === 9 ? 1 : current + 1
      return next
    })
  }

  // Navigate to previous hole
  const goToPrevHole = () => {
    setActiveHole(current => {
      const prev = current === 1 ? 9 : current - 1
      return prev
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin w-10 h-10 border-4 border-[#00df82] border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="bg-[#030f0f]/90 rounded-xl backdrop-blur-sm border border-[#00df82]/20 overflow-hidden">
      {/* Header with match details */}
      <div className="bg-gradient-to-r from-[#00df82]/20 to-transparent p-4 border-b border-[#00df82]/20">
        <div className="flex justify-center items-center">
          <h3 className="text-xl font-audiowide text-white">Match Scorecard</h3>
        </div>
        
        {/* Match Scoreboard */}
        <div className="mt-4 bg-[#030f0f]/70 rounded-lg border border-[#00df82]/30 p-3">
          <div className="flex justify-center items-center">
            <div className="flex-1 text-center">
              <div className="text-white font-orbitron">{match.homeTeam.name}</div>
              <div className="text-3xl font-bold text-[#00df82]">{totalPoints.home.toFixed(1)}</div>
            </div>
            <div className="mx-4 text-white/50 font-bold">-</div>
            <div className="flex-1 text-center">
              <div className="text-white font-orbitron">{match.awayTeam.name}</div>
              <div className="text-3xl font-bold text-[#00df82]">{totalPoints.away.toFixed(1)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Hole navigation */}
      <div className="bg-[#030f0f]/70 p-4 border-b border-[#00df82]/20">
        <div className="flex justify-between items-center">
          <button 
            onClick={goToPrevHole}
            className="p-2 text-white border border-[#00df82]/50 rounded-md hover:bg-[#00df82]/10 transition-colors w-16 h-10 flex items-center justify-center"
            aria-label="Previous hole"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          
          <div className="flex-1 flex justify-center">
            <div className="rounded-full bg-[#00df82] flex flex-col items-center justify-center px-4 py-2">
              <span className="text-xs font-medium text-black font-orbitron">Hole</span>
              <span className="text-xl font-bold text-black font-orbitron">{activeHole}</span>
            </div>
          </div>
          
          <button 
            onClick={goToNextHole}
            className="p-2 text-white border border-[#00df82]/50 rounded-md hover:bg-[#00df82]/10 transition-colors w-16 h-10 flex items-center justify-center"
            aria-label="Next hole"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* Active hole scorecard */}
      <div className="p-4">
        <div className="mb-4 bg-[#030f0f]/50 p-3 rounded-lg border border-[#00df82]/10">
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-audiowide text-white">Hole {activeHole}</h4>
            <div className="text-white/70 font-orbitron text-sm">
              Par {parValues[activeHole as keyof typeof parValues]} • 
              Handicap {holeHandicaps[activeHole as keyof typeof holeHandicaps]}
            </div>
          </div>
          
          {/* Hole result indicator */}
          {holePoints[activeHole] && (holePoints[activeHole].home > 0 || holePoints[activeHole].away > 0) && (
            <div className="mt-2 p-2 rounded-md text-center"
              style={{
                backgroundColor: holePoints[activeHole].home > holePoints[activeHole].away 
                  ? 'rgba(0, 223, 130, 0.2)' 
                  : holePoints[activeHole].away > holePoints[activeHole].home 
                    ? 'rgba(255, 99, 71, 0.2)' 
                    : 'rgba(255, 255, 255, 0.1)'
              }}
            >
              <div className="text-sm font-audiowide"
                style={{
                  color: holePoints[activeHole].home > holePoints[activeHole].away 
                    ? '#00df82' 
                    : holePoints[activeHole].away > holePoints[activeHole].home 
                      ? '#ff6347' 
                      : '#ffffff'
                }}
              >
                {holePoints[activeHole].home > holePoints[activeHole].away 
                  ? `${match.homeTeam.name} wins hole (${holePoints[activeHole].home} point)` 
                  : holePoints[activeHole].away > holePoints[activeHole].home 
                    ? `${match.awayTeam.name} wins hole (${holePoints[activeHole].away} point)` 
                    : `Hole tied (${holePoints[activeHole].home} point each)`}
              </div>
            </div>
          )}
        </div>

        {/* Home Team */}
        <div className="mb-6">
          <div className="bg-gradient-to-r from-[#00df82]/10 to-transparent p-2 mb-2 rounded">
            <h5 className="text-white font-audiowide">{match.homeTeam.name}</h5>
          </div>
          <div className="space-y-3">
            {homeTeamPlayers.map(player => (
              <div key={player.id} className="flex items-center justify-between bg-[#030f0f]/30 p-3 rounded-lg border border-[#00df82]/5">
                <div className="flex-1 mr-3">
                  <div className="text-lg text-white font-orbitron">{player.name}</div>
                  <div className="text-xs text-[#00df82]/70 font-audiowide flex items-center">
                    <span>CHP: {calculateCourseHandicap(player.handicapIndex)}</span>
                    {getStrokesGivenForMatchup(player.handicapIndex, activeHole, allPlayers) > 0 && (
                      <span className="ml-2 px-1.5 py-0.5 bg-[#00df82]/20 rounded text-[#00df82] text-xs">
                        Gets {getStrokesGivenForMatchup(player.handicapIndex, activeHole, allPlayers)} {getStrokesGivenForMatchup(player.handicapIndex, activeHole, allPlayers) === 1 ? 'stroke' : 'strokes'}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center">
                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        max="12"
                        value={playerScores[player.id]?.[activeHole - 1]?.score || ''}
                        onChange={(e) => handleScoreChange(player.id, activeHole, parseInt(e.target.value) || 0)}
                        className="bg-[#030f0f] border border-[#00df82]/30 text-white text-xl font-medium rounded-md py-2 px-3 w-16 h-12 focus:outline-none focus:ring-1 focus:ring-[#00df82] focus:border-[#00df82] text-center"
                        placeholder="-"
                      />
                      {getStrokesGivenForMatchup(player.handicapIndex, activeHole, allPlayers) > 0 && (
                        <span className="absolute -top-3 -right-3 text-[#00df82] text-xs font-bold">
                          {Array(getStrokesGivenForMatchup(player.handicapIndex, activeHole, allPlayers)).fill('*').join('')}
                        </span>
                      )}
                    </div>
                  </div>
                  {playerScores[player.id]?.[activeHole - 1]?.score > 0 && (
                    <div className="text-xs text-[#00df82]/70 mt-1">
                      Net: {calculateNetScore(
                        playerScores[player.id]?.[activeHole - 1]?.score || 0,
                        getStrokesGivenForMatchup(player.handicapIndex, activeHole, allPlayers)
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Away Team */}
        <div className="mb-6">
          <div className="bg-gradient-to-r from-[#00df82]/10 to-transparent p-2 mb-2 rounded">
            <h5 className="text-white font-audiowide">{match.awayTeam.name}</h5>
          </div>
          <div className="space-y-3">
            {awayTeamPlayers.map(player => (
              <div key={player.id} className="flex items-center justify-between bg-[#030f0f]/30 p-3 rounded-lg border border-[#00df82]/5">
                <div className="flex-1 mr-3">
                  <div className="text-lg text-white font-orbitron">{player.name}</div>
                  <div className="text-xs text-[#00df82]/70 font-audiowide flex items-center">
                    <span>CHP: {calculateCourseHandicap(player.handicapIndex)}</span>
                    {getStrokesGivenForMatchup(player.handicapIndex, activeHole, allPlayers) > 0 && (
                      <span className="ml-2 px-1.5 py-0.5 bg-[#00df82]/20 rounded text-[#00df82] text-xs">
                        Gets {getStrokesGivenForMatchup(player.handicapIndex, activeHole, allPlayers)} {getStrokesGivenForMatchup(player.handicapIndex, activeHole, allPlayers) === 1 ? 'stroke' : 'strokes'}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center">
                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        max="12"
                        value={playerScores[player.id]?.[activeHole - 1]?.score || ''}
                        onChange={(e) => handleScoreChange(player.id, activeHole, parseInt(e.target.value) || 0)}
                        className="bg-[#030f0f] border border-[#00df82]/30 text-white text-xl font-medium rounded-md py-2 px-3 w-16 h-12 focus:outline-none focus:ring-1 focus:ring-[#00df82] focus:border-[#00df82] text-center"
                        placeholder="-"
                      />
                      {getStrokesGivenForMatchup(player.handicapIndex, activeHole, allPlayers) > 0 && (
                        <span className="absolute -top-3 -right-3 text-[#00df82] text-xs font-bold">
                          {Array(getStrokesGivenForMatchup(player.handicapIndex, activeHole, allPlayers)).fill('*').join('')}
                        </span>
                      )}
                    </div>
                  </div>
                  {playerScores[player.id]?.[activeHole - 1]?.score > 0 && (
                    <div className="text-xs text-[#00df82]/70 mt-1">
                      Net: {calculateNetScore(
                        playerScores[player.id]?.[activeHole - 1]?.score || 0,
                        getStrokesGivenForMatchup(player.handicapIndex, activeHole, allPlayers)
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scorecard Summary */}
        <div className="mb-6">
          <div className="relative overflow-hidden rounded-xl border border-[#00df82]/20 backdrop-blur-sm bg-[#030f0f]/70">
            <div className="absolute inset-0 bg-gradient-to-br from-[#00df82]/5 to-transparent"></div>
            <button
              onClick={() => setScorecardExpanded(!scorecardExpanded)}
              className="w-full px-4 py-3 flex items-center justify-between text-white hover:bg-white/5 transition-colors relative z-10"
            >
              <div className="flex items-center space-x-2">
                <span className="font-audiowide">Scorecard Summary</span>
                <span className="text-sm text-white/60 font-orbitron">
                  {scorecardExpanded ? 'Click to collapse' : 'Click to expand'}
                </span>
              </div>
              {scorecardExpanded ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-[#00df82]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-[#00df82]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              )}
            </button>
            
            {scorecardExpanded && (
              <div className="px-4 pb-4 relative z-10">
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse">
                    <thead>
                      <tr className="bg-[#030f0f]/70 border-b border-[#00df82]/20">
                        <th className="p-2 text-left text-white font-audiowide sticky left-0 bg-[#030f0f]/70 z-10 min-w-[120px]">Player</th>
                        {holes.map(hole => (
                          <th key={hole} className="p-2 text-center text-white font-audiowide">
                            {hole}
                          </th>
                        ))}
                        <th className="p-2 text-center text-white font-audiowide">Gross</th>
                        <th className="p-2 text-center text-[#00df82] font-audiowide">Net</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Home Team Row with Points */}
                      <tr className="border-b border-[#00df82]/10 bg-[#00df82]/5">
                        <td className="p-2 text-left sticky left-0 bg-[#00df82]/5 z-10">
                          <div className="text-white font-audiowide">{match.homeTeam.name}</div>
                          <div className="text-xs text-[#00df82]/70 mt-1">Team Points</div>
                        </td>
                        {holes.map(hole => (
                          <td key={hole} className="p-2 text-center">
                            <div className="flex flex-col items-center">
                              {holePoints[hole] && holePoints[hole].home > 0 ? (
                                <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mb-1"
                                  style={{
                                    backgroundColor: 'rgba(0, 223, 130, 0.9)',
                                    color: '#000'
                                  }}
                                >
                                  {holePoints[hole].home}
                                </div>
                              ) : (
                                <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mb-1 bg-[#030f0f]/50 text-white/30">
                                  0
                                </div>
                              )}
                            </div>
                          </td>
                        ))}
                        <td className="p-2 text-center">
                          <div className="text-white font-bold">{totalPoints.home.toFixed(1)}</div>
                        </td>
                        <td className="p-2"></td>
                      </tr>
                      
                      {/* Home Team Players */}
                      {homeTeamPlayers.map(player => (
                        <React.Fragment key={player.id}>
                          <tr className="border-b border-[#00df82]/5">
                            <td className="p-2 text-left sticky left-0 bg-[#030f0f]/90 z-10">
                              <div className="text-white font-orbitron">{player.name}</div>
                              <div className="text-xs text-[#00df82]/70">CHP: {calculateCourseHandicap(player.handicapIndex)}</div>
                            </td>
                            {holes.map(hole => {
                              const strokesGiven = getStrokesGivenForMatchup(player.handicapIndex, hole, allPlayers);
                              const score = playerScores[player.id]?.[hole - 1]?.score || 0;
                              const netScore = score ? calculateNetScore(score, strokesGiven) : 0;
                              return (
                                <td key={hole} className="p-2 text-center text-white font-medium">
                                  <div className="relative">
                                    {score ? score : '-'}
                                    {strokesGiven > 0 && (
                                      <span className="absolute -top-1 -right-2 text-[#00df82] text-xs">
                                        {score ? `${netScore}*` : '*'}
                                      </span>
                                    )}
                                  </div>
                                </td>
                              );
                            })}
                            <td className="p-2 text-center">
                              <div className="text-white font-bold">
                                {calculateTotal(player.id) || '-'}
                              </div>
                              {calculateTotal(player.id) ? (
                                <div className="text-xs text-[#00df82]/70">
                                  Strokes: {holes.reduce((sum, hole) => 
                                    sum + getStrokesGivenForMatchup(player.handicapIndex, hole, allPlayers), 0)}
                                </div>
                              ) : null}
                            </td>
                            <td className="p-2 text-center text-[#00df82] font-bold">
                              {calculateTotal(player.id) ? calculateNetTotal(player.id) : '-'}
                            </td>
                          </tr>
                        </React.Fragment>
                      ))}
                      
                      {/* Away Team Row with Points */}
                      <tr className="border-b border-[#00df82]/10 bg-[#00df82]/5">
                        <td className="p-2 text-left sticky left-0 bg-[#00df82]/5 z-10">
                          <div className="text-white font-audiowide">{match.awayTeam.name}</div>
                          <div className="text-xs text-[#00df82]/70 mt-1">Team Points</div>
                        </td>
                        {holes.map(hole => (
                          <td key={hole} className="p-2 text-center">
                            <div className="flex flex-col items-center">
                              {holePoints[hole] && holePoints[hole].away > 0 ? (
                                <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mb-1"
                                  style={{
                                    backgroundColor: 'rgba(255, 99, 71, 0.9)',
                                    color: '#fff'
                                  }}
                                >
                                  {holePoints[hole].away}
                                </div>
                              ) : (
                                <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mb-1 bg-[#030f0f]/50 text-white/30">
                                  0
                                </div>
                              )}
                            </div>
                          </td>
                        ))}
                        <td className="p-2 text-center">
                          <div className="text-white font-bold">{totalPoints.away.toFixed(1)}</div>
                        </td>
                        <td className="p-2"></td>
                      </tr>
                      
                      {/* Away Team Players */}
                      {awayTeamPlayers.map(player => (
                        <React.Fragment key={player.id}>
                          <tr className="border-b border-[#00df82]/5">
                            <td className="p-2 text-left sticky left-0 bg-[#030f0f]/90 z-10">
                              <div className="text-white font-orbitron">{player.name}</div>
                              <div className="text-xs text-[#00df82]/70">CHP: {calculateCourseHandicap(player.handicapIndex)}</div>
                            </td>
                            {holes.map(hole => {
                              const strokesGiven = getStrokesGivenForMatchup(player.handicapIndex, hole, allPlayers);
                              const score = playerScores[player.id]?.[hole - 1]?.score || 0;
                              const netScore = score ? calculateNetScore(score, strokesGiven) : 0;
                              return (
                                <td key={hole} className="p-2 text-center text-white font-medium">
                                  <div className="relative">
                                    {score ? score : '-'}
                                    {strokesGiven > 0 && (
                                      <span className="absolute -top-1 -right-2 text-[#00df82] text-xs">
                                        {score ? `${netScore}*` : '*'}
                                      </span>
                                    )}
                                  </div>
                                </td>
                              );
                            })}
                            <td className="p-2 text-center">
                              <div className="text-white font-bold">
                                {calculateTotal(player.id) || '-'}
                              </div>
                              {calculateTotal(player.id) ? (
                                <div className="text-xs text-[#00df82]/70">
                                  Strokes: {holes.reduce((sum, hole) => 
                                    sum + getStrokesGivenForMatchup(player.handicapIndex, hole, allPlayers), 0)}
                                </div>
                              ) : null}
                            </td>
                            <td className="p-2 text-center text-[#00df82] font-bold">
                              {calculateTotal(player.id) ? calculateNetTotal(player.id) : '-'}
                            </td>
                          </tr>
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Error and success messages */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded text-white">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded text-white">
            {success}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={onClose}
            className="px-5 py-3 bg-[#030f0f] text-white border border-[#00df82]/30 rounded-lg hover:bg-[#030f0f]/80 transition-colors text-base min-w-[100px]"
          >
            Close
          </button>
          
          <button
            onClick={saveScores}
            disabled={saving}
            className="group relative overflow-hidden px-5 py-3 text-white bg-gradient-to-r from-[#00df82]/40 to-[#4CAF50]/30 hover:from-[#00df82]/60 hover:to-[#4CAF50]/50 rounded-lg transition-all duration-300 border border-[#00df82]/50 hover:border-[#00df82] backdrop-blur-sm text-base font-audiowide shadow-[0_0_15px_rgba(0,223,130,0.3)] hover:shadow-[0_0_20px_rgba(0,223,130,0.5)] transform hover:scale-105 min-w-[140px]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#00df82]/20 to-transparent opacity-50"></div>
            <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-[#00df82]/20 to-transparent skew-x-15 group-hover:animate-shimmer"></div>
            <span className="relative flex items-center justify-center">
              {saving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 13l4 4L19 7" stroke="#00df82" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Save Scores
                </>
              )}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
} 