import Link from 'next/link'

export default function AdminPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Teams Management</h2>
          <p className="text-gray-600 mb-4">Manage teams in the league.</p>
          <Link href="/admin/teams" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Manage Teams
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Players Management</h2>
          <p className="text-gray-600 mb-4">Manage players and their handicaps.</p>
          <div className="flex space-x-4">
            <Link href="/admin/players" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Manage Players
            </Link>
            <Link href="/api/direct-add-players" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
              Auto-Add Players
            </Link>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Schedule Management</h2>
          <p className="text-gray-600 mb-4">Manage the league schedule.</p>
          <div className="flex space-x-4">
            <Link href="/schedule" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              View Schedule
            </Link>
            <Link href="/api/direct-setup-schedule" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
              Setup Schedule
            </Link>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Match Scoring</h2>
          <p className="text-gray-600 mb-4">Record scores for matches.</p>
          <Link href="/admin/scoring" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Score Matches
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 col-span-1 md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Data Initialization</h2>
          <p className="text-gray-600 mb-4">Initialize or reset all data for the application. Use this if data is missing in the production environment.</p>
          <div className="flex space-x-4">
            <Link href="/admin/setup" className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
              Initialize All Data
            </Link>
            <Link href="/api/force-setup" className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
              Force Setup (Direct)
            </Link>
          </div>
          <p className="text-gray-500 mt-2 text-sm">Use "Force Setup" if players are not showing up on the teams page or if matches are missing.</p>
        </div>
      </div>
    </div>
  )
} 