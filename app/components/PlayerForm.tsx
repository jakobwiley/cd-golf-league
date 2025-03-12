'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

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
      toast.error('Player name is required')
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
      
      toast.success('Player added successfully')
      setName('')
      router.refresh()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.error('Error adding player:', error)
      setError(errorMessage)
      toast.error(`Error adding player: ${errorMessage}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <div className="space-y-2">
        <Label htmlFor="name">Player Name</Label>
        <Input
          id="name"
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
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Adding Player...' : 'Add Player'}
      </Button>
    </form>
  )
} 