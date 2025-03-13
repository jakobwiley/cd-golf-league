'use client'

import { useState } from 'react'

export default function GHINTest() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const testGHIN = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/ghin?ghinNumber=2907493')
      const data = await response.json()
      setResult(data)
      console.log('GHIN Response:', data)
    } catch (error) {
      console.error('Error:', error)
      setError('Failed to fetch GHIN data')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4">
      <button
        onClick={testGHIN}
        className="btn-primary"
        disabled={loading}
      >
        {loading ? 'Testing...' : 'Test GHIN 2907493'}
      </button>

      {error && (
        <div className="mt-4 text-red-600">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-4 space-y-2">
          <h3 className="font-bold">GHIN Data Result:</h3>
          <pre className="bg-gray-100 p-4 rounded">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
} 