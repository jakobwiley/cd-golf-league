-- Clean up all match-related data in the correct order to respect foreign key constraints
-- First, delete from tables that reference matches
DELETE FROM "MatchPlayer";
DELETE FROM "MatchScore";
DELETE FROM "MatchPoints";
DELETE FROM "PlayerSubstitution";

-- Then delete the matches
DELETE FROM "Match";

-- Now delete any duplicate teams that were created (keep only the ones with players)
WITH valid_teams AS (
  SELECT DISTINCT "teamId" 
  FROM "Player"
)
DELETE FROM "Team" t
WHERE NOT EXISTS (
  SELECT 1 
  FROM valid_teams vt 
  WHERE vt."teamId" = t.id
); 