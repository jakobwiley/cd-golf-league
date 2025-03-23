-- Create stored procedures to manage the MatchPoints table

-- Function to drop the MatchPoints table
CREATE OR REPLACE FUNCTION drop_match_points_table()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DROP TABLE IF EXISTS "MatchPoints";
END;
$$;

-- Function to create the MatchPoints table with the correct structure
CREATE OR REPLACE FUNCTION create_match_points_table()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS "MatchPoints" (
    id UUID PRIMARY KEY,
    "matchId" UUID NOT NULL REFERENCES "Match"(id) ON DELETE CASCADE,
    hole INTEGER,
    "homePoints" NUMERIC NOT NULL DEFAULT 0,
    "awayPoints" NUMERIC NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE("matchId", hole)
  );
END;
$$;
