import './globals.css'
import type { Metadata } from 'next'
import { Montserrat, Playfair_Display } from 'next/font/google'
import Navigation from './components/Navigation'
import React from 'react'

const montserrat = Montserrat({ 
  subsets: ['latin'],
  variable: '--font-montserrat',
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair-display',
})

export const metadata: Metadata = {
  title: 'Country Drive Golf League',
  description: 'Weekly golf league management for Country Drive Golf Course',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`h-full ${montserrat.variable} ${playfair.variable}`}>
      <body className="h-full font-sans">
        <div className="min-h-full bg-masters-cream">
          <Navigation />
          <main className="animate-fade-in">
            <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
          <footer className="bg-masters-green mt-auto py-4">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <p className="text-augusta-gold text-sm text-center">
                © {new Date().getFullYear()} Country Drive Golf League
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
} 