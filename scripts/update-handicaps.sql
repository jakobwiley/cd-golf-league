-- Show current handicap indexes
SELECT 'CURRENT HANDICAPS' as section;
SELECT name, "handicapIndex", "teamId"
FROM "Player"
ORDER BY "handicapIndex";

-- Update handicap indexes
UPDATE "Player"
SET 
    "handicapIndex" = 
        CASE name
            WHEN 'AP' THEN 6.3
            WHEN 'Drew' THEN 9.4
            WHEN 'Brett' THEN 10.7
            WHEN 'Nick' THEN 11.3
            WHEN 'Huerter' THEN 11.8
            WHEN 'Sketch' THEN 11.9
            WHEN 'Clauss' THEN 12.5
            WHEN 'Murph' THEN 12.5
            WHEN 'Wade' THEN 12.7
            WHEN 'Alli' THEN 13.5
            WHEN 'Brew' THEN 13.6
            WHEN 'Ryan' THEN 13.9
            WHEN 'Tony' THEN 14.8
            WHEN 'Trev' THEN 15.3
            WHEN 'Jake' THEN 16.7
            WHEN 'Hot' THEN 17.2
            WHEN 'Rob' THEN 18.1
            WHEN 'Brent' THEN 20.2
            WHEN 'JohnP' THEN 21.4
            WHEN 'Ashley' THEN 40.6
        END,
    "updatedAt" = NOW()
WHERE name IN (
    'AP', 'Drew', 'Brett', 'Nick', 'Huerter', 'Sketch', 'Clauss', 'Murph',
    'Wade', 'Alli', 'Brew', 'Ryan', 'Tony', 'Trev', 'Jake', 'Hot', 'Rob',
    'Brent', 'JohnP', 'Ashley'
);

-- Show updated handicap indexes
SELECT 'UPDATED HANDICAPS' as section;
SELECT 
    name, 
    "handicapIndex",
    "teamId",
    "updatedAt"
FROM "Player"
WHERE name IN (
    'AP', 'Drew', 'Brett', 'Nick', 'Huerter', 'Sketch', 'Clauss', 'Murph',
    'Wade', 'Alli', 'Brew', 'Ryan', 'Tony', 'Trev', 'Jake', 'Hot', 'Rob',
    'Brent', 'JohnP', 'Ashley'
)
ORDER BY "handicapIndex";

-- Show team averages
SELECT 'TEAM AVERAGES' as section;
SELECT 
    t.name as team_name,
    ROUND(AVG(p."handicapIndex")::numeric, 1) as avg_handicap,
    STRING_AGG(p.name || ': ' || p."handicapIndex"::text, ', ' ORDER BY p."handicapIndex") as player_handicaps
FROM "Team" t
LEFT JOIN "Player" p ON p."teamId" = t.id
WHERE p."playerType" = 'PRIMARY'
GROUP BY t.name
ORDER BY avg_handicap; 