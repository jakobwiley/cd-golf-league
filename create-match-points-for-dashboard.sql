-- SQL to create the MatchPoints table in Supabase
-- Copy and paste this into the Supabase dashboard SQL editor

-- First, drop the existing table if it exists
DROP TABLE IF EXISTS "MatchPoints";

-- Now create the table with the correct structure
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

-- Create indexes for better performance
CREATE INDEX "idx_match_points_match_id" ON "MatchPoints" ("matchId");
CREATE INDEX "idx_match_points_team_id" ON "MatchPoints" ("teamId");

-- Create a unique index to prevent duplicate entries for the same match and hole
CREATE UNIQUE INDEX "idx_match_points_match_id_hole" 
ON "MatchPoints" ("matchId", hole) 
WHERE hole IS NOT NULL;
