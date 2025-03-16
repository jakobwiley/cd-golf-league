import { Team, Player, Match } from '@prisma/client'

// Static Teams Data
export const teams: Team[] = [
  {
    id: 'team1',
    name: 'Nick/Brent',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'team2',
    name: 'Hot/Huerter',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'team3',
    name: 'Ashley/Alli',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'team4',
    name: 'Brew/Jake',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'team5',
    name: 'Sketch/Rob',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'team6',
    name: 'Trev/Murph',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'team7',
    name: 'Ryan/Drew',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'team8',
    name: 'AP/JohnP',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'team9',
    name: 'Clauss/Wade',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'team10',
    name: 'Brett/Tony',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Static Players Data
export const players: Player[] = [
  // Team 8
  {
    id: 'player1',
    name: 'AP',
    teamId: 'team8',
    playerType: 'PRIMARY',
    handicapIndex: 7.3,
    handicap: 7,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'player2',
    name: 'JohnP',
    teamId: 'team8',
    playerType: 'PRIMARY',
    handicapIndex: 21.4,
    handicap: 21,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // Team 10
  {
    id: 'player3',
    name: 'Brett',
    teamId: 'team10',
    playerType: 'PRIMARY',
    handicapIndex: 10.3,
    handicap: 10,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'player4',
    name: 'Tony',
    teamId: 'team10',
    playerType: 'PRIMARY',
    handicapIndex: 14.1,
    handicap: 14,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // Team 7
  {
    id: 'player5',
    name: 'Drew',
    teamId: 'team7',
    playerType: 'PRIMARY',
    handicapIndex: 10.6,
    handicap: 11,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'player6',
    name: 'Ryan',
    teamId: 'team7',
    playerType: 'PRIMARY',
    handicapIndex: 13.9,
    handicap: 14,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // Team 1
  {
    id: 'player7',
    name: 'Nick',
    teamId: 'team1',
    playerType: 'PRIMARY',
    handicapIndex: 11.3,
    handicap: 11,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'player8',
    name: 'Brent',
    teamId: 'team1',
    playerType: 'PRIMARY',
    handicapIndex: 12,
    handicap: 12,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // Team 2
  {
    id: 'player9',
    name: 'Huerter',
    teamId: 'team2',
    playerType: 'PRIMARY',
    handicapIndex: 11.8,
    handicap: 12,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'player10',
    name: 'Hot',
    teamId: 'team2',
    playerType: 'PRIMARY',
    handicapIndex: 17.2,
    handicap: 17,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // Team 5
  {
    id: 'player11',
    name: 'Sketch',
    teamId: 'team5',
    playerType: 'PRIMARY',
    handicapIndex: 11.9,
    handicap: 12,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'player12',
    name: 'Rob',
    teamId: 'team5',
    playerType: 'PRIMARY',
    handicapIndex: 18.1,
    handicap: 18,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // Team 9
  {
    id: 'player13',
    name: 'Clauss',
    teamId: 'team9',
    playerType: 'PRIMARY',
    handicapIndex: 12.5,
    handicap: 13,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'player14',
    name: 'Wade',
    teamId: 'team9',
    playerType: 'PRIMARY',
    handicapIndex: 15,
    handicap: 15,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // Team 6
  {
    id: 'player15',
    name: 'Murph',
    teamId: 'team6',
    playerType: 'PRIMARY',
    handicapIndex: 12.6,
    handicap: 13,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'player16',
    name: 'Trev',
    teamId: 'team6',
    playerType: 'PRIMARY',
    handicapIndex: 16,
    handicap: 16,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // Team 4
  {
    id: 'player17',
    name: 'Brew',
    teamId: 'team4',
    playerType: 'PRIMARY',
    handicapIndex: 13.4,
    handicap: 13,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'player18',
    name: 'Jake',
    teamId: 'team4',
    playerType: 'PRIMARY',
    handicapIndex: 16.7,
    handicap: 17,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // Team 3
  {
    id: 'player19',
    name: 'Ashley',
    teamId: 'team3',
    playerType: 'PRIMARY',
    handicapIndex: 40.6,
    handicap: 41,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'player20',
    name: 'Alli',
    teamId: 'team3',
    playerType: 'PRIMARY',
    handicapIndex: 30,
    handicap: 30,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Helper function to generate match dates
const generateMatchDates = () => {
  const startDate = new Date('2024-05-01');
  const dates: Date[] = [];
  for (let week = 1; week <= 14; week++) {
    if (week !== 10) { // Skip week 10
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + (week - 1) * 7);
      dates.push(date);
    }
  }
  return dates;
};

const matchDates = generateMatchDates();

// Static Matches Data for Week 1
export const matches: Match[] = [
  // Week 1
  {
    id: 'match1',
    date: matchDates[0],
    weekNumber: 1,
    homeTeamId: 'team2',
    awayTeamId: 'team1',
    status: 'SCHEDULED',
    startingHole: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'match2',
    date: matchDates[0],
    weekNumber: 1,
    homeTeamId: 'team3',
    awayTeamId: 'team10',
    status: 'SCHEDULED',
    startingHole: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'match3',
    date: matchDates[0],
    weekNumber: 1,
    homeTeamId: 'team4',
    awayTeamId: 'team9',
    status: 'SCHEDULED',
    startingHole: 3,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'match4',
    date: matchDates[0],
    weekNumber: 1,
    homeTeamId: 'team5',
    awayTeamId: 'team8',
    status: 'SCHEDULED',
    startingHole: 4,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'match5',
    date: matchDates[0],
    weekNumber: 1,
    homeTeamId: 'team6',
    awayTeamId: 'team7',
    status: 'SCHEDULED',
    startingHole: 5,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // Week 2
  {
    id: 'match6',
    date: matchDates[1],
    weekNumber: 2,
    homeTeamId: 'team10',
    awayTeamId: 'team4',
    status: 'SCHEDULED',
    startingHole: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'match7',
    date: matchDates[1],
    weekNumber: 2,
    homeTeamId: 'team9',
    awayTeamId: 'team5',
    status: 'SCHEDULED',
    startingHole: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'match8',
    date: matchDates[1],
    weekNumber: 2,
    homeTeamId: 'team8',
    awayTeamId: 'team6',
    status: 'SCHEDULED',
    startingHole: 3,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'match9',
    date: matchDates[1],
    weekNumber: 2,
    homeTeamId: 'team7',
    awayTeamId: 'team1',
    status: 'SCHEDULED',
    startingHole: 4,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'match10',
    date: matchDates[1],
    weekNumber: 2,
    homeTeamId: 'team2',
    awayTeamId: 'team3',
    status: 'SCHEDULED',
    startingHole: 5,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // Week 3
  {
    id: 'match11',
    date: matchDates[2],
    weekNumber: 3,
    homeTeamId: 'team1',
    awayTeamId: 'team8',
    status: 'SCHEDULED',
    startingHole: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'match12',
    date: matchDates[2],
    weekNumber: 3,
    homeTeamId: 'team2',
    awayTeamId: 'team7',
    status: 'SCHEDULED',
    startingHole: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'match13',
    date: matchDates[2],
    weekNumber: 3,
    homeTeamId: 'team3',
    awayTeamId: 'team6',
    status: 'SCHEDULED',
    startingHole: 3,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'match14',
    date: matchDates[2],
    weekNumber: 3,
    homeTeamId: 'team4',
    awayTeamId: 'team5',
    status: 'SCHEDULED',
    startingHole: 4,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'match15',
    date: matchDates[2],
    weekNumber: 3,
    homeTeamId: 'team9',
    awayTeamId: 'team10',
    status: 'SCHEDULED',
    startingHole: 5,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // Week 4
  {
    id: 'match16',
    date: matchDates[3],
    weekNumber: 4,
    homeTeamId: 'team5',
    awayTeamId: 'team3',
    status: 'SCHEDULED',
    startingHole: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'match17',
    date: matchDates[3],
    weekNumber: 4,
    homeTeamId: 'team6',
    awayTeamId: 'team2',
    status: 'SCHEDULED',
    startingHole: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'match18',
    date: matchDates[3],
    weekNumber: 4,
    homeTeamId: 'team7',
    awayTeamId: 'team10',
    status: 'SCHEDULED',
    startingHole: 3,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'match19',
    date: matchDates[3],
    weekNumber: 4,
    homeTeamId: 'team8',
    awayTeamId: 'team9',
    status: 'SCHEDULED',
    startingHole: 4,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'match20',
    date: matchDates[3],
    weekNumber: 4,
    homeTeamId: 'team1',
    awayTeamId: 'team4',
    status: 'SCHEDULED',
    startingHole: 5,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // Week 5
  {
    id: 'match21',
    date: matchDates[4],
    weekNumber: 5,
    homeTeamId: 'team3',
    awayTeamId: 'team8',
    status: 'SCHEDULED',
    startingHole: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'match22',
    date: matchDates[4],
    weekNumber: 5,
    homeTeamId: 'team4',
    awayTeamId: 'team7',
    status: 'SCHEDULED',
    startingHole: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'match23',
    date: matchDates[4],
    weekNumber: 5,
    homeTeamId: 'team5',
    awayTeamId: 'team6',
    status: 'SCHEDULED',
    startingHole: 3,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'match24',
    date: matchDates[4],
    weekNumber: 5,
    homeTeamId: 'team9',
    awayTeamId: 'team2',
    status: 'SCHEDULED',
    startingHole: 4,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'match25',
    date: matchDates[4],
    weekNumber: 5,
    homeTeamId: 'team10',
    awayTeamId: 'team1',
    status: 'SCHEDULED',
    startingHole: 5,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // Week 6
  {
    id: 'match26',
    date: matchDates[5],
    weekNumber: 6,
    homeTeamId: 'team6',
    awayTeamId: 'team4',
    status: 'SCHEDULED',
    startingHole: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'match27',
    date: matchDates[5],
    weekNumber: 6,
    homeTeamId: 'team7',
    awayTeamId: 'team3',
    status: 'SCHEDULED',
    startingHole: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'match28',
    date: matchDates[5],
    weekNumber: 6,
    homeTeamId: 'team8',
    awayTeamId: 'team2',
    status: 'SCHEDULED',
    startingHole: 3,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'match29',
    date: matchDates[5],
    weekNumber: 6,
    homeTeamId: 'team9',
    awayTeamId: 'team1',
    status: 'SCHEDULED',
    startingHole: 4,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'match30',
    date: matchDates[5],
    weekNumber: 6,
    homeTeamId: 'team10',
    awayTeamId: 'team5',
    status: 'SCHEDULED',
    startingHole: 5,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // Week 7
  {
    id: 'match31',
    date: matchDates[6],
    weekNumber: 7,
    homeTeamId: 'team4',
    awayTeamId: 'team8',
    status: 'SCHEDULED',
    startingHole: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'match32',
    date: matchDates[6],
    weekNumber: 7,
    homeTeamId: 'team5',
    awayTeamId: 'team7',
    status: 'SCHEDULED',
    startingHole: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'match33',
    date: matchDates[6],
    weekNumber: 7,
    homeTeamId: 'team6',
    awayTeamId: 'team1',
    status: 'SCHEDULED',
    startingHole: 3,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'match34',
    date: matchDates[6],
    weekNumber: 7,
    homeTeamId: 'team2',
    awayTeamId: 'team10',
    status: 'SCHEDULED',
    startingHole: 4,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'match35',
    date: matchDates[6],
    weekNumber: 7,
    homeTeamId: 'team3',
    awayTeamId: 'team9',
    status: 'SCHEDULED',
    startingHole: 5,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // Week 8
  {
    id: 'match36',
    date: matchDates[7],
    weekNumber: 8,
    homeTeamId: 'team7',
    awayTeamId: 'team9',
    status: 'SCHEDULED',
    startingHole: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'match37',
    date: matchDates[7],
    weekNumber: 8,
    homeTeamId: 'team8',
    awayTeamId: 'team10',
    status: 'SCHEDULED',
    startingHole: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'match38',
    date: matchDates[7],
    weekNumber: 8,
    homeTeamId: 'team1',
    awayTeamId: 'team5',
    status: 'SCHEDULED',
    startingHole: 3,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'match39',
    date: matchDates[7],
    weekNumber: 8,
    homeTeamId: 'team2',
    awayTeamId: 'team4',
    status: 'SCHEDULED',
    startingHole: 4,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'match40',
    date: matchDates[7],
    weekNumber: 8,
    homeTeamId: 'team3',
    awayTeamId: 'team6',
    status: 'SCHEDULED',
    startingHole: 5,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // Week 9
  {
    id: 'match41',
    date: matchDates[8],
    weekNumber: 9,
    homeTeamId: 'team8',
    awayTeamId: 'team7',
    status: 'SCHEDULED',
    startingHole: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'match42',
    date: matchDates[8],
    weekNumber: 9,
    homeTeamId: 'team9',
    awayTeamId: 'team6',
    status: 'SCHEDULED',
    startingHole: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'match43',
    date: matchDates[8],
    weekNumber: 9,
    homeTeamId: 'team10',
    awayTeamId: 'team3',
    status: 'SCHEDULED',
    startingHole: 3,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'match44',
    date: matchDates[8],
    weekNumber: 9,
    homeTeamId: 'team1',
    awayTeamId: 'team2',
    status: 'SCHEDULED',
    startingHole: 4,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'match45',
    date: matchDates[8],
    weekNumber: 9,
    homeTeamId: 'team4',
    awayTeamId: 'team5',
    status: 'SCHEDULED',
    startingHole: 5,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // Week 11
  {
    id: 'match46',
    date: matchDates[9],
    weekNumber: 11,
    homeTeamId: 'team9',
    awayTeamId: 'team8',
    status: 'SCHEDULED',
    startingHole: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'match47',
    date: matchDates[9],
    weekNumber: 11,
    homeTeamId: 'team10',
    awayTeamId: 'team6',
    status: 'SCHEDULED',
    startingHole: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'match48',
    date: matchDates[9],
    weekNumber: 11,
    homeTeamId: 'team1',
    awayTeamId: 'team3',
    status: 'SCHEDULED',
    startingHole: 3,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'match49',
    date: matchDates[9],
    weekNumber: 11,
    homeTeamId: 'team2',
    awayTeamId: 'team5',
    status: 'SCHEDULED',
    startingHole: 4,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'match50',
    date: matchDates[9],
    weekNumber: 11,
    homeTeamId: 'team4',
    awayTeamId: 'team7',
    status: 'SCHEDULED',
    startingHole: 5,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // Week 12
  {
    id: 'match51',
    date: matchDates[10],
    weekNumber: 12,
    homeTeamId: 'team10',
    awayTeamId: 'team9',
    status: 'SCHEDULED',
    startingHole: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'match52',
    date: matchDates[10],
    weekNumber: 12,
    homeTeamId: 'team1',
    awayTeamId: 'team7',
    status: 'SCHEDULED',
    startingHole: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'match53',
    date: matchDates[10],
    weekNumber: 12,
    homeTeamId: 'team2',
    awayTeamId: 'team6',
    status: 'SCHEDULED',
    startingHole: 3,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'match54',
    date: matchDates[10],
    weekNumber: 12,
    homeTeamId: 'team3',
    awayTeamId: 'team5',
    status: 'SCHEDULED',
    startingHole: 4,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'match55',
    date: matchDates[10],
    weekNumber: 12,
    homeTeamId: 'team4',
    awayTeamId: 'team8',
    status: 'SCHEDULED',
    startingHole: 5,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // Week 13
  {
    id: 'match56',
    date: matchDates[11],
    weekNumber: 13,
    homeTeamId: 'team1',
    awayTeamId: 'team10',
    status: 'SCHEDULED',
    startingHole: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'match57',
    date: matchDates[11],
    weekNumber: 13,
    homeTeamId: 'team2',
    awayTeamId: 'team9',
    status: 'SCHEDULED',
    startingHole: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'match58',
    date: matchDates[11],
    weekNumber: 13,
    homeTeamId: 'team3',
    awayTeamId: 'team8',
    status: 'SCHEDULED',
    startingHole: 3,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'match59',
    date: matchDates[11],
    weekNumber: 13,
    homeTeamId: 'team4',
    awayTeamId: 'team6',
    status: 'SCHEDULED',
    startingHole: 4,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'match60',
    date: matchDates[11],
    weekNumber: 13,
    homeTeamId: 'team5',
    awayTeamId: 'team7',
    status: 'SCHEDULED',
    startingHole: 5,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // Week 14
  {
    id: 'match61',
    date: matchDates[12],
    weekNumber: 14,
    homeTeamId: 'team2',
    awayTeamId: 'team1',
    status: 'SCHEDULED',
    startingHole: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'match62',
    date: matchDates[12],
    weekNumber: 14,
    homeTeamId: 'team3',
    awayTeamId: 'team10',
    status: 'SCHEDULED',
    startingHole: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'match63',
    date: matchDates[12],
    weekNumber: 14,
    homeTeamId: 'team4',
    awayTeamId: 'team9',
    status: 'SCHEDULED',
    startingHole: 3,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'match64',
    date: matchDates[12],
    weekNumber: 14,
    homeTeamId: 'team5',
    awayTeamId: 'team8',
    status: 'SCHEDULED',
    startingHole: 4,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'match65',
    date: matchDates[12],
    weekNumber: 14,
    homeTeamId: 'team6',
    awayTeamId: 'team7',
    status: 'SCHEDULED',
    startingHole: 5,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Helper functions
export const getTeam = (id: string): Team | null => 
  teams.find(team => team.id === id) || null;

export const getPlayer = (id: string): Player | null => 
  players.find(player => player.id === id) || null;

export const getTeamPlayers = (teamId: string): Player[] => 
  players.filter(player => player.teamId === teamId);

export const getTeamMatches = (teamId: string): Match[] => 
  matches.filter(match => match.homeTeamId === teamId || match.awayTeamId === teamId);

export const getWeekMatches = (weekNumber: number): Match[] => 
  matches.filter(match => match.weekNumber === weekNumber);

export const getMatch = (id: string): Match | null =>
  matches.find(match => match.id === id) || null; 