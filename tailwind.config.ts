import type { Config } from 'tailwindcss'

const config: Config = {
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
      },
    },
  },
  plugins: [],
}

export default config 