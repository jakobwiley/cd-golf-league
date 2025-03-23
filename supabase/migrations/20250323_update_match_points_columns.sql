-- Ensure MatchPoints table has all required columns
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'MatchPoints'
        AND column_name = 'hole'
    ) THEN
        ALTER TABLE "MatchPoints" ADD COLUMN "hole" INTEGER;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'MatchPoints'
        AND column_name = 'homePoints'
    ) THEN
        ALTER TABLE "MatchPoints" ADD COLUMN "homePoints" NUMERIC NOT NULL DEFAULT 0;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'MatchPoints'
        AND column_name = 'awayPoints'
    ) THEN
        ALTER TABLE "MatchPoints" ADD COLUMN "awayPoints" NUMERIC NOT NULL DEFAULT 0;
    END IF;
END $$;
