'use client'

import { useEffect, useState } from 'react'

interface NotificationProps {
  message: string
  type: 'success' | 'error' | 'info'
  onClose?: () => void
  duration?: number
}

export default function Notification({
  message,
  type,
  onClose,
  duration = 5000,
}: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        onClose?.()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  const bgColor = {
    success: 'bg-masters-green',
    error: 'bg-red-600',
    info: 'bg-augusta-gold',
  }[type]

  const textColor = type === 'info' ? 'text-masters-text' : 'text-white'

  if (!isVisible) return null

  return (
    <div
      className={`fixed bottom-4 right-4 ${bgColor} ${textColor} px-6 py-3 rounded-lg shadow-lg
                  animate-slide-up flex items-center justify-between min-w-[300px]`}
      role="alert"
    >
      <p className="text-sm font-medium">{message}</p>
      <button
        onClick={() => {
          setIsVisible(false)
          onClose?.()
        }}
        className="ml-4 text-sm font-medium opacity-75 hover:opacity-100 transition-opacity"
      >
        ×
      </button>
    </div>
  )
} 