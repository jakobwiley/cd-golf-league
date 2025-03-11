import Link from 'next/link'

export default function Home() {
  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-[#00df82]">
      {/* Background layers */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#00df82] to-[#4CAF50]" />
        
        {/* Diagonal stripes */}
        <div className="absolute inset-0">
          {/* Lighter stripes */}
          <div className="absolute inset-0 transform -skew-y-12">
            <div className="h-[20vh] w-full bg-white/10 backdrop-blur-sm" style={{ marginTop: '0vh' }} />
            <div className="h-[20vh] w-full bg-white/5 backdrop-blur-sm" style={{ marginTop: '40vh' }} />
            <div className="h-[20vh] w-full bg-white/10 backdrop-blur-sm" style={{ marginTop: '80vh' }} />
          </div>
          
          {/* Darker stripes */}
          <div className="absolute inset-0 transform -skew-y-12">
            <div className="h-[20vh] w-full bg-black/5" style={{ marginTop: '20vh' }} />
            <div className="h-[20vh] w-full bg-black/5" style={{ marginTop: '60vh' }} />
            <div className="h-[20vh] w-full bg-black/5" style={{ marginTop: '100vh' }} />
          </div>
        </div>

        {/* Geometric elements */}
        <div className="absolute inset-0">
          {/* Plus signs */}
          <div className="absolute top-[10%] left-[20%] text-white/20 text-2xl">+</div>
          <div className="absolute top-[30%] right-[40%] text-white/20 text-2xl">+</div>
          <div className="absolute bottom-[20%] left-[60%] text-white/20 text-2xl">+</div>
          <div className="absolute top-[70%] right-[20%] text-white/20 text-2xl">+</div>
          
          {/* Circles */}
          <div className="absolute top-[20%] right-[30%] w-3 h-3 rounded-full border border-white/20"></div>
          <div className="absolute bottom-[40%] left-[40%] w-3 h-3 rounded-full border border-white/20"></div>
          <div className="absolute top-[50%] left-[20%] w-3 h-3 rounded-full border border-white/20"></div>
          <div className="absolute bottom-[30%] right-[50%] w-3 h-3 rounded-full border border-white/20"></div>
        </div>

        {/* Subtle gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/5 via-transparent to-white/5" />
      </div>

      {/* Content */}
      <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="relative">
            <div className="absolute -inset-x-20 -inset-y-12 bg-white/5 transform rotate-6 rounded-3xl blur-2xl" />
            <h1 className="relative text-4xl font-bold tracking-tight text-white sm:text-6xl">
              <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-white via-white/90 to-white">
                Country Drive Golf League
              </span>
            </h1>
          </div>
          <p className="mt-6 text-lg leading-8 text-white/90">
            Welcome to the Country Drive Golf League management system. Track matches, scores, and standings for the season.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="/schedule"
              className="relative group rounded-lg bg-white px-5 py-3 text-sm font-bold text-[#00df82] shadow-lg hover:bg-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all duration-200 font-bold overflow-hidden"
            >
              <span className="relative z-10">View Schedule</span>
              <div className="absolute inset-0 transform translate-y-full group-hover:translate-y-0 bg-gradient-to-r from-white via-white/90 to-white transition-transform duration-200" />
            </a>
            <a
              href="/standings"
              className="relative group rounded-lg bg-black/10 backdrop-blur-sm px-5 py-3 text-sm font-bold text-white border border-white/10 shadow-lg hover:bg-black/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all duration-200 font-bold overflow-hidden"
            >
              <span className="relative z-10">Leaderboard</span>
              <div className="absolute inset-0 transform translate-y-full group-hover:translate-y-0 bg-black/20 transition-transform duration-200" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
} 