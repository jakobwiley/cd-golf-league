import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function fixMatchDates() {
  try {
    // First, let's see what dates we actually have
    const existingMatches = await prisma.match.findMany({
      select: {
        id: true,
        date: true
      }
    })
    
    console.log('Current matches in database:')
    existingMatches.forEach(match => {
      console.log(`Match ID: ${match.id}, Date: ${match.date.toISOString().split('T')[0]}`)
    })

    // Update April 14, 2025 matches to April 15, 2025
    const april14Updates = await prisma.match.updateMany({
      where: {
        date: {
          gte: new Date('2025-04-14T00:00:00.000Z'),
          lt: new Date('2025-04-15T00:00:00.000Z')
        }
      },
      data: {
        date: new Date('2025-04-15T00:00:00.000Z')
      }
    })

    // Update April 21, 2025 matches to April 22, 2025
    const april21Updates = await prisma.match.updateMany({
      where: {
        date: {
          gte: new Date('2025-04-21T00:00:00.000Z'),
          lt: new Date('2025-04-22T00:00:00.000Z')
        }
      },
      data: {
        date: new Date('2025-04-22T00:00:00.000Z')
      }
    })

    // Verify the updates
    const updatedMatches = await prisma.match.findMany({
      select: {
        id: true,
        date: true
      },
      orderBy: {
        date: 'asc'
      }
    })
    
    console.log('\nUpdated matches in database:')
    updatedMatches.forEach(match => {
      console.log(`Match ID: ${match.id}, Date: ${match.date.toISOString().split('T')[0]}`)
    })

    console.log('\nUpdates completed:')
    console.log('April 14 -> 15:', april14Updates.count, 'matches updated')
    console.log('April 21 -> 22:', april21Updates.count, 'matches updated')
  } catch (error) {
    console.error('Error updating match dates:', error)
  } finally {
    await prisma.$disconnect()
  }
}

fixMatchDates() 