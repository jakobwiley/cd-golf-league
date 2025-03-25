-- SQL to create the MatchPoints table in Supabase
-- This migration ensures the MatchPoints table exists with the correct structure
-- Migration date: 2025-03-25

-- Only create the table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'MatchPoints'
  ) THEN
    -- Create the table with the correct structure
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
    
    -- Enable Row Level Security
    ALTER TABLE "MatchPoints" ENABLE ROW LEVEL SECURITY;
    
    -- Create RLS policies
    CREATE POLICY "Enable read access for all users" 
      ON "MatchPoints" 
      FOR SELECT 
      USING (true);
      
    CREATE POLICY "Enable insert for authenticated users only" 
      ON "MatchPoints" 
      FOR INSERT 
      WITH CHECK (auth.role() = 'authenticated');
      
    CREATE POLICY "Enable update for authenticated users only" 
      ON "MatchPoints" 
      FOR UPDATE 
      USING (auth.role() = 'authenticated');
      
    CREATE POLICY "Enable delete for authenticated users only" 
      ON "MatchPoints" 
      FOR DELETE 
      USING (auth.role() = 'authenticated');
    
    RAISE NOTICE 'MatchPoints table created successfully';
  ELSE
    RAISE NOTICE 'MatchPoints table already exists, no changes made';
  END IF;
END $$;
