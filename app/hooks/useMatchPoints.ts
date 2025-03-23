import { useState, useEffect } from 'react';
import { Match } from '../types';

export function useMatchPoints(matchId: string | undefined) {
  const [homePoints, setHomePoints] = useState(0);
  const [awayPoints, setAwayPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!matchId) {
      setLoading(false);
      return;
    }

    const fetchScores = async () => {
      try {
        setLoading(true);
        
        // Use the exact same API endpoint as the HoleByHoleScorecard component
        const response = await fetch(`/api/scores?matchId=${matchId}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch scores for match ${matchId}`);
        }
        
        const scores = await response.json();
        
        // Use the exact same logic for calculating points as in HoleByHoleScorecard
        if (scores && Array.isArray(scores) && scores.length > 0) {
          // If there's a matchPoints property (this is the most direct way)
          if (scores[0].matchPoints) {
            setHomePoints(parseFloat(scores[0].matchPoints.home) || 0);
            setAwayPoints(parseFloat(scores[0].matchPoints.away) || 0);
          } 
          // If there are holePoints, calculate total from those (same as HoleByHoleScorecard)
          else if (scores.some(score => score.holePoints)) {
            let home = 0;
            let away = 0;
            
            scores.forEach((score: any) => {
              if (score.holePoints) {
                Object.entries(score.holePoints).forEach(([hole, points]: [string, any]) => {
                  home += parseFloat(points.home) || 0;
                  away += parseFloat(points.away) || 0;
                });
              }
            });
            
            setHomePoints(home);
            setAwayPoints(away);
          }
          // Otherwise, we don't have enough information to calculate points
          else {
            console.warn('Score data format not recognized for match points calculation');
            setHomePoints(0);
            setAwayPoints(0);
          }
        } else {
          // No scores available
          setHomePoints(0);
          setAwayPoints(0);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching match points:', error);
        setError(error instanceof Error ? error.message : 'Unknown error');
        setHomePoints(0);
        setAwayPoints(0);
        setLoading(false);
      }
    };
    
    fetchScores();
    
    // Set up polling interval to refresh scores
    const interval = setInterval(fetchScores, 30000);
    
    return () => clearInterval(interval);
  }, [matchId]);

  return { homePoints, awayPoints, loading, error };
}
