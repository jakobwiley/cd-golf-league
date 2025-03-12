import React from 'react';
import Link from 'next/link';
import { prisma } from '../../../lib/prisma';

export default async function PlayersPage() {
  // Fetch all players with their teams
  const players = await prisma.player.findMany({
    include: {
      team: true
    },
    orderBy: {
      name: 'asc'
    }
  });

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Players</h1>
        <div className="flex gap-2">
          <Link href="/admin" className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
            Back to Admin
          </Link>
          <Link href="/admin/players/add" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Add Player
          </Link>
        </div>
      </div>

      {players.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border text-left">Name</th>
                <th className="py-2 px-4 border text-left">Handicap</th>
                <th className="py-2 px-4 border text-left">Team</th>
                <th className="py-2 px-4 border text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player) => (
                <tr key={player.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border">{player.name}</td>
                  <td className="py-2 px-4 border">{player.handicapIndex ?? 'N/A'}</td>
                  <td className="py-2 px-4 border">
                    {player.team ? (
                      <Link href={`/admin/teams/${player.team.id}`} className="text-blue-500 hover:underline">
                        {player.team.name}
                      </Link>
                    ) : (
                      'No Team'
                    )}
                  </td>
                  <td className="py-2 px-4 border">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/players/${player.id}/edit`}
                        className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/admin/players/${player.id}/delete`}
                        className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                      >
                        Delete
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No players added yet</p>
          <Link
            href="/admin/players/add"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add First Player
          </Link>
        </div>
      )}
    </div>
  );
} 