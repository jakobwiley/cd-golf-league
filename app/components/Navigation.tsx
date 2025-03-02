'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navigation() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path ? 'nav-link-active' : ''
  }

  return (
    <nav className="nav-container">
      <div className="nav-content">
        <div className="nav-items">
          <div className="nav-logo">
            <Link href="/" className="nav-logo-text">
              Country Drive Golf League
            </Link>
          </div>
          <div className="nav-menu">
            <Link 
              href="/matches" 
              className={`nav-link ${isActive('/matches')}`}
            >
              Matches
            </Link>
            <Link 
              href="/teams" 
              className={`nav-link ${isActive('/teams')}`}
            >
              Teams
            </Link>
            <Link 
              href="/schedule" 
              className={`nav-link ${isActive('/schedule')}`}
            >
              Schedule
            </Link>
            <Link 
              href="/standings" 
              className={`nav-link ${isActive('/standings')}`}
            >
              Standings
            </Link>
            <Link 
              href="/scoring" 
              className={`nav-link ${isActive('/scoring')}`}
            >
              Scoring
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
} 