'use client'

import { useState } from 'react'

type DataType = 'info' | 'handicap_history' | 'scores'

export default function GHINTest() {
  const [ghinNumber, setGhinNumber] = useState('2907493')
  const [dataType, setDataType] = useState<DataType>('info')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const testGHIN = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch(`/api/ghin?ghinNumber=${ghinNumber}&type=${dataType}`)
      const data = await response.json()
      
      if (response.ok) {
        setResult(data)
        console.log('GHIN Response:', data)
      } else {
        throw new Error(data.error || 'Failed to fetch GHIN data')
      }
    } catch (error) {
      console.error('Error:', error)
      setError(error instanceof Error ? error.message : 'Failed to fetch GHIN data')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-4 items-end">
        <div className="flex-1">
          <label htmlFor="ghin-number" className="block text-sm font-medium text-gray-700 mb-1">
            GHIN Number
          </label>
          <input
            id="ghin-number"
            type="text"
            value={ghinNumber}
            onChange={(e) => setGhinNumber(e.target.value)}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-masters-green sm:text-sm sm:leading-6"
          />
        </div>
        <div>
          <label htmlFor="data-type" className="block text-sm font-medium text-gray-700 mb-1">
            Data Type
          </label>
          <select
            id="data-type"
            value={dataType}
            onChange={(e) => setDataType(e.target.value as DataType)}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-masters-green sm:text-sm sm:leading-6"
          >
            <option value="info">Basic Info</option>
            <option value="handicap_history">Handicap History</option>
            <option value="scores">Score History</option>
          </select>
        </div>
        <button
          onClick={testGHIN}
          className="px-4 py-2 text-sm font-medium text-white bg-masters-green rounded-md shadow-sm hover:bg-masters-green/90 disabled:opacity-50"
          disabled={loading || !ghinNumber}
        >
          {loading ? 'Testing...' : 'Test GHIN'}
        </button>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                {error}
              </div>
            </div>
          </div>
        </div>
      )}

      {result && (
        <div className="rounded-md bg-white shadow">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">GHIN Data Result</h3>
            <div className="mt-5 space-y-4">
              {dataType === 'info' && (
                <>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Player Information</h4>
                    <p className="mt-1 text-sm text-gray-900">
                      Name: {result.firstName} {result.lastName}
                      {result.club && <span className="block">Club: {result.club}</span>}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Handicap Information</h4>
                    <p className="mt-1 text-sm text-gray-900">
                      Index: {result.handicapInfo.handicapIndex}
                      <span className="block">Last Updated: {new Date(result.handicapInfo.lastUpdated).toLocaleDateString()}</span>
                      {result.handicapInfo.association && (
                        <span className="block">Association: {result.handicapInfo.association}</span>
                      )}
                    </p>
                  </div>
                </>
              )}
              <div>
                <h4 className="text-sm font-medium text-gray-500">Raw Response</h4>
                <pre className="mt-1 bg-gray-50 p-4 rounded-md overflow-auto text-xs">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 