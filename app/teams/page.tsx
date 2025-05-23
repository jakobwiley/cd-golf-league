'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { calculateCourseHandicap } from '../../lib/handicap'

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

// Fallback team data
const fallbackTeamData = [
  { id: 'team1', name: 'Nick/Brent' },
  { id: 'team2', name: 'Hot/Huerter' },
  { id: 'team3', name: 'Ashley/Alli' },
  { id: 'team4', name: 'Brew/Jake' },
  { id: 'team5', name: 'Sketch/Rob' },
  { id: 'team6', name: 'Trev/Murph' },
  { id: 'team7', name: 'Ryan/Drew' },
  { id: 'team8', name: 'AP/JohnP' },
  { id: 'team9', name: 'Clauss/Wade' },
  { id: 'team10', name: 'Brett/Tony' }
];

export default function TeamsPage() {
  const [expandedSubstitutes, setExpandedSubstitutes] = useState<Set<string>>(new Set());
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Function to toggle substitute visibility
  const toggleSubstitutes = (teamId: string) => {
    const newExpandedSubstitutes = new Set(expandedSubstitutes);
    if (expandedSubstitutes.has(teamId)) {
      newExpandedSubstitutes.delete(teamId);
    } else {
      newExpandedSubstitutes.add(teamId);
    }
    setExpandedSubstitutes(newExpandedSubstitutes);
  };

  // Helper functions to filter players by type
  const getPrimaryPlayers = (players: any[]) => {
    return players.filter(p => p.playerType === 'PRIMARY');
  };

  const getSubstitutePlayers = (players: any[]) => {
    return players.filter(p => p.playerType === 'SUBSTITUTE');
  };

  // Fetch teams data on component mount
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        // Get teams with players
        const { data: teamsData, error: teamsError } = await supabase
          .from('Team')
          .select(`
            *,
            players:Player(*)
          `)
          .order('name');
          
        if (teamsError) {
          console.error('Error fetching teams:', teamsError);
          throw teamsError;
        }
        
        let fetchedTeams = teamsData;
        
        // Check if teams have players, if not, use fallback data
        const hasPlayers = fetchedTeams.some(team => team.players && team.players.length > 0);
        
        if (!hasPlayers) {
          console.log('No players found in teams, using fallback data');
          
          // Create teams with players from fallback data
          fetchedTeams = fallbackTeamData.map(team => {
            const teamPlayers = fallbackPlayerData.filter(player => player.teamId === team.id);
            return {
              ...team,
              players: teamPlayers
            };
          });
        }

        setTeams(fetchedTeams);
      } catch (error) {
        console.error('Error fetching teams:', error);
        
        // Use fallback data in case of error
        const fallbackTeams = fallbackTeamData.map(team => {
          const teamPlayers = fallbackPlayerData.filter(player => player.teamId === team.id);
          return {
            ...team,
            players: teamPlayers
          };
        });
        
        setTeams(fallbackTeams);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  return (
    <div className="min-h-screen bg-[#030f0f] relative overflow-hidden">
      {/* Futuristic background elements */}
      <div className="absolute inset-0 z-0">
        {/* Gradient base */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#00df82]/20 to-[#4CAF50]/10" />
        
        {/* Animated grid lines */}
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full bg-[url('/grid-pattern.svg')] bg-repeat bg-[length:50px_50px]" />
        </div>
        
        {/* Glowing orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#00df82]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-[#4CAF50]/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative overflow-hidden rounded-3xl backdrop-blur-sm bg-gradient-to-r from-[#00df82]/30 to-[#4CAF50]/20 mb-8">
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent"></div>
          <div className="relative px-8 py-6">
            <h1 className="text-4xl font-audiowide text-white mb-2">Teams</h1>
            <p className="text-white/90 font-orbitron tracking-wide">View league teams and players</p>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-2xl transform translate-x-1/4 -translate-y-1/4"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-black/20 to-transparent rounded-full blur-xl transform -translate-x-1/4 translate-y-1/4"></div>
        </div>

        {/* Teams Display */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teams.map((team) => {
            const primaryPlayers = getPrimaryPlayers(team.players || []);
            const substitutePlayers = getSubstitutePlayers(team.players || []);
            
            return (
              <div key={team.id} className="relative overflow-hidden rounded-2xl border border-[#00df82]/30 backdrop-blur-sm bg-[#030f0f]/50">
                <div className="absolute inset-0 bg-gradient-to-br from-[#00df82]/5 to-transparent"></div>
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#00df82]/10 rounded-full blur-3xl"></div>
                <div className="p-6 relative">
                  <div className="mb-4">
                    <h3 className="text-xl font-audiowide text-white mb-1">{team.name}</h3>
                    <p className="text-sm text-gray-400 font-orbitron">Primary Players</p>
                  </div>
                  
                  {/* Primary Players */}
                  <div className="space-y-3 mb-4">
                    {primaryPlayers.map((player) => (
                      <div key={player.id} className="relative overflow-hidden rounded-xl border border-[#00df82]/20 backdrop-blur-sm bg-[#030f0f]/70 p-3">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#00df82]/5 to-transparent"></div>
                        <div className="relative">
                          <div className="text-white font-orbitron">{player.name}</div>
                          <div className="text-sm text-[#00df82]/80 font-audiowide space-x-2">
                            <span>HCP: {player.handicapIndex}</span>
                            <span>•</span>
                            <span>CHP: {calculateCourseHandicap(player.handicapIndex)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {primaryPlayers.length === 0 && (
                      <div className="text-white/50 text-center py-4 font-orbitron">No primary players</div>
                    )}
                  </div>
                  
                  {/* Substitute Players Section */}
                  {substitutePlayers.length > 0 && (
                    <div className="mt-4">
                      <button
                        onClick={() => toggleSubstitutes(team.id)}
                        className="w-full flex items-center justify-between p-3 rounded-lg bg-[#030f0f]/30 border border-[#00df82]/10 hover:bg-[#030f0f]/40 transition-colors"
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-white font-medium">Substitutes</span>
                          <span className="text-sm text-gray-400">({substitutePlayers.length})</span>
                        </div>
                        <svg
                          className={`w-5 h-5 text-[#00df82] transform transition-transform ${
                            expandedSubstitutes.has(team.id) ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      
                      {expandedSubstitutes.has(team.id) && (
                        <div className="mt-2 space-y-2">
                          {substitutePlayers.map((player) => (
                            <div key={player.id} className="relative overflow-hidden rounded-xl border border-[#00df82]/20 backdrop-blur-sm bg-[#030f0f]/70 p-3">
                              <div className="absolute inset-0 bg-gradient-to-br from-[#00df82]/5 to-transparent"></div>
                              <div className="relative">
                                <div className="text-white font-orbitron">{player.name}</div>
                                <div className="text-sm text-[#00df82]/80 font-audiowide space-x-2">
                                  <span>HCP: {player.handicapIndex}</span>
                                  <span>•</span>
                                  <span>CHP: {calculateCourseHandicap(player.handicapIndex)}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  )
}