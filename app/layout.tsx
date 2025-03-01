import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navigation from './components/Navigation'
import React from 'react'

const inter = Inter({ subsets: ['latin'] })

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
    <html lang="en" className="h-full bg-gray-50">
      <body className={`${inter.className} h-full`}>
        <div className="min-h-full">
          <Navigation />
          <main>
            <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  )
} 