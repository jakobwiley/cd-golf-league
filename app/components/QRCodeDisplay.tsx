'use client'

import { useState, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'

export default function QRCodeDisplay() {
  const [url, setUrl] = useState('')
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    
    // Dynamically get the current URL
    const currentUrl = window.location.origin
    
    // Use the current URL or fallback to the production URL
    setUrl(currentUrl || 'https://cd-gl-2025-kw8ieb504-jakes-projects-9070cd0b.vercel.app')
  }, [])

  if (!isClient) {
    return (
      <div className="flex justify-center items-center p-4 bg-white rounded-lg">
        <div className="w-[200px] h-[200px] bg-gray-200 animate-pulse rounded-lg"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center">
      <div className="p-4 bg-white rounded-lg">
        <QRCodeSVG value={url} size={200} />
      </div>
      <p className="mt-3 text-sm text-white/70 text-center">
        {url}
      </p>
      <p className="mt-1 text-xs text-white/50 text-center">
        Scan this QR code to access the app on your mobile device
      </p>
    </div>
  )
} 