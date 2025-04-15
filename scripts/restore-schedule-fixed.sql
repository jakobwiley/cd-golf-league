-- First, let's get the team IDs from the existing database
WITH team_ids AS (
  SELECT id, name FROM "Team"
),
-- Then create the matches using the correct team IDs
matches AS (
  SELECT 
    gen_random_uuid() as id,
    date::timestamp without time zone as date,
    "weekNumber",
    home_team.id as "homeTeamId",
    away_team.id as "awayTeamId",
    "startingHole",
    'SCHEDULED' as status,
    NOW() as "createdAt",
    NOW() as "updatedAt"
  FROM (
    VALUES 
      -- Week 1 - April 15, 2024
      ('2024-04-15T18:00:00Z', 1, 'Hot/Huerter', 'Nick/Brent', 1),
      ('2024-04-15T18:00:00Z', 1, 'Ashley/Alli', 'Brett/Tony', 2),
      ('2024-04-15T18:00:00Z', 1, 'Brew/Jake', 'Clauss/Wade', 3),
      ('2024-04-15T18:00:00Z', 1, 'Sketch/Rob', 'AP/JohnP', 4),
      ('2024-04-15T18:00:00Z', 1, 'Trev/Murph', 'Ryan/Drew', 5),

      -- Week 2 - April 22, 2024
      ('2024-04-22T18:00:00Z', 2, 'Brett/Tony', 'Brew/Jake', 1),
      ('2024-04-22T18:00:00Z', 2, 'Nick/Brent', 'Ryan/Drew', 2),
      ('2024-04-22T18:00:00Z', 2, 'AP/JohnP', 'Trev/Murph', 3),
      ('2024-04-22T18:00:00Z', 2, 'Clauss/Wade', 'Sketch/Rob', 4),
      ('2024-04-22T18:00:00Z', 2, 'Hot/Huerter', 'Ashley/Alli', 5),

      -- Week 3 - April 29, 2024
      ('2024-04-29T18:00:00Z', 3, 'Ryan/Drew', 'Trev/Murph', 1),
      ('2024-04-29T18:00:00Z', 3, 'Clauss/Wade', 'Brett/Tony', 2),
      ('2024-04-29T18:00:00Z', 3, 'Sketch/Rob', 'Hot/Huerter', 3),
      ('2024-04-29T18:00:00Z', 3, 'Brew/Jake', 'Nick/Brent', 4),
      ('2024-04-29T18:00:00Z', 3, 'Ashley/Alli', 'AP/JohnP', 5),

      -- Week 4 - May 6, 2024
      ('2024-05-06T18:00:00Z', 4, 'Nick/Brent', 'AP/JohnP', 1),
      ('2024-05-06T18:00:00Z', 4, 'Hot/Huerter', 'Sketch/Rob', 2),
      ('2024-05-06T18:00:00Z', 4, 'Ashley/Alli', 'Brew/Jake', 3),
      ('2024-05-06T18:00:00Z', 4, 'Brett/Tony', 'Trev/Murph', 4),
      ('2024-05-06T18:00:00Z', 4, 'Clauss/Wade', 'Ryan/Drew', 5),

      -- Week 5 - May 13, 2024
      ('2024-05-13T18:00:00Z', 5, 'Sketch/Rob', 'Ashley/Alli', 1),
      ('2024-05-13T18:00:00Z', 5, 'Brew/Jake', 'Nick/Brent', 2),
      ('2024-05-13T18:00:00Z', 5, 'Ryan/Drew', 'Brett/Tony', 3),
      ('2024-05-13T18:00:00Z', 5, 'AP/JohnP', 'Clauss/Wade', 4),
      ('2024-05-13T18:00:00Z', 5, 'Trev/Murph', 'Hot/Huerter', 5),

      -- Week 6 - May 20, 2024
      ('2024-05-20T18:00:00Z', 6, 'Nick/Brent', 'Clauss/Wade', 1),
      ('2024-05-20T18:00:00Z', 6, 'Brett/Tony', 'AP/JohnP', 2),
      ('2024-05-20T18:00:00Z', 6, 'Hot/Huerter', 'Ryan/Drew', 3),
      ('2024-05-20T18:00:00Z', 6, 'Ashley/Alli', 'Trev/Murph', 4),
      ('2024-05-20T18:00:00Z', 6, 'Brew/Jake', 'Sketch/Rob', 5),

      -- Week 7 - May 27, 2024
      ('2024-05-27T18:00:00Z', 7, 'Ryan/Drew', 'Ashley/Alli', 1),
      ('2024-05-27T18:00:00Z', 7, 'Trev/Murph', 'Brew/Jake', 2),
      ('2024-05-27T18:00:00Z', 7, 'Sketch/Rob', 'Nick/Brent', 3),
      ('2024-05-27T18:00:00Z', 7, 'AP/JohnP', 'Hot/Huerter', 4),
      ('2024-05-27T18:00:00Z', 7, 'Clauss/Wade', 'Brett/Tony', 5),

      -- Week 8 - June 3, 2024
      ('2024-06-03T18:00:00Z', 8, 'Sketch/Rob', 'Ashley/Alli', 1),
      ('2024-06-03T18:00:00Z', 8, 'Trev/Murph', 'AP/JohnP', 2),
      ('2024-06-03T18:00:00Z', 8, 'Hot/Huerter', 'Clauss/Wade', 3),
      ('2024-06-03T18:00:00Z', 8, 'Nick/Brent', 'Brett/Tony', 4),
      ('2024-06-03T18:00:00Z', 8, 'Brew/Jake', 'Ryan/Drew', 5),

      -- Week 9 - June 10, 2024
      ('2024-06-10T18:00:00Z', 9, 'Clauss/Wade', 'Ashley/Alli', 1),
      ('2024-06-10T18:00:00Z', 9, 'Brett/Tony', 'Hot/Huerter', 2),
      ('2024-06-10T18:00:00Z', 9, 'Trev/Murph', 'Nick/Brent', 3),
      ('2024-06-10T18:00:00Z', 9, 'Ryan/Drew', 'Sketch/Rob', 4),
      ('2024-06-10T18:00:00Z', 9, 'AP/JohnP', 'Brew/Jake', 5),

      -- Week 11 - June 24, 2024
      ('2024-06-24T18:00:00Z', 11, 'Brett/Tony', 'Trev/Murph', 1),
      ('2024-06-24T18:00:00Z', 11, 'Ryan/Drew', 'Clauss/Wade', 2),
      ('2024-06-24T18:00:00Z', 11, 'AP/JohnP', 'Hot/Huerter', 3),
      ('2024-06-24T18:00:00Z', 11, 'Ashley/Alli', 'Brew/Jake', 4),
      ('2024-06-24T18:00:00Z', 11, 'Nick/Brent', 'Sketch/Rob', 5),

      -- Week 12 - July 1, 2024
      ('2024-07-01T18:00:00Z', 12, 'Hot/Huerter', 'Trev/Murph', 1),
      ('2024-07-01T18:00:00Z', 12, 'Sketch/Rob', 'Clauss/Wade', 2),
      ('2024-07-01T18:00:00Z', 12, 'Ashley/Alli', 'Ryan/Drew', 3),
      ('2024-07-01T18:00:00Z', 12, 'Nick/Brent', 'Hot/Huerter', 4),
      ('2024-07-01T18:00:00Z', 12, 'AP/JohnP', 'Brett/Tony', 5),

      -- Week 13 - July 8, 2024
      ('2024-07-08T18:00:00Z', 13, 'Trev/Murph', 'Clauss/Wade', 1),
      ('2024-07-08T18:00:00Z', 13, 'AP/JohnP', 'Ashley/Alli', 2),
      ('2024-07-08T18:00:00Z', 13, 'Nick/Brent', 'Brew/Jake', 3),
      ('2024-07-08T18:00:00Z', 13, 'Ryan/Drew', 'Hot/Huerter', 4),
      ('2024-07-08T18:00:00Z', 13, 'Sketch/Rob', 'Brett/Tony', 5),

      -- Week 14 - July 15, 2024
      ('2024-07-15T18:00:00Z', 14, 'Hot/Huerter', 'Sketch/Rob', 1),
      ('2024-07-15T18:00:00Z', 14, 'Nick/Brent', 'Clauss/Wade', 2),
      ('2024-07-15T18:00:00Z', 14, 'Ashley/Alli', 'Ryan/Drew', 3),
      ('2024-07-15T18:00:00Z', 14, 'Brew/Jake', 'Brett/Tony', 4),
      ('2024-07-15T18:00:00Z', 14, 'Trev/Murph', 'AP/JohnP', 5)
  ) AS match_data(date, "weekNumber", home_team_name, away_team_name, "startingHole")
  JOIN team_ids home_team ON home_team.name = match_data.home_team_name
  JOIN team_ids away_team ON away_team.name = match_data.away_team_name
)
INSERT INTO "Match" (id, date, "weekNumber", "homeTeamId", "awayTeamId", "startingHole", status, "createdAt", "updatedAt")
SELECT id, date, "weekNumber", "homeTeamId", "awayTeamId", "startingHole", status, "createdAt", "updatedAt"
FROM matches; 