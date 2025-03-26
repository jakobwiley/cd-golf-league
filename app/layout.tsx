import './globals.css'
import Link from 'next/link'
import type { Metadata, Viewport } from 'next'
import { Inter, Orbitron, Audiowide } from 'next/font/google'
import Navigation from './components/Navigation'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })
const orbitron = Orbitron({ 
  subsets: ['latin'], 
  variable: '--font-orbitron',
  display: 'swap',
})
const audiowide = Audiowide({ 
  subsets: ['latin'], 
  weight: '400', 
  variable: '--font-audiowide',
  display: 'swap',
})

export const viewport: Viewport = {
  themeColor: '#00df82',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export const metadata: Metadata = {
  title: 'Country Drive Golf League',
  description: 'Country Drive Golf League scoring and management app',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'CD Golf'
  },
  formatDetection: {
    telephone: false
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${orbitron.variable} ${audiowide.variable}`}>
      <body className={`${inter.className} min-h-screen bg-[#030f0f]`}>
        <Navigation />
        <main>
          {children}
        </main>
        <Toaster position="top-right" />
      </body>
    </html>
  )
}