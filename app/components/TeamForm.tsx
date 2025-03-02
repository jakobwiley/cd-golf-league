'use client'

import { useState } from 'react'

interface TeamFormProps {
  onSubmit: (data: {
    name: string;
  }) => void;
  onCancel?: () => void;
  initialData?: {
    name: string;
  };
}

export default function TeamForm({ onSubmit, onCancel, initialData }: TeamFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div className="w-full max-w-lg mx-auto px-4 sm:px-6 lg:px-8">
      <form onSubmit={handleSubmit} className="space-y-8 bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100">
        <div className="space-y-3">
          <label 
            htmlFor="name" 
            className="block text-xl sm:text-lg font-semibold text-gray-800"
          >
            Team Name 🏌️‍♂️
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ name: e.target.value })}
            required
            className="w-full h-14 sm:h-12 px-4 py-3 text-lg sm:text-base rounded-xl border border-gray-200 focus:border-[#5B8B5B] focus:ring-2 focus:ring-[#5B8B5B]/20 transition-all duration-200 text-gray-800 bg-gray-50 hover:bg-gray-100"
            placeholder="Enter team name"
            autoComplete="off"
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            className="flex-1 h-14 sm:h-12 bg-[#5B8B5B] text-white px-6 rounded-xl font-bold text-lg sm:text-base hover:bg-[#4A724A] active:bg-[#3D5F3D] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-[#5B8B5B] focus:ring-offset-2"
          >
            Create Team
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 h-14 sm:h-12 px-6 rounded-xl font-bold text-lg sm:text-base text-[#5B8B5B] border-2 border-[#5B8B5B] hover:bg-[#5B8B5B] hover:text-white transition-all duration-200"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  )
} 