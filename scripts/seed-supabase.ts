import { PrismaClient } from '@prisma/client';
import { supabase } from '../lib/supabase';
import mockData from '../.mock-data.json' assert { type: 'json' };

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Starting Supabase database seeding...');
    
    // Create teams
    console.log('Creating teams...');
    for (const team of mockData.teams) {
      const { error } = await supabase
        .from('Team')
        .upsert({
          id: team.id,
          name: team.name,
          handicapIndex: team.handicapIndex,
          createdAt: team.createdAt,
          updatedAt: team.updatedAt
        });
      
      if (error) {
        console.error('Error creating team:', error);
        throw error;
      }
    }
    console.log(`Created ${mockData.teams.length} teams.`);

    // Create players
    console.log('Creating players...');
    for (const player of mockData.players) {
      const { error } = await supabase
        .from('Player')
        .upsert({
          id: player.id,
          name: player.name,
          handicapIndex: player.handicapIndex,
          teamId: player.teamId,
          playerType: player.playerType,
          createdAt: player.createdAt,
          updatedAt: player.updatedAt
        });
      
      if (error) {
        console.error('Error creating player:', error);
        throw error;
      }
    }
    console.log(`Created ${mockData.players.length} players.`);

    // Create matches
    console.log('Creating matches...');
    for (const match of mockData.matches) {
      const { error } = await supabase
        .from('Match')
        .upsert({
          id: match.id,
          date: match.date,
          weekNumber: match.weekNumber,
          homeTeamId: match.homeTeamId,
          awayTeamId: match.awayTeamId,
          startingHole: match.startingHole,
          status: match.status || 'SCHEDULED',
          createdAt: match.createdAt || new Date().toISOString(),
          updatedAt: match.updatedAt || new Date().toISOString()
        });
      
      if (error) {
        console.error('Error creating match:', error);
        throw error;
      }
    }
    console.log(`Created ${mockData.matches.length} matches.`);

    console.log('Seed data created successfully!');
  } catch (error) {
    console.error('Error in seed script:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// If running this script directly
if (process.argv[1] === import.meta.url) {
  main()
    .catch((e) => {
      console.error('Error seeding data:', e);
      process.exit(1);
    });
}

export default main;