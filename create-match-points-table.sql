-- Drop the table if it exists
DROP TABLE IF EXISTS "MatchPoints";

-- Create the MatchPoints table with all required columns
CREATE TABLE "MatchPoints" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "matchId" TEXT NOT NULL REFERENCES "Match"(id) ON DELETE CASCADE,
  "teamId" TEXT NOT NULL,
  hole INTEGER,
  "homePoints" NUMERIC NOT NULL DEFAULT 0,
  "awayPoints" NUMERIC NOT NULL DEFAULT 0,
  "points" NUMERIC NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on matchId for better performance
CREATE INDEX IF NOT EXISTS "idx_match_points_match_id" ON "MatchPoints" ("matchId");

-- Create an index on teamId for better performance
CREATE INDEX IF NOT EXISTS "idx_match_points_team_id" ON "MatchPoints" ("teamId");

-- Create a unique index on matchId and hole to prevent duplicates
CREATE UNIQUE INDEX IF NOT EXISTS "idx_match_points_match_id_hole" 
ON "MatchPoints" ("matchId", hole) 
WHERE hole IS NOT NULL;
