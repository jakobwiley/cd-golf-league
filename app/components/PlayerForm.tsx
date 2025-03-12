'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface PlayerFormProps {
  teamId: string
}

export function PlayerForm({ teamId }: PlayerFormProps) {
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    if (!name.trim()) {
      setError('Player name is required')
      return
    }
    
    try {
      setIsLoading(true)
      
      const playerData = {
        name: name.trim(),
        teamId
      }
      
      console.log('Submitting player form with data:', playerData)
      
      const response = await fetch('/api/players', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(playerData),
      })
      
      console.log('Response status:', response.status)
      
      let data
      try {
        data = await response.json()
        console.log('Response data:', data)
      } catch (parseError) {
        console.error('Error parsing response:', parseError)
        throw new Error('Failed to parse server response')
      }
      
      if (!response.ok) {
        const errorMessage = data?.error || data?.details || 'Failed to add player'
        console.error('Server error:', errorMessage)
        throw new Error(errorMessage)
      }
      
      alert('Player added successfully')
      setName('')
      router.refresh()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.error('Error adding player:', error)
      setError(errorMessage)
      alert(`Error adding player: ${errorMessage}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <div className="space-y-2">
        <label htmlFor="name" className="block text-sm font-medium">Player Name</label>
        <input
          id="name"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter player name"
          required
          disabled={isLoading}
        />
      </div>
      {error && (
        <div className="text-red-500 text-sm">
          Error: {error}
        </div>
      )}
      <button 
        type="submit" 
        disabled={isLoading} 
        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {isLoading ? 'Adding Player...' : 'Add Player'}
      </button>
    </form>
  )
} 