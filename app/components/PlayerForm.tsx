'use client'

import { useState, useMemo } from 'react'
import { calculateCourseHandicap } from '../lib/handicap'

interface PlayerFormProps {
  onSubmit: (data: {
    name: string;
    playerType: string;
    handicapIndex: number;
  }) => void;
  initialData?: {
    name: string;
    playerType: string;
    handicapIndex: number;
  };
}

export default function PlayerForm({ onSubmit, initialData }: PlayerFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    playerType: initialData?.playerType || 'PRIMARY',
    handicapIndex: initialData?.handicapIndex || 0,
  })

  // Calculate course handicap whenever handicap index changes
  const courseHandicap = useMemo(() => {
    return calculateCourseHandicap(formData.handicapIndex)
  }, [formData.handicapIndex])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'handicapIndex' ? parseFloat(value) : value
    }))
  }

  return (
    <div className="w-full max-w-lg mx-auto px-4 sm:px-6 lg:px-8">
      <form onSubmit={handleSubmit} className="space-y-8 bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100">
        <div className="space-y-3">
          <label 
            htmlFor="name" 
            className="block text-xl sm:text-lg font-semibold text-gray-800"
          >
            Player Name 👤
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full h-14 sm:h-12 px-4 py-3 text-lg sm:text-base rounded-xl border border-gray-200 focus:border-[#5B8B5B] focus:ring-2 focus:ring-[#5B8B5B]/20 transition-all duration-200 text-gray-800 bg-gray-50 hover:bg-gray-100"
            placeholder="Enter player name"
            autoComplete="off"
          />
        </div>

        <div className="space-y-3">
          <label 
            htmlFor="playerType" 
            className="block text-xl sm:text-lg font-semibold text-gray-800"
          >
            Player Type 🎯
          </label>
          <select
            id="playerType"
            name="playerType"
            value={formData.playerType}
            onChange={handleChange}
            required
            className="w-full h-14 sm:h-12 px-4 py-3 text-lg sm:text-base rounded-xl border border-gray-200 focus:border-[#5B8B5B] focus:ring-2 focus:ring-[#5B8B5B]/20 transition-all duration-200 text-gray-800 bg-gray-50 hover:bg-gray-100"
          >
            <option value="PRIMARY">Primary</option>
            <option value="SUB">Sub</option>
          </select>
          <p className="text-base sm:text-sm text-gray-500">
            Select whether this player is a primary team member or a substitute
          </p>
        </div>

        <div className="space-y-3">
          <label 
            htmlFor="handicapIndex" 
            className="block text-xl sm:text-lg font-semibold text-gray-800"
          >
            Handicap Index ⛳
          </label>
          <input
            type="number"
            id="handicapIndex"
            name="handicapIndex"
            value={formData.handicapIndex}
            onChange={handleChange}
            required
            step="0.1"
            min="0"
            max="54"
            className="w-full h-14 sm:h-12 px-4 py-3 text-lg sm:text-base rounded-xl border border-gray-200 focus:border-[#5B8B5B] focus:ring-2 focus:ring-[#5B8B5B]/20 transition-all duration-200 text-gray-800 bg-gray-50 hover:bg-gray-100"
            placeholder="Enter handicap index"
            inputMode="decimal"
          />
          <p className="text-base sm:text-sm text-gray-500">
            Enter the player's handicap index (0-54)
          </p>
        </div>

        <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
          <label 
            htmlFor="courseHandicap" 
            className="block text-xl sm:text-lg font-semibold text-gray-800"
          >
            Course Handicap 🏌️
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              id="courseHandicap"
              value={courseHandicap}
              readOnly
              className="w-full h-14 sm:h-12 px-4 py-3 text-lg sm:text-base rounded-xl border border-gray-200 bg-white text-gray-800 font-bold"
            />
            <div className="text-2xl">⛳</div>
          </div>
          <p className="text-base sm:text-sm text-gray-500">
            Your course handicap at Country Drive Golf Course is automatically calculated based on your handicap index using the course rating (68.0) and slope (107).
          </p>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full h-14 sm:h-12 px-6 text-lg sm:text-base font-semibold text-white bg-[#5B8B5B] rounded-xl hover:bg-[#4A724A] focus:outline-none focus:ring-2 focus:ring-[#5B8B5B]/50 transition-all duration-200"
          >
            Save Player
          </button>
        </div>
      </form>
    </div>
  )
} 