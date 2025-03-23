import { Suspense } from 'react'
import LiveMatchesPage from './LiveMatchesPage'
import LoadingSpinner from '../components/LoadingSpinner'

export const revalidate = 0; // Disable cache for development

export default async function MatchesPageServer() {
  // Fetch matches and teams from the API
  let matches = []
  let teams = []
  
  try {
    console.log('Fetching data from API endpoint...');
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/schedule`, { 
      cache: 'no-store'
    });
    
    if (!response.ok) {
      console.error('API request failed:', response.status, response.statusText);
    } else {
      const data = await response.json();
      console.log(`API returned ${data.teams?.length || 0} teams and ${data.matches?.length || 0} matches`);
      matches = data.matches || [];
      teams = data.teams || [];
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    // Continue with empty arrays - the client component will handle fallbacks
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <LiveMatchesPage initialMatches={matches} initialTeams={teams} />
    </Suspense>
  )
} 