# Supabase Scripts

This directory contains scripts for managing the Supabase database, particularly focusing on the MatchPoints table which is critical for the league standings functionality.

## Scripts Overview

### ensure-match-points-table.js
- **Purpose**: Verifies that the MatchPoints table exists in the Supabase database with the correct structure.
- **When to use**: This script runs during the Vercel build process but does NOT create the table.
- **Usage**: `node scripts/supabase/ensure-match-points-table.js`

### fix-all-match-points.js
- **Purpose**: Updates match points for all completed matches and refreshes the standings API.
- **When to use**: Run this script after a deployment or whenever match points need to be recalculated.
- **Usage**: `npm run fix-match-points` or `node scripts/supabase/fix-all-match-points.js`

## SQL Migrations

The SQL migrations for creating and maintaining the MatchPoints table are located in the `supabase/migrations` directory:

- `20250325_create_match_points_table.sql`: Creates the MatchPoints table with the correct structure if it doesn't exist.

## Table Structure

The MatchPoints table has the following structure:

```sql
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
```

## Important Notes

1. The MatchPoints table is critical for calculating league standings.
2. The table should never be dropped during deployments.
3. If the table is missing, it will be created by the post-deployment script.
4. For total match points, the `hole` field should be set to `null`.
5. For per-hole match points, the `hole` field should contain the hole number.
