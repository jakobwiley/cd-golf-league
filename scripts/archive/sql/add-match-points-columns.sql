-- Add homePoints and awayPoints columns to the Match table if they don't exist
DO $$
BEGIN
    -- Check if homePoints column exists
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'Match'
        AND column_name = 'homePoints'
    ) THEN
        -- Add homePoints column
        ALTER TABLE "Match" ADD COLUMN "homePoints" NUMERIC DEFAULT 0;
    END IF;

    -- Check if awayPoints column exists
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'Match'
        AND column_name = 'awayPoints'
    ) THEN
        -- Add awayPoints column
        ALTER TABLE "Match" ADD COLUMN "awayPoints" NUMERIC DEFAULT 0;
    END IF;
END
$$;
