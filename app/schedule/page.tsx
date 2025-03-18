import SchedulePage from './ScheduleClient'

export const revalidate = 0; // Disable cache for development

export default async function SchedulePageServer() {
  console.log('SchedulePageServer started');
  
  try {
    // Fetch data from the API endpoint with explicit no-cache options
    console.log('Fetching data from API endpoint...');
    
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3007';
    
    const apiUrl = `${baseUrl}/api/schedule`;
    console.log('Using API URL:', apiUrl);
    
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