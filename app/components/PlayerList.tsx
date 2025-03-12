'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2 } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'

interface Player {
  id: string
  name: string
  ghinNumber?: string | null
}

interface PlayerListProps {
  players: Player[]
  teamId: string
}

export function PlayerList({ players, teamId }: PlayerListProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [playerToDelete, setPlayerToDelete] = useState<Player | null>(null)
  const router = useRouter()

  const handleDelete = async () => {
    if (!playerToDelete) return

    try {
      setIsDeleting(true)
      
      console.log(`Deleting player: ${playerToDelete.id} (${playerToDelete.name})`);
      
      const response = await fetch(`/api/players/${playerToDelete.id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete player')
      }
      
      toast.success('Player deleted successfully')
      router.refresh()
    } catch (error) {
      console.error('Error deleting player:', error)
      toast.error(`Error deleting player: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsDeleting(false)
      setPlayerToDelete(null)
    }
  }

  if (players.length === 0) {
    return <p className="text-muted-foreground">No players added yet.</p>
  }

  return (
    <>
      <div className="space-y-2">
        {players.map((player) => (
          <div
            key={player.id}
            className="flex items-center justify-between p-3 border rounded-md"
          >
            <div>
              <p className="font-medium">{player.name}</p>
              {player.ghinNumber && (
                <p className="text-sm text-muted-foreground">
                  GHIN: {player.ghinNumber}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  // Edit functionality would go here
                  toast.info('Edit functionality coming soon')
                }}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setPlayerToDelete(player)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <AlertDialog
        open={!!playerToDelete}
        onOpenChange={(open) => !open && setPlayerToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Player</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {playerToDelete?.name}? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
} 