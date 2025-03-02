import Link from 'next/link'

export default function Home() {
  return (
    <div className="space-y-8">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight text-masters-green font-display sm:text-6xl mb-6">
          Country Drive Golf League
        </h1>
        <p className="text-lg leading-8 text-gray-600">
          Welcome to the Country Drive Golf League portal. View match schedules, team standings, and player statistics.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 max-w-5xl mx-auto">
        <Link href="/schedule" className="card-link">
          <div className="card">
            <h2 className="card-title">Match Schedule</h2>
            <p className="card-description">View upcoming matches and starting holes</p>
          </div>
        </Link>

        <Link href="/standings" className="card-link">
          <div className="card">
            <h2 className="card-title">League Standings</h2>
            <p className="card-description">Check current team rankings and points</p>
          </div>
        </Link>

        <Link href="/teams" className="card-link">
          <div className="card">
            <h2 className="card-title">Team Management</h2>
            <p className="card-description">View and manage team rosters</p>
          </div>
        </Link>

        <Link href="/scoring" className="card-link">
          <div className="card">
            <h2 className="card-title">Match Scoring</h2>
            <p className="card-description">Enter and view match scores</p>
          </div>
        </Link>
      </div>

      <footer className="mt-12 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Country Drive Golf League
      </footer>
    </div>
  )
} 