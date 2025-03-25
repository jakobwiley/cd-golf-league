-- Find all matches between Brew/Jake and Clauss/Wade
SELECT id, homeTeamId, awayTeamId, status
FROM public."Match"
WHERE (
  (homeTeamId = '9753d64a-f88e-463d-b4da-f803a2fa7f0c' AND awayTeamId = 'e5100823-8362-4be5-b564-cd5153adc2f0')
  OR
  (homeTeamId = 'e5100823-8362-4be5-b564-cd5153adc2f0' AND awayTeamId = '9753d64a-f88e-463d-b4da-f803a2fa7f0c')
);

-- Update match status to ensure it's properly recognized as completed
UPDATE public."Match"
SET status = 'FINALIZED'
WHERE (
  (homeTeamId = '9753d64a-f88e-463d-b4da-f803a2fa7f0c' AND awayTeamId = 'e5100823-8362-4be5-b564-cd5153adc2f0')
  OR
  (homeTeamId = 'e5100823-8362-4be5-b564-cd5153adc2f0' AND awayTeamId = '9753d64a-f88e-463d-b4da-f803a2fa7f0c')
);

-- Get the match ID after update
SELECT id, homeTeamId, awayTeamId, status
FROM public."Match"
WHERE (
  (homeTeamId = '9753d64a-f88e-463d-b4da-f803a2fa7f0c' AND awayTeamId = 'e5100823-8362-4be5-b564-cd5153adc2f0')
  OR
  (homeTeamId = 'e5100823-8362-4be5-b564-cd5153adc2f0' AND awayTeamId = '9753d64a-f88e-463d-b4da-f803a2fa7f0c')
);

-- IMPORTANT: Replace 'MATCH_ID_HERE' with the actual match ID from the query above
-- Insert the total match points (hole = null)
INSERT INTO public."MatchPoints" (id, matchId, teamId, hole, homePoints, awayPoints, points)
VALUES 
(gen_random_uuid()::TEXT, (SELECT id FROM public."Match" WHERE (homeTeamId = '9753d64a-f88e-463d-b4da-f803a2fa7f0c' AND awayTeamId = 'e5100823-8362-4be5-b564-cd5153adc2f0') OR (homeTeamId = 'e5100823-8362-4be5-b564-cd5153adc2f0' AND awayTeamId = '9753d64a-f88e-463d-b4da-f803a2fa7f0c')), '9753d64a-f88e-463d-b4da-f803a2fa7f0c', NULL, 5.5, 3.5, 5.5);

