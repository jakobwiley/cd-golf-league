# Supabase Migrations

This directory contains SQL migration files for the Supabase database.

## Active Migrations

- **20250325_create_match_points_table.sql**: Creates the MatchPoints table with all required columns and indexes if it doesn't exist. This is the most up-to-date and comprehensive migration for the MatchPoints table.

## Migration Structure

The MatchPoints table migration creates a table with the following structure:

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

1. All migrations are idempotent (safe to run multiple times).
2. The migrations check if tables/columns exist before attempting to create them.
3. Row Level Security (RLS) policies are included in the migrations.
4. The archive directory contains older migrations that have been superseded by newer ones.
