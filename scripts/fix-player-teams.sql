-- First show the current state
SELECT 'CURRENT PLAYER STATE' as section;
SELECT name, "teamId", "playerType" FROM "Player" LIMIT 5;

-- Update players with their correct team IDs
UPDATE "Player" p
SET "teamId" = t.id
FROM "Team" t
WHERE 
    CASE 
        -- Match players to their teams based on the team names
        WHEN p.name IN ('Nick', 'Brent') AND t.name = 'Nick/Brent' THEN true
        WHEN p.name IN ('Hot', 'Huerter') AND t.name = 'Hot/Huerter' THEN true
        WHEN p.name IN ('Ashley', 'Alli') AND t.name = 'Ashley/Alli' THEN true
        WHEN p.name IN ('Brew', 'Jake') AND t.name = 'Brew/Jake' THEN true
        WHEN p.name IN ('Sketch', 'Rob') AND t.name = 'Sketch/Rob' THEN true
        WHEN p.name IN ('Trev', 'Murph') AND t.name = 'Trev/Murph' THEN true
        WHEN p.name IN ('Ryan', 'Drew') AND t.name = 'Ryan/Drew' THEN true
        WHEN p.name IN ('AP', 'JohnP') AND t.name = 'AP/JohnP' THEN true
        WHEN p.name IN ('Clauss', 'Wade') AND t.name = 'Clauss/Wade' THEN true
        WHEN p.name IN ('Brett', 'Tony') AND t.name = 'Brett/Tony' THEN true
        ELSE false
    END;

-- Verify the updates
SELECT 'UPDATED PLAYER STATE' as section;
SELECT 
    p.name as player_name, 
    p."teamId", 
    t.name as team_name,
    p."playerType"
FROM "Player" p
LEFT JOIN "Team" t ON t.id = p."teamId"
ORDER BY t.name, p.name; 