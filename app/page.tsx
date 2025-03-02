import Link from 'next/link'

export default function Home() {
  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-[#030f0f]">
      {/* Layered background design */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        {/* Base dark layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-[#030f0f] to-black" />
        
        {/* Diagonal stripe layers */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full transform -skew-y-12 bg-[#00df82]/5" />
          <div className="absolute top-0 left-1/4 w-full h-full transform -skew-y-12 bg-[#00df82]/3" />
        </div>
        
        {/* Subtle white accent layer */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.02] via-transparent to-white/[0.02]" />
        
        {/* Dark overlay for depth */}
        <div className="absolute inset-0 bg-black/20" />
        
        {/* Subtle texture for dimension */}
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(to right, transparent 1px, transparent 1px),
                           linear-gradient(to bottom, rgba(0, 223, 130, 0.05) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />
        
        {/* Green accent glow */}
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-[#00df82]/5 blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="relative">
            <div className="absolute -inset-x-20 -inset-y-12 bg-gradient-to-r from-[#00df82]/10 via-white/5 to-[#00df82]/10 transform rotate-6 rounded-3xl blur-xl" />
            <h1 className="relative text-4xl font-bold tracking-tight text-white sm:text-6xl font-grifter">
              <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-[#00df82] via-white to-[#00df82]">
                Country Drive Golf League
              </span>
            </h1>
          </div>
          <p className="mt-6 text-lg leading-8 text-white/90 font-grifter">
            Welcome to the Country Drive Golf League management system. Track matches, scores, and standings for the season.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="/schedule"
              className="relative group rounded-lg bg-[#00df82] px-5 py-3 text-sm font-bold text-black shadow-lg hover:bg-[#00df82]/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00df82] transition-all duration-200 font-grifter overflow-hidden"
            >
              <span className="relative z-10">View Schedule</span>
              <div className="absolute inset-0 transform translate-y-full group-hover:translate-y-0 bg-gradient-to-r from-[#00df82] via-[#00df82]/90 to-[#00df82] transition-transform duration-200" />
            </a>
            <a
              href="/standings"
              className="relative group rounded-lg bg-white/5 backdrop-blur-sm px-5 py-3 text-sm font-bold text-white border border-white/10 shadow-lg hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all duration-200 font-grifter overflow-hidden"
            >
              <span className="relative z-10">Leaderboard</span>
              <div className="absolute inset-0 transform translate-y-full group-hover:translate-y-0 bg-white/10 transition-transform duration-200" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
} 