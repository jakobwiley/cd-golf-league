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
        sans: ['var(--font-montserrat)'],
        display: ['var(--font-playfair-display)'],
        grifter: ['Grifter', 'sans-serif'],
        orbitron: ['var(--font-orbitron)', 'sans-serif'],
        audiowide: ['var(--font-audiowide)', 'sans-serif'],
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
      boxShadow: {
        'masters': '0 1px 3px 0 rgba(0, 103, 71, 0.1), 0 1px 2px -1px rgba(0, 103, 71, 0.1)',
        'masters-lg': '0 10px 15px -3px rgba(0, 103, 71, 0.1), 0 4px 6px -4px rgba(0, 103, 71, 0.1)',
      },
    },
  },
  plugins: [],
} 