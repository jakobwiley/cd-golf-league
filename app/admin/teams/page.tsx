import React from 'react';
import Link from 'next/link';
import { supabase } from '../../../lib/supabase';

export default async function TeamsPage() {
  const { data: teams, error } = await supabase
    .from('Team')
    .select(`
      id,
      name,
      createdAt,
      Player (
        id,
        name,
        handicapIndex
      )
    `)
    .order('name');

  if (error) {
    console.error('Error fetching teams:', error);
    return <div>Error loading teams</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Teams Management</h1>
        <div className="flex space-x-4">
          <Link href="/admin" className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
            Back to Admin
          </Link>
          <Link href="/api/direct-add-players" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Auto-Add Players
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => (
          <div key={team.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="bg-blue-500 text-white px-4 py-3">
              <h2 className="text-xl font-semibold">{team.name}</h2>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-medium mb-2">Players</h3>
              {team.Player && team.Player.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Handicap
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {team.Player.map((player) => (
                      <tr key={player.id}>
                        <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                          {player.name}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                          {player.handicapIndex !== undefined ? player.handicapIndex : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-500 italic">No players added yet.</p>
              )}
              
              <div className="mt-4 flex justify-end">
                <Link 
                  href={`/admin/teams/${team.id}`} 
                  className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                >
                  Manage Team →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}