-- Insert hole-by-hole match points
INSERT INTO public."MatchPoints" (id, matchId, teamId, hole, homePoints, awayPoints, points)
VALUES 
(gen_random_uuid()::TEXT, (SELECT id FROM public."Match" WHERE (homeTeamId = '9753d64a-f88e-463d-b4da-f803a2fa7f0c' AND awayTeamId = 'e5100823-8362-4be5-b564-cd5153adc2f0') OR (homeTeamId = 'e5100823-8362-4be5-b564-cd5153adc2f0' AND awayTeamId = '9753d64a-f88e-463d-b4da-f803a2fa7f0c')), '9753d64a-f88e-463d-b4da-f803a2fa7f0c', 1, 0.5, 0.5, 0.5),
(gen_random_uuid()::TEXT, (SELECT id FROM public."Match" WHERE (homeTeamId = '9753d64a-f88e-463d-b4da-f803a2fa7f0c' AND awayTeamId = 'e5100823-8362-4be5-b564-cd5153adc2f0') OR (homeTeamId = 'e5100823-8362-4be5-b564-cd5153adc2f0' AND awayTeamId = '9753d64a-f88e-463d-b4da-f803a2fa7f0c')), '9753d64a-f88e-463d-b4da-f803a2fa7f0c', 2, 1, 0, 1),
(gen_random_uuid()::TEXT, (SELECT id FROM public."Match" WHERE (homeTeamId = '9753d64a-f88e-463d-b4da-f803a2fa7f0c' AND awayTeamId = 'e5100823-8362-4be5-b564-cd5153adc2f0') OR (homeTeamId = 'e5100823-8362-4be5-b564-cd5153adc2f0' AND awayTeamId = '9753d64a-f88e-463d-b4da-f803a2fa7f0c')), '9753d64a-f88e-463d-b4da-f803a2fa7f0c', 3, 0.5, 0.5, 0.5),
(gen_random_uuid()::TEXT, (SELECT id FROM public."Match" WHERE (homeTeamId = '9753d64a-f88e-463d-b4da-f803a2fa7f0c' AND awayTeamId = 'e5100823-8362-4be5-b564-cd5153adc2f0') OR (homeTeamId = 'e5100823-8362-4be5-b564-cd5153adc2f0' AND awayTeamId = '9753d64a-f88e-463d-b4da-f803a2fa7f0c')), '9753d64a-f88e-463d-b4da-f803a2fa7f0c', 4, 1, 0, 1),
(gen_random_uuid()::TEXT, (SELECT id FROM public."Match" WHERE (homeTeamId = '9753d64a-f88e-463d-b4da-f803a2fa7f0c' AND awayTeamId = 'e5100823-8362-4be5-b564-cd5153adc2f0') OR (homeTeamId = 'e5100823-8362-4be5-b564-cd5153adc2f0' AND awayTeamId = '9753d64a-f88e-463d-b4da-f803a2fa7f0c')), '9753d64a-f88e-463d-b4da-f803a2fa7f0c', 5, 0.5, 0.5, 0.5),
(gen_random_uuid()::TEXT, (SELECT id FROM public."Match" WHERE (homeTeamId = '9753d64a-f88e-463d-b4da-f803a2fa7f0c' AND awayTeamId = 'e5100823-8362-4be5-b564-cd5153adc2f0') OR (homeTeamId = 'e5100823-8362-4be5-b564-cd5153adc2f0' AND awayTeamId = '9753d64a-f88e-463d-b4da-f803a2fa7f0c')), '9753d64a-f88e-463d-b4da-f803a2fa7f0c', 6, 0, 1, 0),
(gen_random_uuid()::TEXT, (SELECT id FROM public."Match" WHERE (homeTeamId = '9753d64a-f88e-463d-b4da-f803a2fa7f0c' AND awayTeamId = 'e5100823-8362-4be5-b564-cd5153adc2f0') OR (homeTeamId = 'e5100823-8362-4be5-b564-cd5153adc2f0' AND awayTeamId = '9753d64a-f88e-463d-b4da-f803a2fa7f0c')), '9753d64a-f88e-463d-b4da-f803a2fa7f0c', 7, 0.5, 0.5, 0.5),
(gen_random_uuid()::TEXT, (SELECT id FROM public."Match" WHERE (homeTeamId = '9753d64a-f88e-463d-b4da-f803a2fa7f0c' AND awayTeamId = 'e5100823-8362-4be5-b564-cd5153adc2f0') OR (homeTeamId = 'e5100823-8362-4be5-b564-cd5153adc2f0' AND awayTeamId = '9753d64a-f88e-463d-b4da-f803a2fa7f0c')), '9753d64a-f88e-463d-b4da-f803a2fa7f0c', 8, 1, 0, 1),
(gen_random_uuid()::TEXT, (SELECT id FROM public."Match" WHERE (homeTeamId = '9753d64a-f88e-463d-b4da-f803a2fa7f0c' AND awayTeamId = 'e5100823-8362-4be5-b564-cd5153adc2f0') OR (homeTeamId = 'e5100823-8362-4be5-b564-cd5153adc2f0' AND awayTeamId = '9753d64a-f88e-463d-b4da-f803a2fa7f0c')), '9753d64a-f88e-463d-b4da-f803a2fa7f0c', 9, 0.5, 0.5, 0.5);

-- Verify the inserted data
SELECT * FROM public."MatchPoints" WHERE matchId = (SELECT id FROM public."Match" WHERE (homeTeamId = '9753d64a-f88e-463d-b4da-f803a2fa7f0c' AND awayTeamId = 'e5100823-8362-4be5-b564-cd5153adc2f0') OR (homeTeamId = 'e5100823-8362-4be5-b564-cd5153adc2f0' AND awayTeamId = '9753d64a-f88e-463d-b4da-f803a2fa7f0c')) ORDER BY hole NULLS FIRST;
