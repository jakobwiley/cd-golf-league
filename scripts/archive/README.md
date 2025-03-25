# Archived Scripts

This directory contains scripts that were previously used for managing the MatchPoints table and other database operations. These scripts have been archived to reduce confusion and clean up the codebase.

## Why These Scripts Were Archived

These scripts were created during the development and debugging of the MatchPoints table functionality. Many of them serve similar purposes with slight variations, which led to confusion about which scripts should be used in different scenarios.

## Current Approach

The functionality of these scripts has been consolidated into a few well-organized scripts in the following locations:

1. **scripts/supabase/ensure-match-points-table.js**: Checks if the MatchPoints table exists during build.
2. **scripts/supabase/fix-all-match-points.js**: Updates match points for all completed matches.
3. **scripts/post-deploy-setup.js**: Runs after deployment to ensure the MatchPoints table exists and is properly configured.
4. **supabase/migrations/20250325_create_match_points_table.sql**: SQL migration to create the MatchPoints table with the correct structure.

## Important Note

These archived scripts should not be used in production. They are kept for reference purposes only. If you need to perform operations related to the MatchPoints table, please use the current scripts mentioned above.
