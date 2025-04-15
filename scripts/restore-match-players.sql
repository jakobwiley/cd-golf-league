-- First verify we can see the existing data
SELECT COUNT(*) as existing_count FROM "MatchPlayer";

-- Clear existing data
TRUNCATE TABLE "MatchPlayer" CASCADE;

-- Insert MatchPlayers for all scheduled matches
INSERT INTO "MatchPlayer" (
    id,
    "matchId",
    "playerId",
    "isSubstitute",
    "substituteFor",
    "createdAt",
    "updatedAt"
)
SELECT
    gen_random_uuid(),
    m.id,
    p.id,
    FALSE,
    NULL,
    NOW(),
    NOW()
FROM "Match" m
JOIN "Player" p ON (p."teamId" = m."homeTeamId" OR p."teamId" = m."awayTeamId")
WHERE 
    m.status = 'SCHEDULED'
    AND p."playerType" = 'PRIMARY';

-- Verify the results
SELECT 'VERIFICATION' as section;

-- Count by match
SELECT 
    'Matches with players' as check_type,
    COUNT(DISTINCT "matchId") as count 
FROM "MatchPlayer";

-- Sample of what was created
SELECT 
    mp."matchId",
    m."homeTeamId",
    m."awayTeamId",
    p.name as player_name,
    t.name as team_name,
    mp."isSubstitute"
FROM "MatchPlayer" mp
JOIN "Match" m ON m.id = mp."matchId"
JOIN "Player" p ON p.id = mp."playerId"
JOIN "Team" t ON t.id = p."teamId"
ORDER BY mp."matchId", p.name
LIMIT 10;

-- Debug info
SELECT 'Starting restore script';
SELECT 'Matches count: ' || COUNT(*) FROM "Match";
SELECT 'Players count: ' || COUNT(*) FROM "Player" WHERE "playerType" = 'PRIMARY';

-- Debug queries to find where the data is breaking
SELECT 'Step 1: All Matches' as step, COUNT(*) as count FROM "Match";

SELECT 'Step 2: Scheduled Matches' as step, COUNT(*) as count 
FROM "Match" 
WHERE status = 'SCHEDULED';

SELECT 'Step 3: All Players' as step, COUNT(*) as count 
FROM "Player";

SELECT 'Step 4: Primary Players' as step, COUNT(*) as count 
FROM "Player" 
WHERE "playerType" = 'PRIMARY';

SELECT 'Step 5: Match-Player Team Links' as step, COUNT(*) as count
FROM "Match" m
CROSS JOIN "Player" p
WHERE (p."teamId" = m."homeTeamId" OR p."teamId" = m."awayTeamId");

SELECT 'Step 6: Final Eligible Combinations' as step, COUNT(*) as count
FROM "Match" m
CROSS JOIN "Player" p
WHERE (p."teamId" = m."homeTeamId" OR p."teamId" = m."awayTeamId")
    AND p."playerType" = 'PRIMARY'
    AND m.status = 'SCHEDULED';

-- Now let's see some actual data to verify the relationships
SELECT 'Sample Match Data' as debug;
SELECT id, "homeTeamId", "awayTeamId", status 
FROM "Match" 
LIMIT 1;

SELECT 'Sample Player Data' as debug;
SELECT id, "teamId", "playerType" 
FROM "Player" 
WHERE "playerType" = 'PRIMARY' 
LIMIT 1;

-- DETAILED DEBUG QUERIES
-- 1. Check Matches
SELECT 'MATCH TABLE DATA' as debug;
SELECT id, "homeTeamId", "awayTeamId", status
FROM "Match"
LIMIT 5;

-- 2. Check Players
SELECT 'PLAYER TABLE DATA' as debug;
SELECT id, "teamId", "playerType", name
FROM "Player"
WHERE "playerType" = 'PRIMARY'
LIMIT 5;

-- 3. Check Team IDs
SELECT 'TEAM TABLE DATA' as debug;
SELECT id, name
FROM "Team"
LIMIT 5;

