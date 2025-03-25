# Supabase Integration

This directory contains files related to the Supabase database integration for the CD Golf League application.

## Directory Structure

- **migrations/**: Contains SQL migration files for creating and updating database tables
  - `20250325_create_match_points_table.sql`: Creates the MatchPoints table with the correct structure

## Database Structure

The application uses Supabase for data storage with the following key tables:

1. **Match**: Stores information about golf matches
2. **Team**: Contains team information
3. **Player**: Stores player details
4. **MatchPoints**: Records points earned in matches (critical for standings)

## Environment Setup

The application requires the following environment variables for Supabase integration:

```
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
```

## Database Instances

- **Development**: `gyvaalhcjrwozinpilsw.supabase.co`
- **Production**: `ylhwysupdkmbunaascky.supabase.co`

## Important Notes

1. The MatchPoints table is critical for calculating league standings.
2. All tables should have appropriate Row Level Security (RLS) policies.
3. Database migrations should be idempotent (safe to run multiple times).
4. The post-deployment script ensures all tables exist with the correct structure.
