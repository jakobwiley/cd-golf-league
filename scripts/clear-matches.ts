import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function clearMatches() {
  try {
    const result = await prisma.match.deleteMany({})
    
    console.log(`Successfully deleted ${result.count} matches`)
  } catch (error) {
    console.error('Error deleting matches:', error)
  } finally {
    await prisma.$disconnect()
  }
}

clearMatches() 