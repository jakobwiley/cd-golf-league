import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-6">CD Golf League</h1>
        <p className="text-gray-600 mb-6 text-center">
          Welcome to the CD Golf League application. This is a simplified version for testing deployment.
        </p>
        <div className="grid grid-cols-1 gap-4">
          <Link href="/teams" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 text-center">
            View Teams
          </Link>
          <Link href="/schedule" className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 text-center">
            View Schedule
          </Link>
          <Link href="/standings" className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 text-center">
            View Standings
          </Link>
        </div>
      </div>
    </main>
  )
} 