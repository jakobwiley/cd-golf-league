import './globals.css'
import Link from 'next/link'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import Navigation from './components/Navigation'
import AddToHomeScreen from './components/AddToHomeScreen'
// import './styles/fonts.css'

const inter = Inter({ subsets: ['latin'] })

export const viewport: Viewport = {
  themeColor: '#4CAF50',
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
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head>
      <body className={`${inter.className} h-full bg-[#030f0f]`}>
        <Navigation />
        <main className="min-h-screen">
          {children}
        </main>
        <AddToHomeScreen />
      </body>
    </html>
  )
} 