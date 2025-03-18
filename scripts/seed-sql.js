const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Define the raw SQL for clearing existing data
const clearMatchPlayerSQL = `DELETE FROM "MatchPlayer";`;
const clearMatchScoreSQL = `DELETE FROM "MatchScore";`;
const clearMatchPointsSQL = `DELETE FROM "MatchPoints";`;
const clearPlayerSubstitutionSQL = `DELETE FROM "PlayerSubstitution";`;
const clearMatchSQL = `DELETE FROM "Match";`;
const clearPlayerSQL = `DELETE FROM "Player";`;
const clearTeamSQL = `DELETE FROM "Team";`;

// Define the raw SQL for inserting teams
const seedTeamsSQL = `
INSERT INTO "Team" (id, name, "createdAt", "updatedAt")
VALUES 
  ('team-1', 'Fairway Hackers', NOW(), NOW()),
  ('team-2', 'Hole in Ones', NOW(), NOW()),
  ('team-3', 'Bunker Boys', NOW(), NOW()),
  ('team-4', 'Slice Masters', NOW(), NOW()),
  ('team-5', 'Green Goblins', NOW(), NOW()),
  ('team-6', 'Bogey Brigade', NOW(), NOW()),
  ('team-7', 'Par-tners', NOW(), NOW()),
  ('team-8', 'Eagle Hunters', NOW(), NOW()),
  ('team-9', 'Birdie Chasers', NOW(), NOW()),
  ('team-10', 'Rough Riders', NOW(), NOW())
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, "updatedAt" = NOW();
`;

// Define the raw SQL for inserting players
const seedPlayersSQL = `
INSERT INTO "Player" (id, name, "teamId", "handicapIndex", "playerType", "createdAt", "updatedAt")
VALUES 
  (gen_random_uuid(), 'John Doe', 'team-1', 14.2, 'PRIMARY', NOW(), NOW()),
  (gen_random_uuid(), 'Jane Smith', 'team-1', 8.5, 'PRIMARY', NOW(), NOW()),
  (gen_random_uuid(), 'Michael Johnson', 'team-2', 22.1, 'PRIMARY', NOW(), NOW()),
  (gen_random_uuid(), 'Emily Davis', 'team-2', 12.7, 'PRIMARY', NOW(), NOW()),
  (gen_random_uuid(), 'Robert Wilson', 'team-3', 5.3, 'PRIMARY', NOW(), NOW()),
  (gen_random_uuid(), 'Sarah Brown', 'team-3', 18.9, 'PRIMARY', NOW(), NOW()),
  (gen_random_uuid(), 'David Martinez', 'team-4', 10.6, 'PRIMARY', NOW(), NOW()),
  (gen_random_uuid(), 'Lisa Garcia', 'team-4', 15.8, 'PRIMARY', NOW(), NOW()),
  (gen_random_uuid(), 'James Anderson', 'team-5', 24.5, 'PRIMARY', NOW(), NOW()),
  (gen_random_uuid(), 'Jennifer Miller', 'team-5', 9.2, 'PRIMARY', NOW(), NOW()),
  (gen_random_uuid(), 'Thomas Cooper', 'team-6', 13.4, 'PRIMARY', NOW(), NOW()),
  (gen_random_uuid(), 'Jessica Rodriguez', 'team-6', 19.7, 'PRIMARY', NOW(), NOW()),
  (gen_random_uuid(), 'Christopher Lee', 'team-7', 7.8, 'PRIMARY', NOW(), NOW()),
  (gen_random_uuid(), 'Amanda Wright', 'team-7', 16.3, 'PRIMARY', NOW(), NOW()),
  (gen_random_uuid(), 'Steven Torres', 'team-8', 21.2, 'PRIMARY', NOW(), NOW()),
  (gen_random_uuid(), 'Michelle Hernandez', 'team-8', 11.5, 'PRIMARY', NOW(), NOW()),
  (gen_random_uuid(), 'Matthew King', 'team-9', 25.0, 'PRIMARY', NOW(), NOW()),
  (gen_random_uuid(), 'Stephanie Lewis', 'team-9', 17.1, 'PRIMARY', NOW(), NOW()),
  (gen_random_uuid(), 'Daniel Clark', 'team-10', 6.7, 'PRIMARY', NOW(), NOW()),
  (gen_random_uuid(), 'Nicole Scott', 'team-10', 20.4, 'PRIMARY', NOW(), NOW())
`;

// Match schedule for week 1
const seedMatchesWeek1SQL = `
INSERT INTO "Match" (id, date, "weekNumber", "homeTeamId", "awayTeamId", "startingHole", status, "createdAt", "updatedAt")
VALUES 
  (gen_random_uuid(), '2024-04-15T18:00:00Z', 1, 'team-1', 'team-2', 1, 'SCHEDULED', NOW(), NOW()),
  (gen_random_uuid(), '2024-04-15T18:00:00Z', 1, 'team-3', 'team-4', 3, 'SCHEDULED', NOW(), NOW()),
  (gen_random_uuid(), '2024-04-15T18:00:00Z', 1, 'team-5', 'team-6', 5, 'SCHEDULED', NOW(), NOW()),
  (gen_random_uuid(), '2024-04-15T18:00:00Z', 1, 'team-7', 'team-8', 7, 'SCHEDULED', NOW(), NOW()),
  (gen_random_uuid(), '2024-04-15T18:00:00Z', 1, 'team-9', 'team-10', 9, 'SCHEDULED', NOW(), NOW())
`;

