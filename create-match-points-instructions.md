# Creating the MatchPoints Table in Supabase

Follow these steps to manually create the MatchPoints table in your development Supabase database:

## 1. Access the Supabase Dashboard

1. Go to [https://app.supabase.com/project/gyvaalhcjrwozinpilsw](https://app.supabase.com/project/gyvaalhcjrwozinpilsw)
2. Log in with your credentials

## 2. Open the SQL Editor

1. In the left sidebar, click on "SQL Editor"
2. Click on "New Query" to create a new SQL query

## 3. Copy and Paste the SQL Script

Copy the following SQL script and paste it into the SQL Editor:

```sql
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
    
    RAISE NOTICE 'MatchPoints table created successfully';
  ELSE
    RAISE NOTICE 'MatchPoints table already exists, no changes made';
  END IF;
END $$;
```

## 4. Run the SQL Script

1. Click the "Run" button to execute the SQL script
2. You should see a success message in the results panel

## 5. Verify the Table Was Created

1. In the left sidebar, click on "Table Editor"
2. Look for "MatchPoints" in the list of tables
3. Click on it to view its structure and ensure it has all the required columns:
   - id (text) - Primary key
   - matchId (text) - Reference to Match table
   - teamId (text) - NOT NULL constraint
   - hole (integer) - Can be null for total points records
   - homePoints (numeric) - Points for home team
   - awayPoints (numeric) - Points for away team
   - points (numeric) - NOT NULL constraint
   - createdAt (timestamp) - Creation timestamp
   - updatedAt (timestamp) - Last update timestamp

## 6. Test the API

After creating the table, you can test the API to ensure it's working correctly:

```bash
node test-preview-api.js
```

This will verify that the match-points API can successfully save and retrieve data from the MatchPoints table.
