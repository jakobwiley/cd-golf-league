'use client'

import React, { useState, useEffect, useRef } from 'react'
import { format } from 'date-fns'
import { X } from 'lucide-react'
import { holeHandicaps, calculateCourseHandicap } from '../lib/handicap'
import { useRouter } from 'next/navigation';
import { Match as AppMatch } from '../types'

export interface Player {
  id: string
  name: string
  handicapIndex: number
  teamId: string
}

export interface Team {
  id: string
  name: string
  players?: Player[]
}

export interface HoleScore {
  hole: number
  score: number | null
}

interface PlayerScores {
  [playerId: string]: HoleScore[]
}

export interface HoleByHoleScorecardProps {
  match: AppMatch
  onClose?: () => void
  onViewScorecard?: () => void
  isFullScreen?: boolean
  disableWebSocket?: boolean
  onPointsUpdate?: (home: number, away: number) => void
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
  
  // Use the USGA allocation method for multiple strokes
  // First allocation: one stroke per hole starting from the hardest hole
  let strokesGiven = 0;
  
  // First allocation (1-9 strokes)
  if (holeHandicapValue <= handicapDifference) {
    strokesGiven += 1;
  }
  
  // Second allocation (10-18 strokes)
  if (handicapDifference > 9 && holeHandicapValue <= (handicapDifference - 9)) {
    strokesGiven += 1;
  }
  
  // Third allocation (19-27 strokes)
  if (handicapDifference > 18 && holeHandicapValue <= (handicapDifference - 18)) {
    strokesGiven += 1;
  }
  
  // Fourth allocation (28-36 strokes)
  if (handicapDifference > 27 && holeHandicapValue <= (handicapDifference - 27)) {
    strokesGiven += 1;
  }
  
  // Fifth allocation (37-45 strokes)
  if (handicapDifference > 36 && holeHandicapValue <= (handicapDifference - 36)) {
    strokesGiven += 1;
  }
  
  return strokesGiven;
}

// Add this function before the component
const calculateGrossTotal = (playerId: string, scores: PlayerScores): number => {
  if (!scores[playerId]) return 0;
  return scores[playerId].reduce((total, hole) => total + (hole.score || 0), 0);
};

