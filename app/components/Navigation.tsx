'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  
  // Close mobile menu when pathname changes (navigation occurs)
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  return (
    <nav className="bg-[#030f0f] border-b border-[#00df82]/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link 
              href="/" 
              className="flex items-center gap-2"
            >
              <span className="text-white text-xl font-audiowide bg-clip-text text-transparent bg-gradient-to-r from-white to-[#00df82]">CD Golf League</span>
              <span role="img" aria-label="golf flag" className="text-xl">⛳</span>
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link href="/schedule" className="text-gray-300 hover:text-[#00df82] px-3 py-2 rounded-md text-sm font-orbitron transition-colors">Schedule</Link>
                <Link href="/teams" className="text-gray-300 hover:text-[#00df82] px-3 py-2 rounded-md text-sm font-orbitron transition-colors">Teams</Link>
                <Link href="/matches" className="text-gray-300 hover:text-[#00df82] px-3 py-2 rounded-md text-sm font-orbitron transition-colors">Matches</Link>
                <Link href="/standings" className="text-gray-300 hover:text-[#00df82] px-3 py-2 rounded-md text-sm font-orbitron transition-colors">Standings</Link>
              </div>
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="relative inline-flex items-center justify-center rounded-md bg-[#00df82]/10 p-2 text-[#00df82] hover:bg-[#00df82]/20 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#030f0f] transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="absolute -inset-0.5"></span>
              <span className="sr-only">Open main menu</span>
              <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="space-y-1 px-2 pb-3 pt-2">
            <Link href="/schedule" className="text-gray-300 hover:text-[#00df82] block px-3 py-2 rounded-md text-base font-orbitron transition-colors">Schedule</Link>
            <Link href="/teams" className="text-gray-300 hover:text-[#00df82] block px-3 py-2 rounded-md text-base font-orbitron transition-colors">Teams</Link>
            <Link href="/matches" className="text-gray-300 hover:text-[#00df82] block px-3 py-2 rounded-md text-base font-orbitron transition-colors">Matches</Link>
            <Link href="/standings" className="text-gray-300 hover:text-[#00df82] block px-3 py-2 rounded-md text-base font-orbitron transition-colors">Standings</Link>
          </div>
        </div>
      )}
    </nav>
  )
} 