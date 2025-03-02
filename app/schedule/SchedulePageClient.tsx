'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import ScheduleForm from '../components/ScheduleForm'
import type { Team, Match } from '@prisma/client'

interface SchedulePageClientProps {
  teams: Team[]
  matches: (Match & {
    homeTeam: Team
    awayTeam: Team
  })[]
}

export default function SchedulePageClient({ teams, matches }: SchedulePageClientProps) {
  const handleSubmit = async (data: any) => {
    // Handle form submission
    console.log('Form submitted:', data)
  }

  return (
    <div className="min-h-screen bg-[#030f0f]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#92E3A9] to-[#4CAF50] mb-8">
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent"></div>
          <div className="relative px-8 py-6">
            <h1 className="text-4xl font-bold text-white mb-2 font-grifter">Schedule</h1>
            <p className="text-white/90 font-grifter">View and manage upcoming matches</p>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-2xl transform translate-x-1/4 -translate-y-1/4"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-black/20 to-transparent rounded-full blur-xl transform -translate-x-1/4 translate-y-1/4"></div>
        </div>
        
        <div className="space-y-8">
          {/* Schedule Form */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-white/10">
            <h2 className="text-2xl font-grifter text-white mb-6">Create New Match</h2>
            <ScheduleForm teams={teams} onSubmit={handleSubmit} />
          </div>

          {/* Upcoming Matches */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
            <div className="px-6 py-5 border-b border-white/10">
              <h2 className="text-2xl font-grifter text-white">Upcoming Matches</h2>
            </div>
            
            {/* Mobile view: Cards */}
            <div className="block sm:hidden">
              <div className="divide-y divide-white/10">
                {matches.map((match) => (
                  <div key={match.id} className="p-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-white/60">
                        {format(new Date(match.date), 'MMM d, yyyy')}
                      </div>
                      <div className="text-sm font-medium text-[#00df82]">
                        Week {match.weekNumber}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="font-medium text-white/80">Home:</div>
                        <div className="text-white">{match.homeTeam.name}</div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="font-medium text-white/80">Away:</div>
                        <div className="text-white">{match.awayTeam.name}</div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="font-medium text-white/80">Starting Hole:</div>
                        <div className="text-white">{match.startingHole}</div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="font-medium text-white/80">Status:</div>
                        <div className="text-white capitalize">{match.status.toLowerCase()}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop view: Table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="min-w-full divide-y divide-white/10">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Week</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Home Team</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Away Team</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Starting Hole</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {matches.map((match) => (
                    <tr key={match.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        {format(new Date(match.date), 'MMM d, yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        {match.weekNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        {match.homeTeam.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        {match.awayTeam.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        {match.startingHole}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white capitalize">
                        {match.status.toLowerCase()}
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
  )
} 