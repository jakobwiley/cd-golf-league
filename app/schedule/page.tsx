import SchedulePage from './ScheduleClient'

export const revalidate = 0; // Disable cache for development

export default async function SchedulePageServer() {
  console.log('SchedulePageServer started');
  
  try {
    // Fetch data from the API endpoint with explicit no-cache options
    console.log('Fetching data from API endpoint...');
    
    // Fix URL construction for Vercel deployments
    let baseUrl = '';
    
    // Check for Vercel environment
    if (process.env.VERCEL_URL) {
      // For Vercel deployments
      baseUrl = `https://${process.env.VERCEL_URL}`;
      console.log('Using Vercel URL:', baseUrl);
    } else if (process.env.NEXT_PUBLIC_VERCEL_URL) {
      // Alternative Vercel environment variable
      baseUrl = `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
      console.log('Using NEXT_PUBLIC_VERCEL_URL:', baseUrl);
    } else if (process.env.VERCEL_ENV === 'development') {
      // Local development
      baseUrl = 'http://localhost:3007';
      console.log('Using local development URL:', baseUrl);
    } else {
      // Fallback - use relative URL which works in all environments
      baseUrl = '';
      console.log('Using relative URL');
    }
    
    const apiUrl = `${baseUrl}/api/schedule`;
    console.log('Final API URL:', apiUrl);
    
    const response = await fetch(apiUrl, { 
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
    
    if (!response.ok) {
      console.error('API request failed:', response.status, response.statusText);
      return <SchedulePage initialMatches={[]} initialTeams={[]} />;
    }
    
    const data = await response.json();
    console.log('API response structure:', Object.keys(data));
    console.log(`API returned ${data.teams?.length || 0} teams and ${data.matches?.length || 0} matches`);
    
    if (!data.matches || !data.teams) {
      console.error('API response is missing matches or teams data');
      console.log('Full API response:', JSON.stringify(data).substring(0, 200) + '...');
      return <SchedulePage initialMatches={[]} initialTeams={[]} />;
    }
    
    // Get unique week numbers to verify we have all expected weeks
    const weekNumbers = Array.from(new Set(data.matches.map((match: any) => match.weekNumber)))
      .sort((a: number, b: number) => a - b);
    console.log('Week numbers in API data:', weekNumbers);
    
    return <SchedulePage initialMatches={data.matches} initialTeams={data.teams} />;
  } catch (error) {
    console.error('Error fetching data:', error);
    return <SchedulePage initialMatches={[]} initialTeams={[]} />;
  }
}