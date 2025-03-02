'use client'

import { useState } from 'react'
import { format } from 'date-fns'

interface PlayerFormProps {
  onSubmit: (playerData: any) => void
  onCancel: () => void
  initialData?: {
    id?: string
    name?: string
    ghinNumber?: string
    handicapIndex?: number
  }
}

interface GHINData {
  firstName: string
  lastName: string
  handicapIndex: string
  club: string
  lastUpdated: string
  association: string
}

export default function PlayerForm({ onSubmit, onCancel, initialData }: PlayerFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    ghinNumber: initialData?.ghinNumber || '',
    handicapIndex: initialData?.handicapIndex || 0,
  })
  const [ghinData, setGHINData] = useState<GHINData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchGHINData = async (ghinNumber: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/ghin?ghinNumber=${ghinNumber}`)
      if (!response.ok) {
        throw new Error('Failed to fetch GHIN data')
      }
      const data = await response.json()
      
      setGHINData({
        firstName: data.firstName,
        lastName: data.lastName,
        handicapIndex: data.handicapInfo.handicapIndex,
        club: data.club,
        lastUpdated: data.handicapInfo.lastUpdated,
        association: data.handicapInfo.association,
      })

      // Auto-fill name and handicap if they're empty or unchanged from initial
      if (!formData.name || formData.name === initialData?.name) {
        setFormData(prev => ({
          ...prev,
          name: `${data.firstName} ${data.lastName}`,
          handicapIndex: parseFloat(data.handicapInfo.handicapIndex) || 0
        }))
      }
    } catch (error) {
      console.error('Error fetching GHIN data:', error)
      setError('Unable to find golfer with this GHIN number')
    } finally {
      setLoading(false)
    }
  }

  const handleGHINBlur = () => {
    if (formData.ghinNumber && formData.ghinNumber.length >= 7) {
      fetchGHINData(formData.ghinNumber)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.ghinNumber) {
      setError('Name and GHIN number are required')
      return
    }
    onSubmit({
      ...formData,
      id: initialData?.id,
      handicapIndex: parseFloat(formData.handicapIndex.toString()),
      ghinData: ghinData,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="ghinNumber" className="block text-sm font-medium text-gray-700">
            GHIN Number
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="ghinNumber"
              value={formData.ghinNumber}
              onChange={(e) => {
                setFormData({ ...formData, ghinNumber: e.target.value })
                setError(null)
              }}
              onBlur={handleGHINBlur}
              className="input-field"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Player Name
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="handicapIndex" className="block text-sm font-medium text-gray-700">
            Handicap Index
          </label>
          <div className="mt-1">
            <input
              type="number"
              id="handicapIndex"
              step="0.1"
              min="-10"
              max="54"
              value={formData.handicapIndex}
              onChange={(e) => setFormData({ ...formData, handicapIndex: parseFloat(e.target.value) || 0 })}
              className="input-field"
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              This value will be used to calculate strokes received on each hole
            </p>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-masters-green"></div>
          </div>
        )}

        {error && (
          <div className="text-red-600 text-sm">{error}</div>
        )}

        {ghinData && !loading && (
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <h4 className="text-sm font-medium text-masters-green">GHIN Information</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">GHIN Handicap Index</p>
                <p className="font-medium">{ghinData.handicapIndex}</p>
              </div>
              <div>
                <p className="text-gray-500">Club</p>
                <p className="font-medium">{ghinData.club}</p>
              </div>
              <div>
                <p className="text-gray-500">Association</p>
                <p className="font-medium">{ghinData.association}</p>
              </div>
              <div>
                <p className="text-gray-500">Last Updated</p>
                <p className="font-medium">
                  {format(new Date(ghinData.lastUpdated), 'MMM d, yyyy')}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary"
          disabled={loading}
        >
          {initialData ? 'Update Player' : 'Add Player'}
        </button>
      </div>
    </form>
  )
} 