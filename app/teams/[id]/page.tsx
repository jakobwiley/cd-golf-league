import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { supabase } from '../../../lib/supabase'
import { PlayerForm } from '../../components/PlayerForm'
import { PlayerList } from '../../components/PlayerList'
import Link from 'next/link'

interface TeamPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({
  params,
}: TeamPageProps): Promise<Metadata> {
  const { data: team, error } = await supabase
    .from('Team')
    .select('id, name')
    .eq('id', params.id)
    .single()

  if (error) {
    console.error('Error fetching team:', error)
    return {
      title: 'Team Not Found',
    }
  }

  if (!team) {
    return {
      title: 'Team Not Found',
    }
  }

  return {
    title: `${team.name} - Country Drive Golf League`,
  }
}

export default async function TeamPage({ params }: TeamPageProps) {
  console.log(`Rendering team page for ID: ${params.id}`);
  
  const { data: team, error } = await supabase
    .from('Team')
    .select(`
      id,
      name,
      Player (
        id,
        name,
        handicapIndex,
        playerType
      )
    `)
    .eq('id', params.id)
    .single()

  if (error) {
    console.error('Error fetching team:', error)
    return <div>Error loading team</div>
  }

  if (!team) {
    console.log(`Team with ID ${params.id} not found`);
    notFound()
  }

  console.log(`Found team: ${team.name} with ${team.Player.length} players`);

  return (
    <div className="container max-w-4xl py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/teams">
          <button className="p-2 rounded-md border hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </button>
        </Link>
        <h1 className="text-3xl font-bold">{team.name}</h1>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Players</h2>
          <PlayerList players={team.Player} teamId={team.id} />
        </div>
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Add Player</h2>
          <PlayerForm teamId={team.id} />
        </div>
      </div>
    </div>
  )
} 