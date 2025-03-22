const { fontFamily } = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'masters-green': '#006747',
        'augusta-gold': '#FEDB00',
        'masters-cream': '#FFF4E4',
      },
      fontFamily: {
        orbitron: ['var(--font-orbitron)', ...fontFamily.sans],
        audiowide: ['var(--font-audiowide)', ...fontFamily.sans],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'pulse-subtle': 'pulseSubtle 2s infinite',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
  safelist: [
    'text-[#00df82]',
    'text-red-500',
    'bg-[#00df82]',
    'bg-[#030f0f]',
    'border-[#00df82]',
    'font-audiowide',
    'font-orbitron',
    'text-[#00df82]/70',
    'bg-[#030f0f]/50',
    'bg-[#030f0f]/70',
    'border-[#00df82]/10',
    'border-[#00df82]/20',
    'border-[#00df82]/30',
    'border-[#00df82]/50',
    'hover:text-[#00df82]',
    'text-[10px]',
    'bg-gradient-to-r',
    'from-[#00df82]/20',
    'from-[#00df82]/40',
    'to-[#4CAF50]/10',
    'to-[#4CAF50]/30',
    'hover:from-[#00df82]/40',
    'hover:from-[#00df82]/60',
    'hover:to-[#4CAF50]/30',
    'hover:to-[#4CAF50]/50',
    'hover:border-[#00df82]',
    'shadow-[0_0_10px_rgba(0,223,130,0.2)]',
    'shadow-[0_0_15px_rgba(0,223,130,0.3)]',
    'shadow-[0_0_15px_rgba(0,223,130,0.4)]',
    'hover:shadow-[0_0_15px_rgba(0,223,130,0.4)]',
    'hover:shadow-[0_0_20px_rgba(0,223,130,0.5)]',
    'transform',
    'hover:scale-105',
    'group-hover:animate-shimmer',
    'via-[#00df82]/10'
  ]
}