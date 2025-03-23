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
  CREATE INDEX IF NOT EXISTS "idx_match_points_match_id" ON "MatchPoints" ("matchId");
  CREATE INDEX IF NOT EXISTS "idx_match_points_team_id" ON "MatchPoints" ("teamId");
  
  -- Create a unique index to prevent duplicate entries for the same match and hole
  CREATE UNIQUE INDEX IF NOT EXISTS "idx_match_points_match_id_hole" 
  ON "MatchPoints" ("matchId", hole) 
  WHERE hole IS NOT NULL;
END;
$$;

-- Create a function to run the SQL directly
CREATE OR REPLACE FUNCTION run_sql(query text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE query;
END;
$$;

-- Direct SQL to create the MatchPoints table if it doesn't exist
DO $$
BEGIN
  -- Check if the table exists
  IF NOT EXISTS (
    SELECT FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'MatchPoints'
  ) THEN
    -- Create the table
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
    
    -- Create indexes
    CREATE INDEX "idx_match_points_match_id" ON "MatchPoints" ("matchId");
    CREATE INDEX "idx_match_points_team_id" ON "MatchPoints" ("teamId");
    
    -- Create a unique index
    CREATE UNIQUE INDEX "idx_match_points_match_id_hole" 
    ON "MatchPoints" ("matchId", hole) 
    WHERE hole IS NOT NULL;
  ELSE
    -- Table exists, check for missing columns
    -- Add teamId column if it doesn't exist
    IF NOT EXISTS (
      SELECT FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'MatchPoints' 
      AND column_name = 'teamId'
    ) THEN
      ALTER TABLE "MatchPoints" ADD COLUMN "teamId" TEXT NOT NULL DEFAULT '';
    END IF;
    
    -- Add points column if it doesn't exist
    IF NOT EXISTS (
      SELECT FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'MatchPoints' 
      AND column_name = 'points'
    ) THEN
      ALTER TABLE "MatchPoints" ADD COLUMN "points" NUMERIC NOT NULL DEFAULT 0;
    END IF;
  END IF;
END $$;
