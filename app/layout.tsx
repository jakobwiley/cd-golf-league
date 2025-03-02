import './globals.css'
import './styles/fonts.css'
import Link from 'next/link'
import { Inter } from 'next/font/google'
import Navigation from './components/Navigation'

export const metadata = {
  title: 'Country Drive Golf League',
  description: 'League management for Country Drive Golf Course',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-[#030f0f] font-grifter">
        <Navigation />
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  )
} 