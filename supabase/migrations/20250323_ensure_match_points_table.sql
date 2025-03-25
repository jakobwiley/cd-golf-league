-- Check MatchPoints table exists but DO NOT create it
DO $$
BEGIN
    -- Check if table exists
    IF NOT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'MatchPoints'
    ) THEN
        -- Instead of creating the table, just raise a notice
        RAISE NOTICE 'WARNING: MatchPoints table does not exist. Please create it manually.';
    ELSE
        RAISE NOTICE 'MatchPoints table exists';
        
        -- Check for required columns
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'MatchPoints' AND column_name = 'teamId') THEN
            RAISE NOTICE 'WARNING: Missing teamId column in MatchPoints table';
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'MatchPoints' AND column_name = 'hole') THEN
            RAISE NOTICE 'WARNING: Missing hole column in MatchPoints table';
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'MatchPoints' AND column_name = 'homePoints') THEN
            RAISE NOTICE 'WARNING: Missing homePoints column in MatchPoints table';
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'MatchPoints' AND column_name = 'awayPoints') THEN
            RAISE NOTICE 'WARNING: Missing awayPoints column in MatchPoints table';
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'MatchPoints' AND column_name = 'points') THEN
            RAISE NOTICE 'WARNING: Missing points column in MatchPoints table';
        END IF;
    END IF;
END;
$$;
