import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

// Check if we're in a build environment
const isBuildTime = process.env.NODE_ENV === 'production' && process.env.VERCEL_ENV === 'preview';

// Create a mock client for build time
const mockPrismaClient = {
  team: {
    findMany: async () => [],
    findUnique: async () => null,
    create: async () => ({}),
    update: async () => ({}),
    delete: async () => ({})
  },
  player: {
    findMany: async () => [],
    findUnique: async () => null,
    create: async () => ({}),
    update: async () => ({}),
    delete: async () => ({})
  },
  match: {
    findMany: async () => [],
    findUnique: async () => null,
    create: async () => ({}),
    update: async () => ({}),
    delete: async () => ({})
  },
  matchScore: {
    findMany: async () => [],
    findUnique: async () => null,
    create: async () => ({}),
    update: async () => ({}),
    delete: async () => ({})
  },
  matchPoints: {
    findMany: async () => [],
    findUnique: async () => null,
    create: async () => ({}),
    update: async () => ({}),
    delete: async () => ({})
  }
} as unknown as PrismaClient;

// Create the real client with error handling
let prismaClient: PrismaClient;

try {
  prismaClient = globalForPrisma.prisma || new PrismaClient({
    log: ['query'],
  });
  
  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prismaClient;
} catch (error) {
  console.error('Failed to initialize Prisma client:', error);
  prismaClient = mockPrismaClient;
}

// Use the mock client during build time, otherwise use the real client
export const prisma = isBuildTime ? mockPrismaClient : prismaClient; 