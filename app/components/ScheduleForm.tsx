'use client'

import { useState, useEffect } from 'react'
import { Team } from '@prisma/client'
import { formatDateForForm, formatDateForAPI } from '../lib/date-utils'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

interface ScheduleFormProps {
  teams: Team[]
  onSubmit: (data: {
    id?: string
    date: string
    weekNumber: number
    homeTeamId: string
    awayTeamId: string
    startingHole: number
    status: 'SCHEDULED' | 'CANCELED' | 'COMPLETED'
  }) => void
  initialData?: {
    id?: string
    date: string | Date
    weekNumber: number
    homeTeamId: string
    awayTeamId: string
    startingHole: number
    status: 'SCHEDULED' | 'CANCELED' | 'COMPLETED'
  }
  onCancel: () => void
}

export default function ScheduleForm({
  teams,
  onSubmit,
  initialData,
  onCancel,
}: ScheduleFormProps) {
  const [propTeams, setPropTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const formSchema = z.object({
    id: z.string().optional(),
    date: z.string().min(1, 'Date is required'),
    weekNumber: z.coerce.number().min(1, 'Week number is required'),
    homeTeamId: z.string().min(1, 'Home team is required'),
    awayTeamId: z.string().min(1, 'Away team is required'),
    startingHole: z.coerce.number().min(1, 'Starting hole is required').max(9, 'Starting hole must be between 1 and 9'),
    status: z.enum(['SCHEDULED', 'CANCELED', 'COMPLETED']),
  });
  
  type FormValues = z.infer<typeof formSchema>;
  
  const { 
    register, 
    handleSubmit, 
    reset, 
    formState: { errors },
    watch
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: initialData?.id,
      date: '',
      weekNumber: 1,
      homeTeamId: '',
      awayTeamId: '',
      startingHole: 1,
      status: 'SCHEDULED' as const
    }
  });

  useEffect(() => {
    if (teams && teams.length > 0) {
      setPropTeams(teams)
    }
  }, [teams])

  useEffect(() => {
    if (initialData) {
      // Format the date for the form input
      const formattedDate = formatDateForForm(initialData.date)
      
      console.log('Setting form values with date:', initialData.date)
      console.log('Formatted date for form:', formattedDate)
      
      reset({
        id: initialData.id,
        date: formattedDate,
        weekNumber: initialData.weekNumber,
        homeTeamId: initialData.homeTeamId,
        awayTeamId: initialData.awayTeamId,
        startingHole: initialData.startingHole,
        status: initialData.status
      })
    }
  }, [initialData, reset])

  const onSubmitForm = (data: FormValues) => {
    setLoading(true)
    setError('')
    
    try {
      // Format the date for API submission
      const formattedData = {
        id: data.id,
        date: formatDateForAPI(data.date),
        weekNumber: data.weekNumber,
        homeTeamId: data.homeTeamId,
        awayTeamId: data.awayTeamId,
        startingHole: data.startingHole,
        status: data.status
      }
      
      console.log('Form data before formatting:', data);
      console.log('Submitting form data after formatting:', formattedData);
      
      onSubmit(formattedData)
    } catch (error) {
      console.error('Error submitting form:', error)
      setError('Failed to submit form. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (propTeams.length === 0) {
    return (
      <div className="text-center p-8 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl shadow-xl">
        <p className="text-white text-lg font-medium">No teams available. Create your squad first! 🏌️‍♂️</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      )}
      
      <div className="space-y-4">
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            id="date"
            {...register('date')}
            className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
          />
          {errors.date && (
            <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="weekNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Week Number
          </label>
          <input
            type="number"
            id="weekNumber"
            min="1"
            {...register('weekNumber')}
            className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
          />
          {errors.weekNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.weekNumber.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="homeTeamId" className="block text-sm font-medium text-gray-700 mb-1">
            Home Team
          </label>
          <select
            id="homeTeamId"
            {...register('homeTeamId')}
            className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
          >
            <option value="">Select Home Team</option>
            {propTeams.map((team) => (
              <option key={`home-${team.id}`} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
          {errors.homeTeamId && (
            <p className="mt-1 text-sm text-red-600">{errors.homeTeamId.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="awayTeamId" className="block text-sm font-medium text-gray-700 mb-1">
            Away Team
          </label>
          <select
            id="awayTeamId"
            {...register('awayTeamId')}
            className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
          >
            <option value="">Select Away Team</option>
            {propTeams.map((team) => (
              <option key={`away-${team.id}`} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
          {errors.awayTeamId && (
            <p className="mt-1 text-sm text-red-600">{errors.awayTeamId.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="startingHole" className="block text-sm font-medium text-gray-700 mb-1">
            Starting Hole
          </label>
          <input
            type="number"
            id="startingHole"
            min="1"
            max="9"
            {...register('startingHole')}
            className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
          />
          {errors.startingHole && (
            <p className="mt-1 text-sm text-red-600">{errors.startingHole.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="status"
            {...register('status')}
            className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
          >
            <option value="SCHEDULED">Scheduled</option>
            <option value="CANCELED">Canceled</option>
            <option value="COMPLETED">Completed</option>
          </select>
          {errors.status && (
            <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
          )}
        </div>
      </div>
      
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Saving...' : initialData?.id ? 'Update Match' : 'Create Match'}
        </button>
      </div>
    </form>
  )
} 