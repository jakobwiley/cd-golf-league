import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    // First, clear existing data if tables exist
    try {
      await prisma.matchScore.deleteMany()
    } catch (e) {
      console.log('MatchScore table does not exist yet');
    }
    try {
      await prisma.matchPoints.deleteMany()
    } catch (e) {
      console.log('MatchPoints table does not exist yet');
    }
    try {
      await prisma.matchPlayer.deleteMany()
    } catch (e) {
      console.log('MatchPlayer table does not exist yet');
    }
    try {
      await prisma.match.deleteMany()
    } catch (e) {
      console.log('Match table does not exist yet');
    }
    try {
      await prisma.player.deleteMany()
    } catch (e) {
      console.log('Player table does not exist yet');
    }
    try {
      await prisma.team.deleteMany()
    } catch (e) {
      console.log('Team table does not exist yet');
    }

    // Create teams
    const teams = await Promise.all([
      prisma.team.create({ data: { name: 'Nick/Brent' } }),
      prisma.team.create({ data: { name: 'Hot/Huerter' } }),
      prisma.team.create({ data: { name: 'Ashley/Alli' } }),
      prisma.team.create({ data: { name: 'Brew/Jake' } }),
      prisma.team.create({ data: { name: 'Sketch/Rob' } }),
      prisma.team.create({ data: { name: 'Trev/Murph' } }),
      prisma.team.create({ data: { name: 'Ryan/Drew' } }),
      prisma.team.create({ data: { name: 'AP/JohnP' } }),
      prisma.team.create({ data: { name: 'Clauss/Wade' } }),
      prisma.team.create({ data: { name: 'Brett/Tony' } }),
    ])

    // Create players with their respective teams
    const players = await Promise.all([
      // Team 1: Nick/Brent
      prisma.player.create({
        data: {
          name: 'Nick',
          handicapIndex: 11.3,
          teamId: teams[0].id,
        },
      }),
      prisma.player.create({
        data: {
          name: 'Brent',
          handicapIndex: 8.2,
          teamId: teams[0].id,
        },
      }),
      // Team 2: Hot/Huerter
      prisma.player.create({
        data: {
          name: 'Hot',
          handicapIndex: 9.1,
          teamId: teams[1].id,
        },
      }),
      prisma.player.create({
        data: {
          name: 'Huerter',
          handicapIndex: 10.2,
          teamId: teams[1].id,
        },
      }),
      // Team 3: Ashley/Alli
      prisma.player.create({
        data: {
          name: 'Ashley',
          handicapIndex: 40.6,
          teamId: teams[2].id,
        },
      }),
      prisma.player.create({
        data: {
          name: 'Alli',
          handicapIndex: 30.0,
          teamId: teams[2].id,
        },
      }),
      // Team 4: Brew/Jake
      prisma.player.create({
        data: {
          name: 'Brew',
          handicapIndex: 13.4,
          teamId: teams[3].id,
        },
      }),
      prisma.player.create({
        data: {
          name: 'Jake',
          handicapIndex: 16.7,
          teamId: teams[3].id,
        },
      }),
      // Team 5: Sketch/Rob
      prisma.player.create({
        data: {
          name: 'Sketch',
          handicapIndex: 15.8,
          teamId: teams[4].id,
        },
      }),
      prisma.player.create({
        data: {
          name: 'Rob',
          handicapIndex: 12.9,
          teamId: teams[4].id,
        },
      }),
      // Team 6: Trev/Murph
      prisma.player.create({
        data: {
          name: 'Trev',
          handicapIndex: 16.0,
          teamId: teams[5].id,
        },
      }),
      prisma.player.create({
        data: {
          name: 'Murph',
          handicapIndex: 14.5,
          teamId: teams[5].id,
        },
      }),
      // Team 7: Ryan/Drew
      prisma.player.create({
        data: {
          name: 'Ryan',
          handicapIndex: 18.2,
          teamId: teams[6].id,
        },
      }),
      prisma.player.create({
        data: {
          name: 'Drew',
          handicapIndex: 17.1,
          teamId: teams[6].id,
        },
      }),
      // Team 8: AP/JohnP
      prisma.player.create({
        data: {
          name: 'AP',
          handicapIndex: 7.3,
          teamId: teams[7].id,
        },
      }),
      prisma.player.create({
        data: {
          name: 'JohnP',
          handicapIndex: 8.8,
          teamId: teams[7].id,
        },
      }),
      // Team 9: Clauss/Wade
      prisma.player.create({
        data: {
          name: 'Clauss',
          handicapIndex: 19.4,
          teamId: teams[8].id,
        },
      }),
      prisma.player.create({
        data: {
          name: 'Wade',
          handicapIndex: 20.1,
          teamId: teams[8].id,
        },
      }),
      // Team 10: Brett/Tony
      prisma.player.create({
        data: {
          name: 'Brett',
          handicapIndex: 21.5,
          teamId: teams[9].id,
        },
      }),
      prisma.player.create({
        data: {
          name: 'Tony',
          handicapIndex: 22.3,
          teamId: teams[9].id,
        },
      }),
    ])

    // Create matches for all weeks
    const startDate = new Date('2025-04-15')
    const matches = []
    
    // Function to add weeks to a date
    const addWeeks = (date: Date, weeks: number) => {
      const newDate = new Date(date)
      newDate.setDate(date.getDate() + weeks * 7)
      return newDate
    }

    // Schedule for all weeks
    const schedule = [
      // Week 1 (4/15)
      [
        { home: 1, away: 0, hole: 1 }, // Hot/Huerter vs Nick/Brent
        { home: 2, away: 9, hole: 2 }, // Ashley/Alli vs Brett/Tony
        { home: 3, away: 8, hole: 3 }, // Brew/Jake vs Clauss/Wade
        { home: 4, away: 7, hole: 4 }, // Sketch/Rob vs AP/JohnP
        { home: 5, away: 6, hole: 5 }, // Trev/Murph vs Ryan/Drew
      ],
      // Week 2 (4/22)
      [
        { home: 9, away: 3, hole: 1 }, // Brett/Tony vs Brew/Jake
        { home: 0, away: 6, hole: 2 }, // Nick/Brent vs Ryan/Drew
        { home: 7, away: 5, hole: 3 }, // AP/JohnP vs Trev/Murph
        { home: 8, away: 4, hole: 4 }, // Clauss/Wade vs Sketch/Rob
        { home: 1, away: 2, hole: 5 }, // Hot/Huerter vs Ashley/Alli
      ],
      // Week 3 (4/29)
      [
        { home: 6, away: 7, hole: 1 }, // Ryan/Drew vs AP/JohnP
        { home: 5, away: 8, hole: 2 }, // Trev/Murph vs Clauss/Wade
        { home: 4, away: 9, hole: 3 }, // Sketch/Rob vs Brett/Tony
        { home: 3, away: 1, hole: 4 }, // Brew/Jake vs Hot/Huerter
        { home: 2, away: 0, hole: 5 }, // Ashley/Alli vs Nick/Brent
      ],
      // Week 4 (5/6)
      [
        { home: 0, away: 1, hole: 1 }, // Nick/Brent vs Hot/Huerter
        { home: 9, away: 4, hole: 2 }, // Brett/Tony vs Sketch/Rob
        { home: 2, away: 3, hole: 3 }, // Ashley/Alli vs Brew/Jake
        { home: 5, away: 8, hole: 4 }, // Trev/Murph vs Clauss/Wade
        { home: 6, away: 7, hole: 5 }, // Ryan/Drew vs AP/JohnP
      ],
      // Week 5 (5/13)
      [
        { home: 4, away: 2, hole: 1 }, // Sketch/Rob vs Ashley/Alli
        { home: 3, away: 0, hole: 2 }, // Brew/Jake vs Nick/Brent
        { home: 6, away: 9, hole: 3 }, // Ryan/Drew vs Brett/Tony
        { home: 7, away: 8, hole: 4 }, // AP/JohnP vs Clauss/Wade
        { home: 5, away: 1, hole: 5 }, // Trev/Murph vs Hot/Huerter
      ],
      // Week 6 (5/20)
      [
        { home: 0, away: 8, hole: 1 }, // Nick/Brent vs Clauss/Wade
        { home: 9, away: 7, hole: 2 }, // Brett/Tony vs AP/JohnP
        { home: 1, away: 6, hole: 3 }, // Hot/Huerter vs Ryan/Drew
        { home: 2, away: 4, hole: 4 }, // Ashley/Alli vs Sketch/Rob
        { home: 3, away: 5, hole: 5 }, // Brew/Jake vs Trev/Murph
      ],
      // Week 7 (5/27)
      [
        { home: 6, away: 2, hole: 1 }, // Ryan/Drew vs Ashley/Alli
        { home: 5, away: 8, hole: 2 }, // Trev/Murph vs Clauss/Wade
        { home: 4, away: 0, hole: 3 }, // Sketch/Rob vs Nick/Brent
        { home: 7, away: 1, hole: 4 }, // AP/JohnP vs Hot/Huerter
        { home: 8, away: 9, hole: 5 }, // Clauss/Wade vs Brett/Tony
      ],
      // Week 8 (6/3)
      [
        { home: 4, away: 5, hole: 1 }, // Sketch/Rob vs Trev/Murph
        { home: 2, away: 8, hole: 2 }, // Ashley/Alli vs Clauss/Wade
        { home: 1, away: 7, hole: 3 }, // Hot/Huerter vs AP/JohnP
        { home: 0, away: 9, hole: 4 }, // Nick/Brent vs Brett/Tony
        { home: 3, away: 6, hole: 5 }, // Brew/Jake vs Ryan/Drew
      ],
      // Week 9 (6/10)
      [
        { home: 8, away: 2, hole: 1 }, // Clauss/Wade vs Ashley/Alli
        { home: 9, away: 1, hole: 2 }, // Brett/Tony vs Hot/Huerter
        { home: 0, away: 5, hole: 3 }, // Nick/Brent vs Trev/Murph
        { home: 6, away: 4, hole: 4 }, // Ryan/Drew vs Sketch/Rob
        { home: 7, away: 3, hole: 5 }, // AP/JohnP vs Brew/Jake
      ],
      // Week 10 (6/17)
      [
        { home: 9, away: 5, hole: 1 }, // Brett/Tony vs Trev/Murph
        { home: 6, away: 8, hole: 2 }, // Ryan/Drew vs Clauss/Wade
        { home: 7, away: 0, hole: 3 }, // AP/JohnP vs Nick/Brent
        { home: 2, away: 4, hole: 4 }, // Ashley/Alli vs Sketch/Rob
        { home: 1, away: 3, hole: 5 }, // Hot/Huerter vs Brew/Jake
      ],
      // Week 11 (6/24)
      [
        { home: 1, away: 9, hole: 1 }, // Hot/Huerter vs Brett/Tony
        { home: 4, away: 5, hole: 2 }, // Sketch/Rob vs Trev/Murph
        { home: 0, away: 6, hole: 3 }, // Nick/Brent vs Ryan/Drew
        { home: 8, away: 2, hole: 4 }, // Clauss/Wade vs Ashley/Alli
        { home: 7, away: 3, hole: 5 }, // AP/JohnP vs Brew/Jake
      ],
      // Week 12 (7/1)
      [
        { home: 5, away: 8, hole: 1 }, // Trev/Murph vs Clauss/Wade
        { home: 7, away: 2, hole: 2 }, // AP/JohnP vs Ashley/Alli
        { home: 4, away: 1, hole: 3 }, // Sketch/Rob vs Hot/Huerter
        { home: 9, away: 0, hole: 4 }, // Brett/Tony vs Nick/Brent
        { home: 3, away: 6, hole: 5 }, // Brew/Jake vs Ryan/Drew
      ],
      // Week 13 (7/8)
      [
        { home: 1, away: 4, hole: 1 }, // Hot/Huerter vs Sketch/Rob
        { home: 0, away: 8, hole: 2 }, // Nick/Brent vs Clauss/Wade
        { home: 2, away: 6, hole: 3 }, // Ashley/Alli vs Ryan/Drew
        { home: 5, away: 9, hole: 4 }, // Trev/Murph vs Brett/Tony
        { home: 7, away: 3, hole: 5 }, // AP/JohnP vs Brew/Jake
      ],
      // Week 14 (7/15)
      [
        { home: 1, away: 4, hole: 1 }, // Hot/Huerter vs Sketch/Rob
        { home: 0, away: 8, hole: 2 }, // Nick/Brent vs Clauss/Wade
        { home: 2, away: 6, hole: 3 }, // Ashley/Alli vs Ryan/Drew
        { home: 9, away: 3, hole: 4 }, // Brett/Tony vs Brew/Jake
        { home: 5, away: 7, hole: 5 }, // Trev/Murph vs AP/JohnP
      ],
    ]

    // Create all matches
    for (let week = 0; week < schedule.length; week++) {
      const weekMatches = schedule[week]
      const matchDate = addWeeks(startDate, week)

      for (const match of weekMatches) {
        matches.push(
          await prisma.match.create({
            data: {
              date: matchDate,
              weekNumber: week + 1,
              homeTeamId: teams[match.home].id,
              awayTeamId: teams[match.away].id,
              startingHole: match.hole,
              status: 'SCHEDULED',
            },
          })
        )
      }
    }

    console.log('Seed data created successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 