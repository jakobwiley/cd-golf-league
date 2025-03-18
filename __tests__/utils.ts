import { Response } from 'supertest';

// Helper function to get response data
export const getResponseData = (response: Response | null): any => {
  if (!response) return null;
  return response.body;
};

// Create test teams
export const createTestTeams = () => {
  return [
    { id: 1, name: 'Team A' },
    { id: 2, name: 'Team B' },
  ];
};

/**
 * Helper function to create a test team
 */
export async function createTestTeam(prisma: any, name?: string) {
  try {
    const uniqueName = name || `Test Team ${Date.now()}`
    console.log('Creating test team with name:', uniqueName)
    
    console.log('Prisma client:', prisma)
    console.log('Prisma team model:', prisma.team)
    
    const team = await prisma.team.create({
      data: {
        name: uniqueName
      }
    })
    
    console.log('Created test team:', team)
    return team
  } catch (error) {
    console.error('Error creating test team:', error)
    throw error
  }
} 