-- 4. Check specific match-player combinations
SELECT 'MATCH-PLAYER COMBINATIONS' as debug;
SELECT 
    m.id as match_id,
    m."homeTeamId",
    m."awayTeamId",
    p.id as player_id,
    p."teamId",
    p."playerType",
    CASE 
        WHEN p."teamId" = m."homeTeamId" THEN 'HOME TEAM MATCH'
        WHEN p."teamId" = m."awayTeamId" THEN 'AWAY TEAM MATCH'
        ELSE 'NO MATCH'
    END as relationship
FROM "Match" m
CROSS JOIN "Player" p
WHERE p."playerType" = 'PRIMARY'
LIMIT 5;

-- Now try a simpler insert with just one match as a test
INSERT INTO "MatchPlayer" (
    id,
    "matchId",
    "playerId",
    "isSubstitute",
    "originalPlayerId",
    "createdAt",
    "updatedAt"
)
SELECT
    gen_random_uuid() as id,
    m.id as "matchId",
    p.id as "playerId",
    FALSE as "isSubstitute",
    NULL as "originalPlayerId",
    NOW() as "createdAt",
    NOW() as "updatedAt"
FROM "Match" m
CROSS JOIN "Player" p
WHERE m.id = (SELECT id FROM "Match" LIMIT 1)  -- Just try with first match
AND p."playerType" = 'PRIMARY'
AND (p."teamId" = m."homeTeamId" OR p."teamId" = m."awayTeamId");

-- Check if even this simple insert worked
SELECT 'TEST INSERT RESULT' as debug;
SELECT COUNT(*) as test_insert_count FROM "MatchPlayer";

-- Note: This script adds all primary players from each team to their respective matches
-- Substitutions will need to be handled separately as that information isn't stored in the base tables 

-- DIAGNOSTIC QUERIES TO SHOW ACTUAL DATA

-- 1. Show all matches with their team IDs
SELECT 'MATCHES AND TEAMS' as section;
SELECT 
    id as match_id,
    "homeTeamId",
    "awayTeamId",
    status,
    date
FROM "Match"
LIMIT 5;

-- 2. Show all players with their team IDs
SELECT 'PLAYERS AND TEAMS' as section;
SELECT 
    id as player_id,
    name,
    "teamId",
    "playerType",
    "handicapIndex"
FROM "Player"
WHERE "playerType" = 'PRIMARY'
LIMIT 5;

-- 3. Show all teams
SELECT 'TEAMS' as section;
SELECT *
FROM "Team"
LIMIT 5;

-- 4. Show the actual join that would create match players
SELECT 'POTENTIAL MATCH PLAYERS' as section;
SELECT 
    m.id as match_id,
    m."homeTeamId",
    m."awayTeamId",
    p.id as player_id,
    p.name as player_name,
    p."teamId" as player_team_id,
    CASE 
        WHEN p."teamId" = m."homeTeamId" THEN 'HOME'
        WHEN p."teamId" = m."awayTeamId" THEN 'AWAY'
        ELSE 'NO MATCH'
    END as team_match
FROM "Match" m
CROSS JOIN "Player" p
WHERE m.status = 'SCHEDULED'
    AND p."playerType" = 'PRIMARY'
    AND (p."teamId" = m."homeTeamId" OR p."teamId" = m."awayTeamId")
LIMIT 10;

-- Now try the insert again with the exact data we see
INSERT INTO "MatchPlayer" (
    id,
    "matchId",
    "playerId",
    "isSubstitute",
    "substituteFor",
    "createdAt",
    "updatedAt"
)
SELECT
    gen_random_uuid(),
    match_id,
    player_id,
    FALSE,
    NULL,
    NOW(),
    NOW()
FROM (
    SELECT DISTINCT
        m.id as match_id,
        p.id as player_id
    FROM "Match" m
    JOIN "Player" p ON p."teamId" IN (m."homeTeamId", m."awayTeamId")
    WHERE m.status = 'SCHEDULED'
        AND p."playerType" = 'PRIMARY'
) as valid_combinations;

-- Show what got inserted
SELECT 'INSERTED MATCH PLAYERS' as section;
SELECT 
    mp.*,
    p.name as player_name,
    m."homeTeamId",
    m."awayTeamId"
FROM "MatchPlayer" mp
JOIN "Match" m ON m.id = mp."matchId"
JOIN "Player" p ON p.id = mp."playerId"
LIMIT 5; 