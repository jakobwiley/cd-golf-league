import { PrismaClient } from '@prisma/client'
import { teams, players, matches } from '../lib/data'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // Create teams
  console.log('Creating teams...')
  for (const team of teams) {
    await prisma.team.upsert({
      where: { id: team.id },
      update: team,
      create: team,
    })
  }

  // Create players
  console.log('Creating players...')
  for (const player of players) {
    await prisma.player.upsert({
      where: { id: player.id },
      update: player,
      create: player,
    })
  }

  // Create matches
  console.log('Creating matches...')
  for (const match of matches) {
    await prisma.match.upsert({
      where: { id: match.id },
      update: match,
      create: match,
    })
  }

  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('Error during seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 