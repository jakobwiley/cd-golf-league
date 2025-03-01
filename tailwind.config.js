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
        'augusta-gold': '#FFCD00',
        'masters-white': '#FFFFFF',
        'masters-text': '#333333',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
} 