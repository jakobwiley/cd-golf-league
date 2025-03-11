'use client'

import { useState, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'

export default function QRCodeShare() {
  const [url, setUrl] = useState('')
  const [showQR, setShowQR] = useState(false)

  useEffect(() => {
    // Get the current URL
    setUrl(window.location.origin)
  }, [])

  if (!url) {
    return null
  }

  return (
    <div className="mt-8">
      <button
        onClick={() => setShowQR(!showQR)}
        className="flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-lg transition-colors w-full"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2V5h1v1H5zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zm2 2v-1h1v1H5zM13 3a1 1 0 00-1 1v3a1 1 0 001 1h3a1 1 0 001-1V4a1 1 0 00-1-1h-3zm1 2v1h1V5h-1z" clipRule="evenodd" />
          <path d="M11 4a1 1 0 10-2 0v1a1 1 0 002 0V4zM10 7a1 1 0 011 1v1h2a1 1 0 110 2h-3a1 1 0 01-1-1V8a1 1 0 011-1zM16 9a1 1 0 100 2 1 1 0 000-2zM9 13a1 1 0 011-1h1a1 1 0 110 2v2a1 1 0 11-2 0v-3zM7 11a1 1 0 100-2H4a1 1 0 100 2h3zM17 13a1 1 0 01-1 1h-2a1 1 0 110-2h2a1 1 0 011 1zM16 17a1 1 0 100-2h-3a1 1 0 100 2h3z" />
        </svg>
        <span>{showQR ? 'Hide QR Code' : 'Share via QR Code'}</span>
      </button>

      {showQR && (
        <div className="mt-4 p-4 bg-white rounded-lg flex flex-col items-center">
          <QRCodeSVG value={url} size={200} />
          <p className="mt-2 text-gray-800 text-sm text-center">
            Scan this QR code to access the Country Drive Golf League app
          </p>
        </div>
      )}
    </div>
  )
} 