'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SetupClient() {
  const [loading, setLoading] = useState({
    teams: false,
    players: false,
    schedule: false,
    all: false
  });
  
  const [results, setResults] = useState({
    teams: null,
    players: null,
    schedule: null
  });

  // Function to setup teams
  const setupTeams = async () => {
    setLoading(prev => ({ ...prev, teams: true }));
    try {
      const response = await fetch('/api/direct-setup-teams');
      const data = await response.json();
      setResults(prev => ({ ...prev, teams: data }));
    } catch (error) {
      console.error('Error setting up teams:', error);
      setResults(prev => ({ ...prev, teams: { error: 'Failed to setup teams' } }));
    } finally {
      setLoading(prev => ({ ...prev, teams: false }));
    }
  };

  // Function to setup players
  const setupPlayers = async () => {
    setLoading(prev => ({ ...prev, players: true }));
    try {
      const response = await fetch('/api/direct-add-players');
      const text = await response.text();
      setResults(prev => ({ ...prev, players: { success: true, message: 'Players added successfully' } }));
    } catch (error) {
      console.error('Error setting up players:', error);
      setResults(prev => ({ ...prev, players: { error: 'Failed to setup players' } }));
    } finally {
      setLoading(prev => ({ ...prev, players: false }));
    }
  };

  // Function to setup schedule
  const setupSchedule = async () => {
    setLoading(prev => ({ ...prev, schedule: true }));
    try {
      const response = await fetch('/api/direct-setup-schedule');
      const text = await response.text();
      setResults(prev => ({ ...prev, schedule: { success: true, message: 'Schedule setup successfully' } }));
    } catch (error) {
      console.error('Error setting up schedule:', error);
      setResults(prev => ({ ...prev, schedule: { error: 'Failed to setup schedule' } }));
    } finally {
      setLoading(prev => ({ ...prev, schedule: false }));
    }
  };

  // Function to setup everything
  const setupAll = async () => {
    setLoading(prev => ({ ...prev, all: true }));
    try {
      // Setup in sequence
      await setupTeams();
      await setupPlayers();
      await setupSchedule();
    } finally {
      setLoading(prev => ({ ...prev, all: false }));
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
        <h2 className="text-2xl font-semibold mb-4">Initialize All Data</h2>
        <p className="mb-4">This will reset and initialize all teams, players, and matches in the correct order.</p>
        <button
          onClick={setupAll}
          disabled={loading.all || loading.teams || loading.players || loading.schedule}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading.all ? 'Setting up...' : 'Initialize All Data'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
          <h2 className="text-xl font-semibold mb-4">1. Setup Teams</h2>
          <p className="mb-4">Initialize all teams in the league.</p>
          <button
            onClick={setupTeams}
            disabled={loading.teams || loading.all}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading.teams ? 'Setting up...' : 'Setup Teams'}
          </button>
          {results.teams && (
            <div className="mt-4">
              {results.teams.error ? (
                <p className="text-red-400">{results.teams.error}</p>
              ) : (
                <p className="text-green-400">Teams setup successfully!</p>
              )}
            </div>
          )}
        </div>

        <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
          <h2 className="text-xl font-semibold mb-4">2. Setup Players</h2>
          <p className="mb-4">Add all players to their respective teams.</p>
          <button
            onClick={setupPlayers}
            disabled={loading.players || loading.all}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading.players ? 'Setting up...' : 'Setup Players'}
          </button>
          {results.players && (
            <div className="mt-4">
              {results.players.error ? (
                <p className="text-red-400">{results.players.error}</p>
              ) : (
                <p className="text-green-400">{results.players.message}</p>
              )}
            </div>
          )}
        </div>

        <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
          <h2 className="text-xl font-semibold mb-4">3. Setup Schedule</h2>
          <p className="mb-4">Create all matches for the season.</p>
          <button
            onClick={setupSchedule}
            disabled={loading.schedule || loading.all}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading.schedule ? 'Setting up...' : 'Setup Schedule'}
          </button>
          {results.schedule && (
            <div className="mt-4">
              {results.schedule.error ? (
                <p className="text-red-400">{results.schedule.error}</p>
              ) : (
                <p className="text-green-400">{results.schedule.message}</p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 flex space-x-4">
        <Link href="/teams" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
          View Teams
        </Link>
        <Link href="/matches" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
          View Matches
        </Link>
        <Link href="/admin" className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
          Back to Admin
        </Link>
      </div>
    </div>
  );
} 