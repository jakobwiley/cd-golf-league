# CD Golf League Admin Permissions

This document outlines the admin permissions setup for the CD Golf League application and provides troubleshooting steps for common issues.

## Permission Structure

The application uses Row Level Security (RLS) in Supabase with the following permission structure:

1. **Match Permissions**:
   - All users can view matches
   - Regular users can update matches that are SCHEDULED or IN_PROGRESS
   - Only admins can create, update COMPLETED matches, or delete matches

2. **MatchScore Permissions**:
   - All users can view match scores
   - Regular users can modify scores for SCHEDULED or IN_PROGRESS matches
   - Only admins can modify scores for COMPLETED matches

3. **MatchPlayer Permissions**:
   - All users can view match players
   - Regular users can modify match players for SCHEDULED or IN_PROGRESS matches
   - Only admins can modify match players for COMPLETED matches (allowing admins to add substitutes)

4. **Player Permissions**:
   - All users can view players
   - Authenticated users can add, edit, and delete players
   - Admins have full control over all players

5. **Team Permissions**:
   - All users can view teams
   - Authenticated users can create teams
   - Only admins can edit or delete teams

## Important Notes

1. **Match Status Values**: The database uses an enum type for match status with only uppercase values:
   - "SCHEDULED"
   - "IN_PROGRESS"
   - "COMPLETED"

2. **Admin Role Identification**: Admin users are identified by checking if the JWT token has a 'role' claim set to 'admin'.

3. **API Routes**: The API routes use the Supabase service role key to bypass RLS policies when necessary.

## Recent Fixes (March 2025)

The following issues have been fixed:

1. **Admin Page Crash**: Fixed an issue where selecting a match in the admin page would cause the page to crash. The problem was in the `AdminMatchesClient.tsx` component, which wasn't correctly processing the response from the match players API.

2. **LiveMatchesPage Player Data**: Fixed an issue with accessing player data in the LiveMatchesPage component, changing from direct access to using the correct property path (`playersData.players`).

## Applying Permissions to Production

To apply these permission fixes to the production environment, follow these steps:

1. **Connect to Production Database**: Use the Supabase SQL Editor in the production project.

2. **Run Permission Scripts**: Execute the following SQL scripts in order:
   - `scripts/fix-team-permissions.sql`
   - `scripts/fix-player-permissions.sql`
   - `scripts/fix-matchplayer-permissions.sql`

3. **Verify Permissions**: After applying the scripts, run the `scripts/verify-admin-permissions-simplified.sql` script to confirm that all permissions are correctly set up.

4. **Test Admin Functionality**: Test the admin pages to ensure they're working correctly:
   - Navigate to `/admin/teams` to manage teams
   - Navigate to `/admin/players` to manage players
   - Navigate to `/matches/admin` to manage match players and substitutes

## Important Notes for Production Deployment

When deploying these changes to production:

1. **Preserve Scoring Logic**: The scoring and points calculation logic should not be modified, as it could affect existing match results.

2. **Database Backup**: Always create a backup of the production database before applying any permission changes.

3. **Incremental Testing**: After deployment, test each admin function incrementally to ensure everything works as expected.

## Verifying Permissions

To verify that admin permissions are set up correctly, run the `verify-admin-permissions-simplified.sql` script in the Supabase SQL Editor. This script will show:

1. All tables with their policy counts
2. All policies for each table with their command types
3. All users with the admin role

## Troubleshooting

### 500 Error When Adding Players

If you encounter a 500 error when adding players, especially substitute players, check:

1. **API Route**: Ensure the `/api/players` route is using the service role key for Supabase.
2. **RLS Policies**: Verify that the RLS policies for the Player table are correctly set up.
3. **Error Details**: Check the browser console for more specific error messages.

### Unable to Update Completed Matches

If admins cannot update completed matches:

1. **Match Status**: Ensure the match status is correctly set to "COMPLETED" (uppercase).
2. **Admin Role**: Verify that the user has the admin role in their JWT token.
3. **RLS Policies**: Check that the admin policies for the Match and MatchScore tables are correctly set up.

## Scripts

The following SQL scripts are used to set up the RLS policies:

1. `fix-match-permissions.sql` - RLS policies for the Match table
2. `fix-matchscore-permissions.sql` - RLS policies for the MatchScore table
3. `fix-matchplayer-permissions.sql` - RLS policies for the MatchPlayer table
4. `fix-player-permissions.sql` - RLS policies for the Player table
5. `fix-team-permissions.sql` - RLS policies for the Team table

These scripts should be run in both development and production environments to ensure consistent behavior.
