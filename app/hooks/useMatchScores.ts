import { useState, useEffect } from 'react';
import { useWebSocket } from './useWebSocket';
import { Match } from '../types';

interface MatchScores {
  homePoints: number;
  awayPoints: number;
  lastUpdated: Date | null;
}

export function useMatchScores(match: Match | null): MatchScores {
  const [homePoints, setHomePoints] = useState(0);
  const [awayPoints, setAwayPoints] = useState(0);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  // Set up WebSocket connection for real-time updates
  const socket = useWebSocket(match && match.id ? `/api/scores/ws?matchId=${match.id}` : null);
  
  // Fetch scores and calculate points
  useEffect(() => {
    if (!match || !match.id) return;
    
    const fetchScores = async () => {
      try {
        const response = await fetch(`/api/scores?matchId=${match.id}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        
        if (!response.ok) {
          console.error(`Failed to fetch scores for match ${match.id}`);
          return;
        }
        
        const scores = await response.json();
        
        // Calculate points for home and away teams
        let homeTotal = 0;
        let awayTotal = 0;
        
        if (scores.length > 0) {
          // Try different score data structures
          if (scores[0].matchPoints) {
            // If there's a matchPoints property
            homeTotal = parseFloat(scores[0].matchPoints.home) || 0;
            awayTotal = parseFloat(scores[0].matchPoints.away) || 0;
          } else if (scores[0].points) {
            // If there's a points property
            const homeTeamId = match.homeTeam?.id;
            const awayTeamId = match.awayTeam?.id;
            
            scores.forEach((score: any) => {
              const playerId = score.playerId;
              const playerTeamId = score.teamId || (playerId && match.homeTeam?.players?.find(p => p.id === playerId)?.teamId);
              
              if (playerTeamId === homeTeamId) {
                homeTotal += parseFloat(score.points) || 0;
              } else if (playerTeamId === awayTeamId) {
                awayTotal += parseFloat(score.points) || 0;
              }
            });
          } else {
            // Calculate from individual hole scores
            scores.forEach((score: any) => {
              if (score.holePoints) {
                Object.entries(score.holePoints).forEach(([hole, points]: [string, any]) => {
                  homeTotal += parseFloat(points.home) || 0;
                  awayTotal += parseFloat(points.away) || 0;
                });
              }
            });
          }
        }
        
        setHomePoints(homeTotal);
        setAwayPoints(awayTotal);
        setLastUpdated(new Date());
      } catch (error) {
        console.error(`Error calculating points for match ${match.id}:`, error);
      }
    };
    
    // Initial fetch
    fetchScores();
    
    // Set up interval to refresh scores every 30 seconds if not using WebSocket
    const interval = setInterval(() => {
      if (!socket || socket.readyState !== WebSocket.OPEN) {
        fetchScores();
      }
    }, 30000);
    
    // Handle WebSocket messages
    const handleWebSocketMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'scores_update' && data.matchId === match.id) {
          setHomePoints(parseFloat(data.homePoints) || 0);
          setAwayPoints(parseFloat(data.awayPoints) || 0);
          setLastUpdated(new Date());
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    };
    
    if (socket) {
      socket.addEventListener('message', handleWebSocketMessage);
    }
    
    return () => {
      clearInterval(interval);
      if (socket) {
        socket.removeEventListener('message', handleWebSocketMessage);
      }
    };
  }, [match, socket]);
  
  return { homePoints, awayPoints, lastUpdated };
}
