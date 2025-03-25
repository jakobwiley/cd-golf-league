-- Check if MatchPoints table has all required columns
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_name = 'MatchPoints'
        AND table_schema = 'public'
    ) THEN
        -- Table exists, check for required columns
        IF NOT EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_name = 'MatchPoints'
            AND column_name = 'hole'
        ) THEN
            RAISE NOTICE 'WARNING: MatchPoints table is missing the hole column';
        END IF;

        IF NOT EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_name = 'MatchPoints'
            AND column_name = 'homePoints'
        ) THEN
            RAISE NOTICE 'WARNING: MatchPoints table is missing the homePoints column';
        END IF;

        IF NOT EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_name = 'MatchPoints'
            AND column_name = 'awayPoints'
        ) THEN
            RAISE NOTICE 'WARNING: MatchPoints table is missing the awayPoints column';
        END IF;
    ELSE
        RAISE NOTICE 'WARNING: MatchPoints table does not exist';
    END IF;
END $$;
