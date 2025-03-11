'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    // Check if we're online
    setIsOnline(navigator.onLine)

    // Add event listeners for online/offline events
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#030f0f] flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/5 backdrop-blur-xl rounded-2xl p-8 text-center">
        <div className="w-24 h-24 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-4">
          {isOnline ? 'You\'re back online!' : 'You\'re offline'}
        </h1>
        
        <p className="text-gray-300 mb-6">
          {isOnline 
            ? 'Your connection has been restored. You can now continue using the app.'
            : 'It looks like you\'ve lost your internet connection. Some features may be limited until you\'re back online.'}
        </p>
        
        {isOnline && (
          <Link href="/" className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors">
            Return to Home
          </Link>
        )}
        
        {!isOnline && (
          <div className="space-y-4">
            <p className="text-gray-400 text-sm">
              You can still access previously viewed pages and use some features offline.
            </p>
            <Link href="/" className="inline-block bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-lg transition-colors">
              Try Anyway
            </Link>
          </div>
        )}
      </div>
    </div>
  )
} 