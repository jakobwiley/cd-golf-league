'use client'

import { useState } from 'react'

interface Player {
  name: string
  ghinNumber: string
  handicapIndex?: string
  club?: string
}

interface TeamFormProps {
  onSubmit: (team: { name: string; players: Player[] }) => void
  onCancel: () => void
  initialData?: {
    name: string
    players: Player[]
  }
}

export default function TeamForm({ onSubmit, onCancel, initialData }: TeamFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    players: initialData?.players || [
      { name: '', ghinNumber: '', handicapIndex: '', club: '' },
      { name: '', ghinNumber: '', handicapIndex: '', club: '' },
    ],
  })
  const [loading, setLoading] = useState<Record<number, boolean>>({})
  const [errors, setErrors] = useState<Record<number, string>>({})

  const handlePlayerChange = (index: number, field: keyof Player, value: string) => {
    const newPlayers = [...formData.players]
    newPlayers[index] = { ...newPlayers[index], [field]: value }
    setFormData({ ...formData, players: newPlayers })

    // Clear error when user starts typing
    if (errors[index]) {
      const newErrors = { ...errors }
      delete newErrors[index]
      setErrors(newErrors)
    }
  }

  const validateGHIN = async (index: number) => {
    const ghinNumber = formData.players[index].ghinNumber
    if (!ghinNumber) return

    setLoading({ ...loading, [index]: true })
    setErrors({ ...errors, [index]: '' })

    try {
      const response = await fetch(`/api/ghin?ghinNumber=${ghinNumber}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to validate GHIN number')
      }

      const newPlayers = [...formData.players]
      newPlayers[index] = {
        ...newPlayers[index],
        name: `${data.firstName} ${data.lastName}`,
        handicapIndex: data.handicapInfo.handicapIndex,
        club: data.club,
      }
      setFormData({ ...formData, players: newPlayers })
    } catch (error) {
      setErrors({
        ...errors,
        [index]: 'Invalid GHIN number or unable to fetch data',
      })
    } finally {
      setLoading({ ...loading, [index]: false })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="teamName" className="block text-sm font-medium text-gray-700">
          Team Name
        </label>
        <input
          type="text"
          id="teamName"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-masters-green focus:ring-masters-green sm:text-sm"
          required
        />
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-700">Players</h4>
        {formData.players.map((player, index) => (
          <div key={index} className="space-y-4 p-4 border rounded-lg bg-gray-50">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  GHIN Number
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="text"
                    value={player.ghinNumber}
                    onChange={(e) => handlePlayerChange(index, 'ghinNumber', e.target.value)}
                    onBlur={() => validateGHIN(index)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-masters-green focus:ring-masters-green sm:text-sm"
                    required
                  />
                </div>
                {errors[index] && (
                  <p className="mt-1 text-sm text-red-600">{errors[index]}</p>
                )}
                {loading[index] && (
                  <p className="mt-1 text-sm text-gray-500">Validating...</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Player {index + 1} Name
                </label>
                <input
                  type="text"
                  value={player.name}
                  onChange={(e) => handlePlayerChange(index, 'name', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-masters-green focus:ring-masters-green sm:text-sm"
                  required
                />
              </div>
            </div>
            
            {player.handicapIndex && (
              <div className="mt-2 text-sm text-gray-600">
                <p>Handicap Index: {player.handicapIndex}</p>
                {player.club && <p>Club: {player.club}</p>}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-masters-green"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary"
        >
          Save Team
        </button>
      </div>
    </form>
  )
} 