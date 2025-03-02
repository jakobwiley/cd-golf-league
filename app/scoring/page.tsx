import { Suspense } from 'react'
import MatchList from '../components/MatchList'
import LoadingSpinner from '../components/LoadingSpinner'

export default function ScoringPage() {
  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-masters-green font-display">
            Match Scoring
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Select a match to enter or view scores
          </p>
        </div>
      </div>

      <div className="mt-8">
        <Suspense fallback={<LoadingSpinner />}>
          <MatchList view="scoring" />
        </Suspense>
      </div>
    </div>
  )
} 