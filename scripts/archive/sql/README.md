# Archived SQL Scripts

This directory contains SQL scripts that were previously used for creating and managing the MatchPoints table. These scripts have been archived to reduce confusion and clean up the codebase.

## Why These SQL Files Were Archived

These SQL files were created during the development and debugging of the MatchPoints table functionality. Many of them serve similar purposes with slight variations, which led to confusion about which scripts should be used in different scenarios.

## Current Approach

The functionality of these SQL scripts has been consolidated into a single, comprehensive SQL migration file:

- **supabase/migrations/20250325_create_match_points_table.sql**: Creates the MatchPoints table with all required columns, indexes, and RLS policies.

## Important Note

These archived SQL scripts should not be used in production. They are kept for reference purposes only. If you need to perform operations related to the MatchPoints table, please use the current migration file mentioned above.
