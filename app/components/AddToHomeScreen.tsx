'use client'

import { useState, useEffect } from 'react'

export default function AddToHomeScreen() {
  const [showPrompt, setShowPrompt] = useState(false)
  const [installPromptEvent, setInstallPromptEvent] = useState<any>(null)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    // Check if it's iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    setIsIOS(isIOS)

    // Check if the app is already installed
    const isStandalone = 'standalone' in window.navigator && (window.navigator as any).standalone
    
    // Only show the prompt if the app is not installed
    if (isStandalone) {
      return
    }

    // For non-iOS devices, listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the default prompt
      e.preventDefault()
      // Store the event for later use
      setInstallPromptEvent(e)
      // Show our custom prompt
      setShowPrompt(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // For iOS devices, check if the user has visited before
    if (isIOS) {
      const hasVisitedBefore = localStorage.getItem('hasVisitedBefore')
      if (!hasVisitedBefore) {
        // First visit, set the flag and show the prompt
        localStorage.setItem('hasVisitedBefore', 'true')
        setShowPrompt(true)
      } else {
        // Check if it's been more than a week since the last prompt
        const lastPrompt = localStorage.getItem('lastPrompt')
        if (lastPrompt) {
          const lastPromptDate = new Date(lastPrompt)
          const now = new Date()
          const diffTime = Math.abs(now.getTime() - lastPromptDate.getTime())
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
          if (diffDays > 7) {
            // It's been more than a week, show the prompt again
            localStorage.setItem('lastPrompt', now.toISOString())
            setShowPrompt(true)
          }
        } else {
          // No last prompt date, set it and show the prompt
          localStorage.setItem('lastPrompt', new Date().toISOString())
          setShowPrompt(true)
        }
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstall = () => {
    if (installPromptEvent) {
      // Show the install prompt
      installPromptEvent.prompt()
      // Wait for the user to respond to the prompt
      installPromptEvent.userChoice.then((choiceResult: { outcome: string }) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt')
        } else {
          console.log('User dismissed the install prompt')
        }
        // Reset the installPromptEvent
        setInstallPromptEvent(null)
        // Hide the prompt
        setShowPrompt(false)
      })
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    // Remember that the user dismissed the prompt
    localStorage.setItem('lastPrompt', new Date().toISOString())
  }

  if (!showPrompt) {
    return null
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 z-50">
      <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 shadow-lg border border-white/20">
        <div className="flex items-start">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-1">Add to Home Screen</h3>
            {isIOS ? (
              <p className="text-gray-300 text-sm">
                Install this app on your device: tap <span className="inline-block"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg></span> then "Add to Home Screen"
              </p>
            ) : (
              <p className="text-gray-300 text-sm">
                Install this app on your device for quick and easy access when you're on the go.
              </p>
            )}
          </div>
          <button 
            onClick={handleDismiss} 
            className="text-gray-400 hover:text-white"
            aria-label="Dismiss"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {!isIOS && (
          <button
            onClick={handleInstall}
            className="mt-3 w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Install App
          </button>
        )}
      </div>
    </div>
  )
} 