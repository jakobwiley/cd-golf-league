import './globals.css'
import Link from 'next/link'
import { Inter } from 'next/font/google'
import Navigation from './components/Navigation'
// import './styles/fonts.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Country Drive Golf League',
  description: 'Country Drive Golf League',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Remove any font preloading or other font-related tags */}
      </head>
      <body className={`${inter.className} h-full bg-[#030f0f]`}>
        <Navigation />
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  )
} 