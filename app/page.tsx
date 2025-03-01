import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-masters-text">
          Welcome to Country Drive Golf League
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Manage your golf league matches, teams, and standings
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Link
          href="/matches"
          className="card hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <h3 className="text-lg font-medium text-masters-green">Score Match</h3>
          <p className="mt-1 text-sm text-gray-600">
            Enter scores for the current match
          </p>
        </Link>

        <Link
          href="/teams"
          className="card hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <h3 className="text-lg font-medium text-masters-green">Manage Teams</h3>
          <p className="mt-1 text-sm text-gray-600">
            View and edit team information
          </p>
        </Link>

        <Link
          href="/schedule"
          className="card hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <h3 className="text-lg font-medium text-masters-green">Schedule</h3>
          <p className="mt-1 text-sm text-gray-600">
            View upcoming matches
          </p>
        </Link>

        <Link
          href="/standings"
          className="card hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <h3 className="text-lg font-medium text-masters-green">Standings</h3>
          <p className="mt-1 text-sm text-gray-600">
            View current league standings
          </p>
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-xl font-semibold text-masters-text mb-4">
            Quick Stats
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-500">Week</p>
              <p className="mt-1 text-2xl font-semibold text-masters-green">4</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-500">Teams</p>
              <p className="mt-1 text-2xl font-semibold text-masters-green">10</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-500">Matches Played</p>
              <p className="mt-1 text-2xl font-semibold text-masters-green">12</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 