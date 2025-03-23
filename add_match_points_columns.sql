-- SQL script to add missing columns to the MatchPoints table

-- Add homePoints column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'MatchPoints'
        AND column_name = 'homePoints'
    ) THEN
        ALTER TABLE "MatchPoints" ADD COLUMN "homePoints" NUMERIC NOT NULL DEFAULT 0;
    END IF;
END $$;

-- Add awayPoints column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'MatchPoints'
        AND column_name = 'awayPoints'
    ) THEN
        ALTER TABLE "MatchPoints" ADD COLUMN "awayPoints" NUMERIC NOT NULL DEFAULT 0;
    END IF;
END $$;

-- Add unique constraint on matchId and hole if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'MatchPoints_matchId_hole_key'
    ) THEN
        ALTER TABLE "MatchPoints" ADD CONSTRAINT "MatchPoints_matchId_hole_key" UNIQUE ("matchId", hole);
    END IF;
END $$;

-- Verify the table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'MatchPoints'
ORDER BY ordinal_position;
