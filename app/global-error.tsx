'use client'
 
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen bg-[#030f0f] flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-audiowide text-white mb-4">Something went wrong!</h2>
            <button
              onClick={() => reset()}
              className="text-white hover:text-[#00df82] transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
