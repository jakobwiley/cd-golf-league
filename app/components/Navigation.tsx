'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <nav className="bg-[#001f1f] fixed top-0 left-0 right-0 z-50 shadow-md shadow-[#00df82]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link 
              href="/" 
              className="flex items-center"
            >
              <span className="text-white text-xl font-audiowide">CD Golf League</span>
              <span role="img" aria-label="golf flag" className="text-xl ml-1">⛳</span>
            </Link>
          </div>
          
          {/* Mobile menu button - in green box */}
          <div className="md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md bg-[#004f3f] text-[#00df82] hover:bg-[#006f5f] border border-[#00df82]/30"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              <Link href="/teams" className="text-white hover:text-[#00df82] px-3 py-2 text-sm font-orbitron">Teams</Link>
              <Link href="/schedule" className="text-white hover:text-[#00df82] px-3 py-2 text-sm font-orbitron">Schedule</Link>
              <Link href="/matches" className="text-white hover:text-[#00df82] px-3 py-2 text-sm font-orbitron">Matches</Link>
              <Link href="/standings" className="text-white hover:text-[#00df82] px-3 py-2 text-sm font-orbitron">Standings</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu - positioned below the header */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#001f1f] border-t border-[#00df82]/10">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link href="/teams" className="text-white hover:text-[#00df82] block px-3 py-2 text-base font-orbitron">Teams</Link>
            <Link href="/schedule" className="text-white hover:text-[#00df82] block px-3 py-2 text-base font-orbitron">Schedule</Link>
            <Link href="/matches" className="text-white hover:text-[#00df82] block px-3 py-2 text-base font-orbitron">Matches</Link>
            <Link href="/standings" className="text-white hover:text-[#00df82] block px-3 py-2 text-base font-orbitron">Standings</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;