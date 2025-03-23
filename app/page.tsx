import Link from 'next/link'

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

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col items-center justify-center min-h-screen">
        <div className="w-full max-w-5xl">
          {/* Hero section */}
          <div className="relative mb-12 text-center">
            <h1 className="text-6xl font-bold text-white mb-6 font-audiowide tracking-wider">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00df82] via-[#92E3A9] to-[#4CAF50]">
                Country Drive
              </span>
              <br />
              <span className="text-5xl font-orbitron tracking-widest text-white">GOLF LEAGUE</span>
            </h1>
            
            {/* Decorative elements */}
            <div className="absolute -top-10 -left-10 w-20 h-20 border border-[#00df82]/30 rounded-full"></div>
            <div className="absolute -bottom-10 -right-10 w-20 h-20 border border-[#00df82]/30 rounded-full"></div>
            <div className="absolute top-1/2 -translate-y-1/2 -left-20 w-10 h-10 bg-[#00df82]/10 rounded-full blur-md"></div>
            <div className="absolute top-1/2 -translate-y-1/2 -right-20 w-10 h-10 bg-[#00df82]/10 rounded-full blur-md"></div>
          </div>

          {/* Navigation Cards - 4 column grid on desktop, 2 columns on medium screens */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {/* Teams Card */}
            <Link href="/teams" 
                  className="group bg-[#001f1f] rounded-2xl p-6 flex items-center space-x-4 hover:bg-[#001f1f]/80 transition-all">
              <div className="bg-[#00df82]/10 p-3 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#00df82]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-audiowide text-white mb-1">Teams</h2>
                <p className="text-white/70 text-sm">View teams and players</p>
              </div>
            </Link>

            {/* Schedule Card */}
            <Link href="/schedule" 
                  className="group bg-[#001f1f] rounded-2xl p-6 flex items-center space-x-4 hover:bg-[#001f1f]/80 transition-all">
              <div className="bg-[#00df82]/10 p-3 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#00df82]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-audiowide text-white mb-1">Schedule</h2>
                <p className="text-white/70 text-sm">View match schedule</p>
              </div>
            </Link>

            {/* Matches Card */}
            <Link href="/matches" 
                  className="group bg-[#001f1f] rounded-2xl p-6 flex items-center space-x-4 hover:bg-[#001f1f]/80 transition-all">
              <div className="bg-[#00df82]/10 p-3 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#00df82]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-audiowide text-white mb-1">Matches</h2>
                <p className="text-white/70 text-sm">View live scores</p>
              </div>
            </Link>

            {/* Standings Card */}
            <Link href="/standings" 
                  className="group bg-[#001f1f] rounded-2xl p-6 flex items-center space-x-4 hover:bg-[#001f1f]/80 transition-all">
              <div className="bg-[#00df82]/10 p-3 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#00df82]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-audiowide text-white mb-1">Standings</h2>
                <p className="text-white/70 text-sm">View league standings</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}