// Match schedule for week 2
const seedMatchesWeek2SQL = `
INSERT INTO "Match" (id, date, "weekNumber", "homeTeamId", "awayTeamId", "startingHole", status, "createdAt", "updatedAt")
VALUES 
  (gen_random_uuid(), '2024-04-22T18:00:00Z', 2, 'team-10', 'team-1', 1, 'SCHEDULED', NOW(), NOW()),
  (gen_random_uuid(), '2024-04-22T18:00:00Z', 2, 'team-2', 'team-3', 3, 'SCHEDULED', NOW(), NOW()),
  (gen_random_uuid(), '2024-04-22T18:00:00Z', 2, 'team-4', 'team-5', 5, 'SCHEDULED', NOW(), NOW()),
  (gen_random_uuid(), '2024-04-22T18:00:00Z', 2, 'team-6', 'team-7', 7, 'SCHEDULED', NOW(), NOW()),
  (gen_random_uuid(), '2024-04-22T18:00:00Z', 2, 'team-8', 'team-9', 9, 'SCHEDULED', NOW(), NOW())
`;

// Match schedule for week 3
const seedMatchesWeek3SQL = `
INSERT INTO "Match" (id, date, "weekNumber", "homeTeamId", "awayTeamId", "startingHole", status, "createdAt", "updatedAt")
VALUES 
  (gen_random_uuid(), '2024-04-29T18:00:00Z', 3, 'team-1', 'team-9', 1, 'SCHEDULED', NOW(), NOW()),
  (gen_random_uuid(), '2024-04-29T18:00:00Z', 3, 'team-3', 'team-10', 3, 'SCHEDULED', NOW(), NOW()),
  (gen_random_uuid(), '2024-04-29T18:00:00Z', 3, 'team-5', 'team-2', 5, 'SCHEDULED', NOW(), NOW()),
  (gen_random_uuid(), '2024-04-29T18:00:00Z', 3, 'team-7', 'team-4', 7, 'SCHEDULED', NOW(), NOW()),
  (gen_random_uuid(), '2024-04-29T18:00:00Z', 3, 'team-6', 'team-8', 9, 'SCHEDULED', NOW(), NOW())
`;

async function main() {
  console.log('Starting Supabase database seeding...');
  
  try {
    // Clear existing data
    console.log('Clearing existing data...');
    try {
      await prisma.$executeRawUnsafe(clearMatchPlayerSQL);
      await prisma.$executeRawUnsafe(clearMatchScoreSQL);
      await prisma.$executeRawUnsafe(clearMatchPointsSQL);
      await prisma.$executeRawUnsafe(clearPlayerSubstitutionSQL);
      await prisma.$executeRawUnsafe(clearMatchSQL);
      await prisma.$executeRawUnsafe(clearPlayerSQL);
      await prisma.$executeRawUnsafe(clearTeamSQL);
      console.log('Database cleared successfully.');
    } catch (error) {
      console.error('Error clearing database:', error.message);
    }
    
    // Seed teams
    console.log('Creating teams...');
    try {
      await prisma.$executeRawUnsafe(seedTeamsSQL);
      console.log('Teams created successfully.');
    } catch (error) {
      console.error('Error creating teams:', error.message);
    }
    
    // Seed players
    console.log('Creating players...');
    try {
      await prisma.$executeRawUnsafe(seedPlayersSQL);
      console.log('Players created successfully.');
    } catch (error) {
      console.error('Error creating players:', error.message);
    }
    
    // Seed matches
    console.log('Creating matches for week 1...');
    try {
      await prisma.$executeRawUnsafe(seedMatchesWeek1SQL);
      console.log('Week 1 matches created successfully.');
    } catch (error) {
      console.error('Error creating week 1 matches:', error.message);
    }
    
    console.log('Creating matches for week 2...');
    try {
      await prisma.$executeRawUnsafe(seedMatchesWeek2SQL);
      console.log('Week 2 matches created successfully.');
    } catch (error) {
      console.error('Error creating week 2 matches:', error.message);
    }
    
    console.log('Creating matches for week 3...');
    try {
      await prisma.$executeRawUnsafe(seedMatchesWeek3SQL);
      console.log('Week 3 matches created successfully.');
    } catch (error) {
      console.error('Error creating week 3 matches:', error.message);
    }
    
    console.log('Seed data created successfully!');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch(error => {
    console.error('Error in seed script:', error);
    process.exit(1);
  }); 