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
          {/* Hero section - Removed background */}
          <div className="relative mb-20 text-center">
            <h1 className="text-6xl font-bold text-white mb-6 font-audiowide tracking-wider">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00df82] via-[#92E3A9] to-[#4CAF50]">
                Country Drive
              </span>
              <br />
              <span className="text-5xl font-orbitron tracking-widest text-white">GOLF LEAGUE</span>
            </h1>
            <p className="text-white/90 text-xl max-w-2xl mx-auto">
              Track matches, scores, and standings for the season
            </p>
            
            {/* Decorative elements */}
            <div className="absolute -top-10 -left-10 w-20 h-20 border border-[#00df82]/30 rounded-full"></div>
            <div className="absolute -bottom-10 -right-10 w-20 h-20 border border-[#00df82]/30 rounded-full"></div>
            <div className="absolute top-1/2 -translate-y-1/2 -left-20 w-10 h-10 bg-[#00df82]/10 rounded-full blur-md"></div>
            <div className="absolute top-1/2 -translate-y-1/2 -right-20 w-10 h-10 bg-[#00df82]/10 rounded-full blur-md"></div>
          </div>

          {/* Updated Navigation buttons - only matches and standings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {/* Matches Button */}
            <Link href="/matches" 
                  className="group relative overflow-hidden rounded-2xl border border-[#00df82]/30 backdrop-blur-sm bg-[#030f0f]/50 p-8 transition-all duration-300 hover:scale-105 hover:bg-[#030f0f]/70 hover:border-[#00df82]/50">
              <div className="absolute inset-0 bg-gradient-to-br from-[#00df82]/5 to-transparent"></div>
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#00df82]/10 rounded-full blur-3xl group-hover:bg-[#00df82]/20 transition-all duration-500"></div>
              
              <div className="relative flex items-center">
                <div className="mr-6 bg-[#00df82]/10 p-4 rounded-xl">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#00df82]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-3xl font-audiowide text-white mb-2 group-hover:text-[#00df82] transition-colors">Matches</h2>
                  <p className="text-white/70 font-light">View upcoming and past matches</p>
                </div>
              </div>
              
              <div className="absolute bottom-4 right-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#00df82] opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </Link>
            
            {/* Standings Button */}
            <Link href="/standings" 
                  className="group relative overflow-hidden rounded-2xl border border-[#00df82]/30 backdrop-blur-sm bg-[#030f0f]/50 p-8 transition-all duration-300 hover:scale-105 hover:bg-[#030f0f]/70 hover:border-[#00df82]/50">
              <div className="absolute inset-0 bg-gradient-to-br from-[#00df82]/5 to-transparent"></div>
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#00df82]/10 rounded-full blur-3xl group-hover:bg-[#00df82]/20 transition-all duration-500"></div>
              
              <div className="relative flex items-center">
                <div className="mr-6 bg-[#00df82]/10 p-4 rounded-xl">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#00df82]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-3xl font-audiowide text-white mb-2 group-hover:text-[#00df82] transition-colors">Standings</h2>
                  <p className="text-white/70 font-light">View current leaderboard</p>
                </div>
              </div>
              
              <div className="absolute bottom-4 right-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#00df82] opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </Link>
          </div>

          {/* QR Code section - updated design */}
          <div className="relative overflow-hidden rounded-2xl border border-[#00df82]/20 backdrop-blur-sm bg-[#030f0f]/70 p-8">
            <div className="absolute inset-0 bg-gradient-to-b from-[#00df82]/5 to-transparent"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#00df82]/5 rounded-full blur-3xl"></div>
            
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="md:w-1/2">
                <h2 className="text-2xl font-audiowide text-white mb-4">Mobile Access</h2>
                <p className="text-white/70 mb-4">
                  Scan this QR code to access the Country Drive Golf League app on your mobile device.
                </p>
                <p className="text-white/50 text-sm">
                  Get real-time updates, view scores, and track standings on the go.
                </p>
              </div>
              <div className="md:w-1/2 flex justify-center">
                <div className="p-2 bg-white/10 backdrop-blur-md rounded-xl">
                  <QRCodeDisplay />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 