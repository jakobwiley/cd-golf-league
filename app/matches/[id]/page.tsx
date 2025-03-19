'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import HoleByHoleScorecard from '../../components/HoleByHoleScorecard'
import { useRouter } from 'next/navigation'

export default function MatchPage() {
  const params = useParams()
  const router = useRouter()
  const [match, setMatch] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    const fetchMatch = async () => {
      try {
        const response = await fetch(`/api/matches/${params.id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch match')
        }
        const data = await response.json()
        setMatch(data)
        setLoading(false)
      } catch (err) {
        console.error('Error fetching match:', err)
        setError('Failed to load match data')
        setLoading(false)
      }
    }

    if (params.id) {
      fetchMatch()
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030f0f] flex items-center justify-center">
        <div className="text-white">Loading match...</div>
      </div>
    )
  }

  if (error || !match) {
    return (
      <div className="min-h-screen bg-[#030f0f] flex items-center justify-center">
        <div className="text-red-500">{error || 'Match not found'}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#030f0f] relative">
      {/* Futuristic background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#00df82]/20 to-[#4CAF50]/10" />
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full bg-[url('/grid-pattern.svg')] bg-repeat bg-[length:50px_50px]" />
        </div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#00df82]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-[#4CAF50]/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <HoleByHoleScorecard match={match} onClose={() => router.push('/matches')} />
        </div>
      </div>
    </div>
  )
}
