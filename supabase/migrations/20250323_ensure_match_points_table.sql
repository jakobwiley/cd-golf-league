-- Ensure MatchPoints table exists with all required columns
DO $$
BEGIN
    -- Check if table exists
    IF NOT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'MatchPoints'
    ) THEN
        -- Create the table if it doesn't exist
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
        CREATE INDEX IF NOT EXISTS "idx_match_points_match_id" ON "MatchPoints" ("matchId");
        CREATE INDEX IF NOT EXISTS "idx_match_points_team_id" ON "MatchPoints" ("teamId");
        
        -- Create a unique index to prevent duplicate entries for the same match and hole
        CREATE UNIQUE INDEX IF NOT EXISTS "idx_match_points_match_id_hole" 
        ON "MatchPoints" ("matchId", hole) 
        WHERE hole IS NOT NULL;
        
        RAISE NOTICE 'Created MatchPoints table';
    ELSE
        RAISE NOTICE 'MatchPoints table already exists';
        
        -- Check for and add missing columns if needed
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'MatchPoints' AND column_name = 'teamId') THEN
            ALTER TABLE "MatchPoints" ADD COLUMN "teamId" TEXT NOT NULL DEFAULT '';
            RAISE NOTICE 'Added teamId column';
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'MatchPoints' AND column_name = 'hole') THEN
            ALTER TABLE "MatchPoints" ADD COLUMN "hole" INTEGER;
            RAISE NOTICE 'Added hole column';
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'MatchPoints' AND column_name = 'homePoints') THEN
            ALTER TABLE "MatchPoints" ADD COLUMN "homePoints" NUMERIC NOT NULL DEFAULT 0;
            RAISE NOTICE 'Added homePoints column';
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'MatchPoints' AND column_name = 'awayPoints') THEN
            ALTER TABLE "MatchPoints" ADD COLUMN "awayPoints" NUMERIC NOT NULL DEFAULT 0;
            RAISE NOTICE 'Added awayPoints column';
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'MatchPoints' AND column_name = 'points') THEN
            ALTER TABLE "MatchPoints" ADD COLUMN "points" NUMERIC NOT NULL DEFAULT 0;
            RAISE NOTICE 'Added points column';
        END IF;
        
        -- Ensure indexes exist
        IF NOT EXISTS (SELECT FROM pg_indexes WHERE tablename = 'MatchPoints' AND indexname = 'idx_match_points_match_id') THEN
            CREATE INDEX "idx_match_points_match_id" ON "MatchPoints" ("matchId");
            RAISE NOTICE 'Created matchId index';
        END IF;
        
        IF NOT EXISTS (SELECT FROM pg_indexes WHERE tablename = 'MatchPoints' AND indexname = 'idx_match_points_team_id') THEN
            CREATE INDEX "idx_match_points_team_id" ON "MatchPoints" ("teamId");
            RAISE NOTICE 'Created teamId index';
        END IF;
        
        IF NOT EXISTS (SELECT FROM pg_indexes WHERE tablename = 'MatchPoints' AND indexname = 'idx_match_points_match_id_hole') THEN
            CREATE UNIQUE INDEX "idx_match_points_match_id_hole" 
            ON "MatchPoints" ("matchId", hole) 
            WHERE hole IS NOT NULL;
            RAISE NOTICE 'Created unique index on matchId and hole';
        END IF;
    END IF;
END $$;