export default function HoleByHoleScorecard({ 
  match, 
  onClose, 
  onViewScorecard,
  isFullScreen = false,
  disableWebSocket = false,
  onPointsUpdate
}: HoleByHoleScorecardProps) {
  if (!match || !match.homeTeam || !match.awayTeam) {
    return <div>Loading...</div>;
  }

  const router = useRouter();
  const [homeTeamPlayers, setHomeTeamPlayers] = useState<Player[]>([])
  const [awayTeamPlayers, setAwayTeamPlayers] = useState<Player[]>([])
  const [allPlayers, setAllPlayers] = useState<Player[]>([])
  const [playerScores, setPlayerScores] = useState<PlayerScores>({})
  const [activeHole, setActiveHole] = useState<number>(match.startingHole)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  // New state variables for match scoring
  const [holePoints, setHolePoints] = useState<{[hole: number]: {home: number, away: number}}>({})
  const [totalPoints, setTotalPoints] = useState<{home: number, away: number}>({home: 0, away: 0})
  // New state variable to track if screen is small
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false)
  // New state variable to track if device is in landscape mode
  const [isLandscape, setIsLandscape] = useState(false)
  // New state variable to track if fullscreen scorecard is shown
  const [showFullscreenScorecard, setShowFullscreenScorecard] = useState(false)
  const [showSummary, setShowSummary] = useState(false);
  const summaryRef = React.createRef<HTMLDivElement>();
  const [showScorecard, setShowScorecard] = useState(false)

  const handleSummaryToggle = async () => {
    if (showSummary) {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
        if ('orientation' in window.screen && 'unlock' in window.screen.orientation) {
          await window.screen.orientation.unlock();
        }
      }
      setShowSummary(false);
    } else {
      setShowSummary(true);
      if (window.innerWidth <= 768 && summaryRef.current) {
        await summaryRef.current.requestFullscreen();
        if ('orientation' in window.screen && 'lock' in window.screen.orientation) {
          await window.screen.orientation.lock('landscape');
        }
      }
    }
  };

  useEffect(() => {
    return () => {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
      if ('orientation' in window.screen && 'unlock' in window.screen.orientation) {
        window.screen.orientation.unlock();
      }
    };
  }, []);

  // Array of holes 1-9
  const holes = Array.from({ length: 9 }, (_, i) => i + 1)

  // Par values for each hole at Country Drive
  const parValues = {
    1: 5,
    2: 3,
    3: 4,
    4: 3,
    5: 4,
    6: 4,
    7: 4,
    8: 4,
    9: 5
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

  // Notify parent component when total points change
  useEffect(() => {
    if (onPointsUpdate) {
      onPointsUpdate(totalPoints.home, totalPoints.away);
    }
  }, [totalPoints, onPointsUpdate]);

  // Fetch match data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Fetch match players using the updated API endpoint
        // This will return only the active players (max 2 per team)
        try {
          const matchPlayersResponse = await fetch(`/api/matches/${match.id}/players`);
          if (matchPlayersResponse.ok) {
            const matchPlayersData = await matchPlayersResponse.json();
            
            if (matchPlayersData.homePlayers && matchPlayersData.homePlayers.length > 0) {
              // Convert the API response format to our Player type
              const homePlayers = matchPlayersData.homePlayers.map((player: any) => ({
                id: player.playerId,
                name: player.name,
                handicapIndex: player.handicapIndex,
                teamId: player.teamId,
                playerType: player.isSubstitute ? 'SUBSTITUTE' : 'PRIMARY'
              }));
              setHomeTeamPlayers(homePlayers);
            } else {
              console.warn('No home team players found, using fallback data');
              setHomeTeamPlayers(fallbackPlayerData.filter(player => player.teamId === match.homeTeamId).slice(0, 2));
            }
            
            if (matchPlayersData.awayPlayers && matchPlayersData.awayPlayers.length > 0) {
              // Convert the API response format to our Player type
              const awayPlayers = matchPlayersData.awayPlayers.map((player: any) => ({
                id: player.playerId,
                name: player.name,
                handicapIndex: player.handicapIndex,
                teamId: player.teamId,
                playerType: player.isSubstitute ? 'SUBSTITUTE' : 'PRIMARY'
              }));
              setAwayTeamPlayers(awayPlayers);
            } else {
              console.warn('No away team players found, using fallback data');
              setAwayTeamPlayers(fallbackPlayerData.filter(player => player.teamId === match.awayTeamId).slice(0, 2));
            }
            
            // Set all players for handicap calculations
            setAllPlayers([
              ...matchPlayersData.homePlayers.map((player: any) => ({
                id: player.playerId,
                name: player.name,
                handicapIndex: player.handicapIndex,
                teamId: player.teamId,
                playerType: player.isSubstitute ? 'SUBSTITUTE' : 'PRIMARY'
              })),
              ...matchPlayersData.awayPlayers.map((player: any) => ({
                id: player.playerId,
                name: player.name,
                handicapIndex: player.handicapIndex,
                teamId: player.teamId,
                playerType: player.isSubstitute ? 'SUBSTITUTE' : 'PRIMARY'
              }))
            ]);
          } else {
            throw new Error('Failed to fetch match players');
          }
        } catch (error) {
          console.error('Error fetching match players:', error);
          // Use fallback data
          const homePlayers = fallbackPlayerData.filter(player => player.teamId === match.homeTeamId).slice(0, 2);
          const awayPlayers = fallbackPlayerData.filter(player => player.teamId === match.awayTeamId).slice(0, 2);
          
          setHomeTeamPlayers(homePlayers);
          setAwayTeamPlayers(awayPlayers);
          setAllPlayers([...homePlayers, ...awayPlayers]);
        }
        
        // Fetch existing scores for this match
        const scoresResponse = await fetch(`/api/scores?matchId=${match.id}`)
        const scoresData = await scoresResponse.json()
        
        // Initialize player scores
        const initialScores: PlayerScores = {}
        
        // Initialize empty scores for all players and all holes
        const allPlayers = [...homeTeamPlayers, ...awayTeamPlayers];
        
        allPlayers.forEach(player => {
          initialScores[player.id] = holes.map(hole => ({
            hole,
            score: null
          }))
        })
        
        // If we have existing scores, update the initial scores
        if (scoresData && Array.isArray(scoresData) && scoresData.length > 0) {
          scoresData.forEach((score: any) => {
            const { playerId, hole, score: scoreValue } = score
            if (initialScores[playerId] && initialScores[playerId][hole - 1]) {
              initialScores[playerId][hole - 1].score = scoreValue
            }
          })
        }
        
        setPlayerScores(initialScores)
        setLoading(false)
        
        // Calculate match points
        updateMatchPoints()
      } catch (err) {
        console.error('Error fetching data:', err)
        setError('Failed to load match data')
        setLoading(false)
      }
    }
    
    fetchData()
  }, [match.id])

  useEffect(() => {
    // Function to load scores from the API
    const loadScores = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/scores?matchId=${match.id}`);
        if (!response.ok) throw new Error('Failed to fetch scores');
        const data = await response.json();
        setPlayerScores(data.scores || {});
        // Update match points after loading scores
        updateMatchPoints();
      } catch (error) {
        console.error('Error loading scores:', error);
      } finally {
        setLoading(false);
      }
    };

    // Load scores on initial mount
    loadScores();

    // No need for WebSocket or polling if we're just saving on manual edits
    // This simplifies the implementation and removes potential error sources
    
    // Cleanup function
    return () => {
      // No cleanup needed since we're not using WebSocket or intervals
    };
  }, [match.id]);

  // Handle score changes and auto-save
  const handleScoreChange = async (playerId: string, hole: number, score: number | null) => {
    try {
      // Update local state immediately (optimistic update)
      const updatedScores = { ...playerScores };
      
      // Check if player exists in scores object
      if (!updatedScores[playerId]) {
        updatedScores[playerId] = Array.from({ length: 9 }, (_, i) => ({
          hole: i + 1,
          score: i + 1 === hole ? score : null
        }));
      } else {
        // Find the score for this hole or create it
        const holeIndex = updatedScores[playerId].findIndex(s => s.hole === hole);
        if (holeIndex >= 0) {
          updatedScores[playerId][holeIndex] = { ...updatedScores[playerId][holeIndex], score };
        } else {
          updatedScores[playerId].push({ hole, score });
        }
      }
      
      setPlayerScores(updatedScores);
      
      // Update match points immediately for better UX
      updateMatchPoints();
      
      // Format the single score for API
      const scoreToSave = {
        scores: [{
          matchId: match.id,
          playerId,
          hole,
          score
        }]
      };
      
      console.log('Sending score to API:', JSON.stringify(scoreToSave));
      
      // Save to database with timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      try {
        const response = await fetch('/api/scores', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(scoreToSave),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
          console.error('Server returned error:', response.status, errorData);
          throw new Error(`Server error: ${response.status} - ${JSON.stringify(errorData)}`);
        }
        
        const responseData = await response.json();
        console.log('Score saved successfully:', responseData);
        
        // Show brief success message
        setSuccess(score === null ? 'Score cleared' : 'Score saved');
        setTimeout(() => setSuccess(null), 1000);
      } catch (fetchError) {
        console.error('Error saving score:', fetchError instanceof Error ? fetchError.message : JSON.stringify(fetchError));
        
        // Don't show error to user for aborted requests
        if (fetchError.name === 'AbortError') {
          console.log('Request timed out, but UI is still updated');
        } else {
          setError('Failed to save score. Will retry in background.');
          
          // Retry logic in background
          setTimeout(async () => {
            try {
              console.log('Retrying score save:', JSON.stringify(scoreToSave));
              const retryResponse = await fetch('/api/scores', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(scoreToSave),
              });
              
              if (!retryResponse.ok) {
                const errorData = await retryResponse.json().catch(() => ({ message: 'Unknown error' }));
                console.error('Server returned error on retry:', retryResponse.status, errorData);
                throw new Error(`Server error on retry: ${retryResponse.status} - ${JSON.stringify(errorData)}`);
              }
              
              const responseData = await retryResponse.json();
              console.log('Score saved successfully on retry:', responseData);
              
              setError(null);
            } catch (retryErr) {
              console.error('Error on retry:', retryErr instanceof Error ? retryErr.message : JSON.stringify(retryErr));
              // Don't show persistent error to user, as the UI is already updated
              setTimeout(() => setError(null), 3000);
            }
          }, 3000); // Retry after 3 seconds
        }
      }
    } catch (err) {
      console.error('Error in handleScoreChange:', err instanceof Error ? err.message : JSON.stringify(err));
      // Even if there's an error, we've already updated the UI
      // Just show a brief error message
      setError('Error processing score, but your input is saved locally');
      setTimeout(() => setError(null), 3000);
    }
  };

  // Calculate total score for a player
  const calculateTotal = (playerId: string) => {
    let total = 0;
    for (let i = 0; i < 18; i++) {
      if (playerScores[playerId]?.[i]?.score) {
        total += playerScores[playerId][i].score ?? 0;
      }
    }
    return total > 0 ? total : 0;
  };

  // Helper function to calculate net score
  const calculateNetScore = (grossScore: number | null, strokesGiven: number): number => {
    if (grossScore === null) return 0;
    return Math.max(1, grossScore - strokesGiven);
  };

  // Calculate net total score for a player
  const calculateNetTotal = (playerId: string) => {
    const grossTotal = calculateTotal(playerId);
    if (grossTotal === 0) return 0;
    
    // Only count strokes for holes where scores have been entered
    let totalStrokes = 0;
    for (let i = 0; i < holes.length; i++) {
      const hole = holes[i];
      const score = playerScores[playerId]?.[hole - 1]?.score || 0;
      
      // Only add strokes if a score has been entered for this hole
      if (score > 0) {
        const strokesGiven = getStrokesGivenForMatchup(
          allPlayers.find(p => p.id === playerId)?.handicapIndex || 0, 
          hole, 
          allPlayers
        );
        totalStrokes += strokesGiven;
      }
    }
    
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
          .filter(holeScore => holeScore.score !== null) // Only save scores that have been entered
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

  // Add a useEffect to detect screen size and orientation
  useEffect(() => {
    const checkScreenSize = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    window.addEventListener('orientationchange', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
      window.removeEventListener('orientationchange', checkScreenSize);
    };
  }, []);

  useEffect(() => {
    if (isLandscape && !isFullScreen) {
      setShowScorecard(true);
    } else {
      setShowScorecard(false);
    }
  }, [isLandscape, isFullScreen]);

  // Function to check if device is mobile
  const isMobile = () => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth <= 768;
  };

  // Handle fullscreen and orientation for scorecard summary
  const handleScorecardSummary = async () => {
    if (isMobile()) {
      // On mobile, navigate to the fullscreen summary page
      router.push(`/matches/${match.id}/scorecard-summary`);
    } else {
      // On desktop, just toggle the expanded state
      setShowScorecard(!showScorecard);
    }
  };

  // Cleanup fullscreen and orientation on unmount
  useEffect(() => {
    return () => {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
      if ('orientation' in window.screen && 'unlock' in window.screen.orientation) {
        window.screen.orientation.unlock();
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin w-10 h-10 border-4 border-[#00df82] border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <div className={`relative ${isFullScreen ? 'fixed inset-0 z-50 bg-[#030f0f]' : ''}`}>
      {/* Hole navigation */}
      <div className="bg-[#030f0f]/70 px-2 py-3 border-b border-[#00df82]/20">
        <div className="flex justify-center items-center gap-2 max-w-[240px] mx-auto">
          <button 
            onClick={goToPrevHole}
            className="w-10 h-10 text-white border border-[#00df82]/50 rounded-md hover:bg-[#00df82]/10 transition-colors flex items-center justify-center"
            aria-label="Previous hole"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          
          <div className="flex justify-center">
            <div className="rounded-full bg-[#00df82] flex flex-col items-center justify-center w-14 h-14">
              <span className="text-xs font-medium text-black font-orbitron">Hole</span>
              <span className="text-xl font-bold text-black font-orbitron">{activeHole}</span>
            </div>
          </div>
          
          <button 
            onClick={goToNextHole}
            className="w-10 h-10 text-white border border-[#00df82]/50 rounded-md hover:bg-[#00df82]/10 transition-colors flex items-center justify-center"
            aria-label="Next hole"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      <div className="p-4 max-w-6xl mx-auto" data-component-name="HoleByHoleScorecard">
        {/* Hole information */}
        <div className="mb-4 bg-[#030f0f]/50 p-2 md:p-3 rounded-lg border border-[#00df82]/10">
          <div className="flex justify-between items-center">
            <h4 className="text-base md:text-lg font-audiowide text-white">Hole {activeHole}</h4>
            <div className="text-white/70 font-orbitron text-xs md:text-sm">
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
              <div className="text-xs md:text-sm font-audiowide"
                style={{
                  color: holePoints[activeHole].home > holePoints[activeHole].away 
                    ? '#00df82' 
                    : holePoints[activeHole].away > holePoints[activeHole].home 
                      ? '#ff6347' 
                      : '#ffffff'
                }}
              >
                {holePoints[activeHole].home > holePoints[activeHole].away 
                  ? `${match.homeTeam.name} wins hole (${holePoints[activeHole].home.toFixed(1)} point)` 
                  : holePoints[activeHole].away > holePoints[activeHole].home 
                    ? `${match.awayTeam.name} wins hole (${holePoints[activeHole].away.toFixed(1)} point)` 
                    : `Hole tied (${holePoints[activeHole].home.toFixed(1)} point each)`}
              </div>
            </div>
          )}
        </div>

        {/* Player cards - side by side layout */}
        <div className="grid grid-cols-2 gap-2 md:gap-4">
          {/* Home Team */}
          <div className="mb-6 md:mb-0">
            <div className="bg-gradient-to-r from-[#00df82]/40 to-[#4CAF50]/30 p-1 md:p-2 mb-2 md:mb-3 rounded-lg backdrop-blur-sm shadow-[0_0_15px_rgba(0,223,130,0.3)] text-center">
              <h5 className="text-white font-audiowide text-sm md:text-xl">{match.homeTeam.name}</h5>
            </div>
            <div className="space-y-2 md:space-y-3">
              {homeTeamPlayers.map(player => (
                <div key={player.id} className="flex flex-col items-center justify-center bg-[#030f0f]/30 p-3 md:p-5 rounded-lg border border-[#00df82]/5">
                  <div className="text-center mb-2 md:mb-3">
                    <div className="text-lg md:text-2xl text-white font-orbitron mb-1 md:mb-2">{player.name}</div>
                    <div className="text-xs md:text-sm text-[#00df82]/70 font-audiowide flex flex-wrap items-center justify-center">
                      <span>CHP: {calculateCourseHandicap(player.handicapIndex)}</span>
                      {getStrokesGivenForMatchup(player.handicapIndex, activeHole, allPlayers) > 0 && (
                        <span className="ml-1 md:ml-2 px-1 md:px-1.5 py-0.5 bg-[#00df82]/20 rounded text-[#00df82] text-xs md:text-sm">
                          +{getStrokesGivenForMatchup(player.handicapIndex, activeHole, allPlayers)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center mb-1 md:mb-2">
                      <div className="relative">
                        <input
                          type="number"
                          min="1"
                          max="12"
                          value={playerScores[player.id]?.[activeHole - 1]?.score || ''}
                          onChange={(e) => handleScoreChange(player.id, activeHole, parseInt(e.target.value) || null)}
                          className="bg-[#030f0f] border border-[#00df82]/30 text-white text-2xl md:text-4xl font-medium rounded-md md:py-4 py-2 md:px-5 px-3 md:w-24 w-16 md:h-20 h-16 focus:outline-none focus:ring-1 focus:ring-[#00df82] focus:border-[#00df82] text-center"
                          placeholder="-"
                        />
                        {getStrokesGivenForMatchup(player.handicapIndex, activeHole, allPlayers) > 0 && (
                          <span className="absolute -top-2 -right-2 md:-top-3 md:-right-3 text-[#00df82] text-xs md:text-sm font-bold">
                            {Array(getStrokesGivenForMatchup(player.handicapIndex, activeHole, allPlayers)).fill('*').join('')}
                          </span>
                        )}
                      </div>
                    </div>
                    {playerScores[player.id]?.[activeHole - 1]?.score !== null && (
                      <div className="text-sm md:text-base text-[#00df82]/70 text-center mt-1">
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
          <div className="mb-6 md:mb-0">
            <div className="bg-gradient-to-r from-[#00df82]/40 to-[#4CAF50]/30 p-1 md:p-2 mb-2 md:mb-3 rounded-lg backdrop-blur-sm shadow-[0_0_15px_rgba(0,223,130,0.3)] text-center">
              <h5 className="text-white font-audiowide text-sm md:text-xl">{match.awayTeam.name}</h5>
            </div>
            <div className="space-y-2 md:space-y-3">
              {awayTeamPlayers.map(player => (
                <div key={player.id} className="flex flex-col items-center justify-center bg-[#030f0f]/30 p-3 md:p-5 rounded-lg border border-[#00df82]/5">
                  <div className="text-center mb-2 md:mb-3">
                    <div className="text-lg md:text-2xl text-white font-orbitron mb-1 md:mb-2">{player.name}</div>
                    <div className="text-xs md:text-sm text-[#00df82]/70 font-audiowide flex flex-wrap items-center justify-center">
                      <span>CHP: {calculateCourseHandicap(player.handicapIndex)}</span>
                      {getStrokesGivenForMatchup(player.handicapIndex, activeHole, allPlayers) > 0 && (
                        <span className="ml-1 md:ml-2 px-1 md:px-1.5 py-0.5 bg-[#00df82]/20 rounded text-[#00df82] text-xs md:text-sm">
                          +{getStrokesGivenForMatchup(player.handicapIndex, activeHole, allPlayers)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center mb-1 md:mb-2">
                      <div className="relative">
                        <input
                          type="number"
                          min="1"
                          max="12"
                          value={playerScores[player.id]?.[activeHole - 1]?.score || ''}
                          onChange={(e) => handleScoreChange(player.id, activeHole, parseInt(e.target.value) || null)}
                          className="bg-[#030f0f] border border-[#00df82]/30 text-white text-2xl md:text-4xl font-medium rounded-md md:py-4 py-2 md:px-5 px-3 md:w-24 w-16 md:h-20 h-16 focus:outline-none focus:ring-1 focus:ring-[#00df82] focus:border-[#00df82] text-center"
                          placeholder="-"
                        />
                        {getStrokesGivenForMatchup(player.handicapIndex, activeHole, allPlayers) > 0 && (
                          <span className="absolute -top-2 -right-2 md:-top-3 md:-right-3 text-[#00df82] text-xs md:text-sm font-bold">
                            {Array(getStrokesGivenForMatchup(player.handicapIndex, activeHole, allPlayers)).fill('*').join('')}
                          </span>
                        )}
                      </div>
                    </div>
                    {playerScores[player.id]?.[activeHole - 1]?.score !== null && (
                      <div className="text-sm md:text-base text-[#00df82]/70 text-center mt-1">
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
        </div>

        {/* Action buttons */}
        <div className="flex justify-between mt-6 md:mt-8">
          <button
            onClick={onClose}
            className="group relative overflow-hidden px-3 md:px-5 py-1.5 md:py-2 text-white bg-gradient-to-r from-[#00df82]/40 to-[#4CAF50]/30 hover:from-[#00df82]/60 hover:to-[#4CAF50]/50 rounded-lg transition-all duration-300 border border-[#00df82]/50 hover:border-[#00df82] backdrop-blur-sm text-xs md:text-sm font-audiowide shadow-[0_0_15px_rgba(0,223,130,0.3)] hover:shadow-[0_0_20px_rgba(0,223,130,0.5)] transform hover:scale-105"
          >
            Close Match
          </button>
          <button
            onClick={saveScores}
            className="group relative overflow-hidden px-3 md:px-5 py-1.5 md:py-2 text-white bg-gradient-to-r from-[#00df82]/40 to-[#4CAF50]/30 hover:from-[#00df82]/60 hover:to-[#4CAF50]/50 rounded-lg transition-all duration-300 border border-[#00df82]/50 hover:border-[#00df82] backdrop-blur-sm text-xs md:text-sm font-audiowide shadow-[0_0_15px_rgba(0,223,130,0.3)] hover:shadow-[0_0_20px_rgba(0,223,130,0.5)] transform hover:scale-105"
          >
            Save Score
          </button>
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
      </div>
    </div>
  )
}