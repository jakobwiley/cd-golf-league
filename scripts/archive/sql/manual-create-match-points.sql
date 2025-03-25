-- SQL to create the MatchPoints table in Supabase
-- Copy and paste this into the Supabase dashboard SQL editor

-- Only create the table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'MatchPoints'
  ) THEN
    -- Create the table with the correct structure
    CREATE TABLE public."MatchPoints" (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
      "matchId" TEXT NOT NULL REFERENCES public."Match"(id) ON DELETE CASCADE,
      "teamId" TEXT NOT NULL,
      hole INTEGER,
      "homePoints" NUMERIC DEFAULT 0,
      "awayPoints" NUMERIC DEFAULT 0,
      points NUMERIC NOT NULL DEFAULT 0,
      "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now(),
      "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now()
    );

    -- Create indexes for better performance
    CREATE INDEX "idx_match_points_match_id" ON public."MatchPoints" ("matchId");
    CREATE INDEX "idx_match_points_team_id" ON public."MatchPoints" ("teamId");

    -- Create a unique index to prevent duplicate entries for the same match and hole
    CREATE UNIQUE INDEX "idx_match_points_match_id_hole" 
    ON public."MatchPoints" ("matchId", hole) 
    WHERE hole IS NOT NULL;
    
    -- Set up Row Level Security (RLS)
    ALTER TABLE public."MatchPoints" ENABLE ROW LEVEL SECURITY;
    
    -- Create policy to allow all operations for authenticated users
    CREATE POLICY "Allow all operations for authenticated users"
    ON public."MatchPoints"
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');
    
    -- Create policy to allow select for anonymous users
    CREATE POLICY "Allow select for anonymous users"
    ON public."MatchPoints"
    FOR SELECT
    USING (true);
    
    RAISE NOTICE 'MatchPoints table created successfully';
  ELSE
    RAISE NOTICE 'MatchPoints table already exists, no changes made';
  END IF;
END $$;
