import React from 'react';
import { prisma } from '../../../lib/prisma'
import Link from 'next/link';

export default async function ScheduleAdminPage() {
  try {
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
          {/* Admin header */}
          <div className="relative overflow-hidden rounded-3xl backdrop-blur-sm bg-gradient-to-r from-[#00df82]/30 to-[#4CAF50]/20 mb-8">
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent"></div>
            <div className="relative px-8 py-6 flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-audiowide text-white mb-2">Schedule Admin</h1>
                <p className="text-white/90 font-orbitron tracking-wide">Manage league schedule</p>
              </div>
              <Link 
                href="/schedule" 
                className="group relative overflow-hidden px-6 py-3 bg-[#030f0f]/70 text-[#00df82] rounded-lg border border-[#00df82]/30 hover:border-[#00df82]/50 backdrop-blur-sm transition-all duration-300 hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#00df82]/5 to-transparent"></div>
                <div className="absolute -top-10 -right-10 w-20 h-20 bg-[#00df82]/10 rounded-full blur-3xl group-hover:bg-[#00df82]/20 transition-all duration-500"></div>
                <span className="relative font-audiowide">Back to Schedule</span>
              </Link>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-2xl transform translate-x-1/4 -translate-y-1/4"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-black/20 to-transparent rounded-full blur-xl transform -translate-x-1/4 translate-y-1/4"></div>
          </div>
          
          {/* Admin actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative overflow-hidden rounded-xl backdrop-blur-sm bg-[#030f0f]/70 border border-[#00df82]/30 p-6">
              <div className="absolute inset-0 bg-gradient-to-b from-[#00df82]/5 to-transparent"></div>
              <h2 className="text-2xl font-audiowide text-white mb-4">Setup Schedule</h2>
              <p className="text-white/70 mb-6 font-orbitron">
                Generate the league schedule for the season. This will create all match entries based on the predefined schedule.
              </p>
              <div className="flex justify-end">
                <Link 
                  href="/api/direct-setup-schedule" 
                  className="group relative overflow-hidden px-6 py-3 bg-[#030f0f]/70 text-[#00df82] rounded-lg border border-[#00df82]/30 hover:border-[#00df82]/50 backdrop-blur-sm transition-all duration-300 hover:scale-105"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#00df82]/5 to-transparent"></div>
                  <div className="absolute -top-10 -right-10 w-20 h-20 bg-[#00df82]/10 rounded-full blur-3xl group-hover:bg-[#00df82]/20 transition-all duration-500"></div>
                  <span className="relative font-audiowide">Generate Schedule</span>
                </Link>
              </div>
            </div>
            
            <div className="relative overflow-hidden rounded-xl backdrop-blur-sm bg-[#030f0f]/70 border border-[#00df82]/30 p-6">
              <div className="absolute inset-0 bg-gradient-to-b from-[#00df82]/5 to-transparent"></div>
              <h2 className="text-2xl font-audiowide text-white mb-4">Clear Schedule</h2>
              <p className="text-white/70 mb-6 font-orbitron">
                Remove all existing matches from the schedule. This action cannot be undone.
              </p>
              <div className="flex justify-end">
                <button 
                  className="group relative overflow-hidden px-6 py-3 bg-red-900/30 text-red-400 rounded-lg border border-red-500/30 hover:border-red-500/50 backdrop-blur-sm transition-all duration-300 hover:scale-105"
                  onClick={() => {
                    if (confirm('Are you sure you want to clear the entire schedule? This cannot be undone.')) {
                      window.location.href = '/api/schedule?clear=true';
                    }
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent"></div>
                  <div className="absolute -top-10 -right-10 w-20 h-20 bg-red-500/10 rounded-full blur-3xl group-hover:bg-red-500/20 transition-all duration-500"></div>
                  <span className="relative font-audiowide">Clear All Matches</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error:', error)
    return (
      <div className="min-h-screen bg-[#030f0f] flex items-center justify-center p-4 relative overflow-hidden">
        <div className="relative overflow-hidden rounded-xl backdrop-blur-sm bg-[#030f0f]/70 p-8 max-w-lg w-full border border-[#00df82]/30 z-10">
          <div className="relative">
            <h2 className="text-2xl font-audiowide text-white mb-4">Error</h2>
            <p className="text-white/70 mb-6 font-orbitron">
              An error occurred while loading the admin page.
            </p>
            <div className="flex justify-end">
              <Link 
                href="/schedule" 
                className="group relative overflow-hidden px-6 py-3 bg-[#030f0f]/70 text-[#00df82] rounded-lg border border-[#00df82]/30 hover:border-[#00df82]/50 backdrop-blur-sm transition-all duration-300 hover:scale-105"
              >
                <span className="relative font-audiowide">Back to Schedule</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }
} 