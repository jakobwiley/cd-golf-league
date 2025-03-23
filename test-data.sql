-- Insert Teams
INSERT INTO "Team" (id, name, "createdAt", "updatedAt")
VALUES 
  ('team1', 'The Eagles', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('team2', 'The Hawks', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('team3', 'The Tigers', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('team4', 'The Lions', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert Players
INSERT INTO "Player" (id, name, "teamId", "handicapIndex", handicap, "createdAt", "updatedAt", "playerType")
VALUES
  ('player1', 'John Smith', 'team1', 12.5, 13, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PRIMARY'),
  ('player2', 'Mike Johnson', 'team1', 8.2, 8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PRIMARY'),
  ('player3', 'Dave Wilson', 'team2', 15.7, 16, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PRIMARY'),
  ('player4', 'Tom Brown', 'team2', 10.3, 10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PRIMARY'),
  ('player5', 'Steve Davis', 'team3', 9.8, 10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PRIMARY'),
  ('player6', 'Bob Miller', 'team3', 14.2, 14, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PRIMARY'),
  ('player7', 'James Lee', 'team4', 11.6, 12, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PRIMARY'),
  ('player8', 'Chris Taylor', 'team4', 13.4, 13, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'PRIMARY');

-- Insert Matches (some past, some upcoming)
INSERT INTO "Match" (id, date, "weekNumber", "homeTeamId", "awayTeamId", "startingHole", "createdAt", "updatedAt", status)
VALUES
  ('match1', CURRENT_TIMESTAMP - INTERVAL '2 weeks', 1, 'team1', 'team2', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'COMPLETED'),
  ('match2', CURRENT_TIMESTAMP - INTERVAL '1 week', 2, 'team3', 'team4', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'COMPLETED'),
  ('match3', CURRENT_TIMESTAMP + INTERVAL '1 week', 3, 'team1', 'team3', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SCHEDULED'),
  ('match4', CURRENT_TIMESTAMP + INTERVAL '2 weeks', 4, 'team2', 'team4', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SCHEDULED'),
  ('match5', CURRENT_TIMESTAMP + INTERVAL '3 weeks', 5, 'team1', 'team4', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SCHEDULED'),
  ('match6', CURRENT_TIMESTAMP + INTERVAL '4 weeks', 6, 'team2', 'team3', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SCHEDULED');

-- Insert Match Players for completed matches
INSERT INTO "MatchPlayer" (id, "matchId", "playerId", "createdAt", "updatedAt")
VALUES
  ('mp1', 'match1', 'player1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('mp2', 'match1', 'player2', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('mp3', 'match1', 'player3', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('mp4', 'match1', 'player4', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('mp5', 'match2', 'player5', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('mp6', 'match2', 'player6', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('mp7', 'match2', 'player7', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('mp8', 'match2', 'player8', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert some scores for completed matches
INSERT INTO "MatchScore" (id, "matchId", "playerId", hole, score, "createdAt", "updatedAt")
VALUES
  -- Match 1 scores
  ('ms1', 'match1', 'player1', 1, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('ms2', 'match1', 'player1', 2, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('ms3', 'match1', 'player2', 1, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('ms4', 'match1', 'player2', 2, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('ms5', 'match1', 'player3', 1, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('ms6', 'match1', 'player3', 2, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('ms7', 'match1', 'player4', 1, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('ms8', 'match1', 'player4', 2, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  -- Match 2 scores
  ('ms9', 'match2', 'player5', 1, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('ms10', 'match2', 'player5', 2, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('ms11', 'match2', 'player6', 1, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('ms12', 'match2', 'player6', 2, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('ms13', 'match2', 'player7', 1, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('ms14', 'match2', 'player7', 2, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('ms15', 'match2', 'player8', 1, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('ms16', 'match2', 'player8', 2, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert Match Points for completed matches
INSERT INTO "MatchPoints" (id, "matchId", "teamId", points, "createdAt", "updatedAt")
VALUES
  ('mp1', 'match1', 'team1', 2.5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('mp2', 'match1', 'team2', 1.5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('mp3', 'match2', 'team3', 2.0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('mp4', 'match2', 'team4', 2.0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
