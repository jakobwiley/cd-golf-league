import Link from 'next/link'
import QRCodeDisplay from './components/QRCodeDisplay'

export default function Home() {
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
        
        {/* Diagonal lines */}
        <div className="absolute inset-0 transform -skew-y-12">
          <div className="h-[20vh] w-full bg-white/5 backdrop-blur-sm" style={{ marginTop: '10vh' }} />
          <div className="h-[20vh] w-full bg-white/5 backdrop-blur-sm" style={{ marginTop: '50vh' }} />
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center justify-center min-h-screen">
        <div className="w-full max-w-4xl">
          {/* Hero section */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#92E3A9] to-[#4CAF50] mb-12">
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent"></div>
            <div className="relative px-8 py-12 text-center">
              <h1 className="text-5xl font-bold text-white mb-4 font-grifter">Country Drive Golf League</h1>
              <p className="text-white/90 text-xl max-w-2xl mx-auto">
                Track matches, scores, and standings for the season
              </p>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-2xl transform translate-x-1/4 -translate-y-1/4"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-black/20 to-transparent rounded-full blur-xl transform -translate-x-1/4 translate-y-1/4"></div>
          </div>

          {/* Navigation cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Link href="/teams" className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 p-6 transition-transform hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-xl transform translate-x-1/4 -translate-y-1/4 group-hover:bg-white/20 transition-all"></div>
              <div className="relative">
                <h2 className="text-2xl font-bold text-white mb-2">Teams</h2>
                <p className="text-white/80">View all teams and players</p>
              </div>
            </Link>
            
            <Link href="/schedule" className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500 to-green-700 p-6 transition-transform hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-xl transform translate-x-1/4 -translate-y-1/4 group-hover:bg-white/20 transition-all"></div>
              <div className="relative">
                <h2 className="text-2xl font-bold text-white mb-2">Schedule</h2>
                <p className="text-white/80">View upcoming matches</p>
              </div>
            </Link>
            
            <Link href="/standings" className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 p-6 transition-transform hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-xl transform translate-x-1/4 -translate-y-1/4 group-hover:bg-white/20 transition-all"></div>
              <div className="relative">
                <h2 className="text-2xl font-bold text-white mb-2">Standings</h2>
                <p className="text-white/80">View current leaderboard</p>
              </div>
            </Link>
          </div>

          {/* QR Code section */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a] p-8">
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent"></div>
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="md:w-1/2">
                <h2 className="text-2xl font-bold text-white mb-4">Mobile Access</h2>
                <p className="text-white/70 mb-4">
                  Scan this QR code to access the Country Drive Golf League app on your mobile device.
                </p>
                <p className="text-white/50 text-sm">
                  Get real-time updates, view scores, and track standings on the go.
                </p>
              </div>
              <div className="md:w-1/2 flex justify-center">
                <QRCodeDisplay />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 