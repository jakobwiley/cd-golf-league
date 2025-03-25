-- Insert match points for the completed match between Brew/Jake and Clauss/Wade
-- First, let's find the match ID for the completed match
SELECT id, homeTeamId, awayTeamId, status
FROM public."Match"
WHERE (
  (homeTeamId = '9753d64a-f88e-463d-b4da-f803a2fa7f0c' AND awayTeamId = 'e5100823-8362-4be5-b564-cd5153adc2f0')
  OR
  (homeTeamId = 'e5100823-8362-4be5-b564-cd5153adc2f0' AND awayTeamId = '9753d64a-f88e-463d-b4da-f803a2fa7f0c')
)
AND (status = 'COMPLETED' OR status = 'FINALIZED' OR status = 'completed' OR status = 'finalized');

-- Insert the total match points (hole = null)
INSERT INTO public."MatchPoints" (id, matchId, teamId, hole, homePoints, awayPoints, points)
VALUES 
(gen_random_uuid()::TEXT, 'd0b585dd-09e4-4171-b133-2f5376bcc59a', '9753d64a-f88e-463d-b4da-f803a2fa7f0c', NULL, 5.5, 3.5, 5.5);

-- Insert hole-by-hole match points
INSERT INTO public."MatchPoints" (id, matchId, teamId, hole, homePoints, awayPoints, points)
VALUES 
(gen_random_uuid()::TEXT, 'd0b585dd-09e4-4171-b133-2f5376bcc59a', '9753d64a-f88e-463d-b4da-f803a2fa7f0c', 1, 0.5, 0.5, 0.5),
(gen_random_uuid()::TEXT, 'd0b585dd-09e4-4171-b133-2f5376bcc59a', '9753d64a-f88e-463d-b4da-f803a2fa7f0c', 2, 1, 0, 1),
(gen_random_uuid()::TEXT, 'd0b585dd-09e4-4171-b133-2f5376bcc59a', '9753d64a-f88e-463d-b4da-f803a2fa7f0c', 3, 0.5, 0.5, 0.5),
(gen_random_uuid()::TEXT, 'd0b585dd-09e4-4171-b133-2f5376bcc59a', '9753d64a-f88e-463d-b4da-f803a2fa7f0c', 4, 1, 0, 1),
(gen_random_uuid()::TEXT, 'd0b585dd-09e4-4171-b133-2f5376bcc59a', '9753d64a-f88e-463d-b4da-f803a2fa7f0c', 5, 0.5, 0.5, 0.5),
(gen_random_uuid()::TEXT, 'd0b585dd-09e4-4171-b133-2f5376bcc59a', '9753d64a-f88e-463d-b4da-f803a2fa7f0c', 6, 0, 1, 0),
(gen_random_uuid()::TEXT, 'd0b585dd-09e4-4171-b133-2f5376bcc59a', '9753d64a-f88e-463d-b4da-f803a2fa7f0c', 7, 0.5, 0.5, 0.5),
(gen_random_uuid()::TEXT, 'd0b585dd-09e4-4171-b133-2f5376bcc59a', '9753d64a-f88e-463d-b4da-f803a2fa7f0c', 8, 1, 0, 1),
(gen_random_uuid()::TEXT, 'd0b585dd-09e4-4171-b133-2f5376bcc59a', '9753d64a-f88e-463d-b4da-f803a2fa7f0c', 9, 0.5, 0.5, 0.5);

-- Verify the inserted data
SELECT * FROM public."MatchPoints" WHERE matchId = 'd0b585dd-09e4-4171-b133-2f5376bcc59a' ORDER BY hole NULLS FIRST;
