'use client'

import { useState } from 'react'
import { calculateCourseHandicap, validateHandicapIndex } from '../lib/handicap'

interface Player {
  name: string
  ghinNumber: string
  handicapIndex: string
  courseHandicap: string
  club?: string
}

interface GHINData {
  name: string
  handicapIndex: string
  courseHandicap: string
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
      { name: '', ghinNumber: '', handicapIndex: '', courseHandicap: '', club: '' },
      { name: '', ghinNumber: '', handicapIndex: '', courseHandicap: '', club: '' },
    ],
  })
  const [loading, setLoading] = useState<Record<number, boolean>>({})
  const [errors, setErrors] = useState<Record<number, string>>({})
  const [ghinData, setGhinData] = useState<Record<number, GHINData>>({})
  const [manuallyEdited, setManuallyEdited] = useState<Record<number, boolean>>({})

  const handlePlayerChange = (index: number, field: keyof Player, value: string) => {
    const newPlayers = [...formData.players]
    newPlayers[index] = { ...newPlayers[index], [field]: value }

    // If GHIN number changes, clear related fields until validation
    if (field === 'ghinNumber') {
      newPlayers[index].handicapIndex = ''
      newPlayers[index].courseHandicap = ''
      newPlayers[index].club = ''
      setGhinData({ ...ghinData, [index]: undefined })
      setManuallyEdited({ ...manuallyEdited, [index]: false })
    }
    // Track manual edits of handicap index
    else if (field === 'handicapIndex') {
      setManuallyEdited({ ...manuallyEdited, [index]: true })
      if (validateHandicapIndex(value)) {
        const handicapIndex = parseFloat(value)
        const courseHandicap = calculateCourseHandicap(handicapIndex)
        newPlayers[index].courseHandicap = courseHandicap.toString()
      }
    }

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
    if (!ghinNumber) {
      setErrors({
        ...errors,
        [index]: 'GHIN number is required'
      })
      return
    }

    setLoading({ ...loading, [index]: true })
    setErrors({ ...errors, [index]: '' })

    try {
      const response = await fetch(`/api/ghin?ghinNumber=${ghinNumber}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to validate GHIN number')
      }

      const handicapIndex = data.handicapInfo.handicapIndex
      const courseHandicap = calculateCourseHandicap(parseFloat(handicapIndex))
      const name = data.firstName && data.lastName ? `${data.firstName} ${data.lastName}` : formData.players[index].name

      // Store GHIN data for potential reset
      setGhinData({
        ...ghinData,
        [index]: {
          name,
          handicapIndex,
          courseHandicap: courseHandicap.toString(),
          club: data.club || '',
        }
      })

      const newPlayers = [...formData.players]
      newPlayers[index] = {
        ...newPlayers[index],
        name,
        handicapIndex,
        courseHandicap: courseHandicap.toString(),
        club: data.club || '',
      }
      setFormData({ ...formData, players: newPlayers })
      setManuallyEdited({ ...manuallyEdited, [index]: false })
    } catch (error) {
      console.error('GHIN validation error:', error)
      setErrors({
        ...errors,
        [index]: 'Invalid GHIN number or unable to fetch data'
      })
      
      // Clear related fields on error
      const newPlayers = [...formData.players]
      newPlayers[index] = {
        ...newPlayers[index],
        handicapIndex: '',
        courseHandicap: '',
        club: '',
      }
      setFormData({ ...formData, players: newPlayers })
      setGhinData({ ...ghinData, [index]: undefined })
      setManuallyEdited({ ...manuallyEdited, [index]: false })
    } finally {
      setLoading({ ...loading, [index]: false })
    }
  }

  const resetToGHIN = (index: number) => {
    if (!ghinData[index]) return

    const newPlayers = [...formData.players]
    newPlayers[index] = {
      ...newPlayers[index],
      name: ghinData[index].name,
      handicapIndex: ghinData[index].handicapIndex,
      courseHandicap: ghinData[index].courseHandicap,
      club: ghinData[index].club,
    }
    setFormData({ ...formData, players: newPlayers })
    setManuallyEdited({ ...manuallyEdited, [index]: false })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="teamName" className="block text-sm font-medium text-gray-700 mb-2">
          Team Name
        </label>
        <input
          type="text"
          id="teamName"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-masters-green sm:text-sm sm:leading-6"
          required
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-700">Players</h3>
        {formData.players.map((player, index) => (
          <div key={index} className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Player {index + 1} Name
                </label>
                <input
                  type="text"
                  placeholder="Enter player name"
                  value={player.name}
                  onChange={(e) => handlePlayerChange(index, 'name', e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-masters-green sm:text-sm sm:leading-6"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  GHIN Number
                </label>
                <input
                  type="text"
                  placeholder="Enter GHIN number"
                  value={player.ghinNumber}
                  onChange={(e) => handlePlayerChange(index, 'ghinNumber', e.target.value)}
                  onBlur={() => validateGHIN(index)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-masters-green sm:text-sm sm:leading-6"
                  required
                />
                {errors[index] && (
                  <p className="mt-1 text-sm text-red-600">{errors[index]}</p>
                )}
                {loading[index] && (
                  <p className="mt-1 text-sm text-gray-500">Validating GHIN...</p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Handicap Index
                    <span className="text-xs text-gray-500 ml-1">(Auto-filled from GHIN)</span>
                  </label>
                  {manuallyEdited[index] && ghinData[index] && (
                    <button
                      type="button"
                      onClick={() => resetToGHIN(index)}
                      className="text-xs text-masters-green hover:text-masters-green/80"
                    >
                      Reset to GHIN
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="Enter handicap index"
                  value={player.handicapIndex}
                  onChange={(e) => handlePlayerChange(index, 'handicapIndex', e.target.value)}
                  className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${
                    manuallyEdited[index] ? 'ring-yellow-300' : 'ring-gray-300'
                  } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-masters-green sm:text-sm sm:leading-6`}
                  required
                />
                {manuallyEdited[index] && (
                  <p className="mt-1 text-xs text-yellow-600">
                    Manually edited - differs from GHIN
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course Handicap
                  <span className="text-xs text-gray-500 ml-1">(Blue Tees)</span>
                </label>
                <input
                  type="text"
                  value={player.courseHandicap}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 bg-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6"
                  readOnly
                />
                <p className="mt-1 text-xs text-gray-500">
                  Automatically calculated for Country Drive GC
                </p>
              </div>
            </div>

            {player.club && (
              <div className="mt-2 text-sm text-gray-600">
                <p>Club: {player.club}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-masters-green rounded-md shadow-sm hover:bg-masters-green/90"
        >
          Save Team
        </button>
      </div>
    </form>
  )
} 