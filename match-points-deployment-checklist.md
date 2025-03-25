# MatchPoints Deployment Checklist

This checklist ensures that the MatchPoints table is properly set up and maintained during deployments to both development and production environments.

## Pre-Deployment Steps

### Development Environment

1. **Create MatchPoints Table in Development Database**
   - Go to [Supabase Dashboard for Development](https://app.supabase.com/project/gyvaalhcjrwozinpilsw)
   - Navigate to the SQL Editor
   - Copy and paste the contents of `create-dev-match-points-table.sql`
   - Run the SQL
   - Verify the table was created successfully

2. **Verify Table Structure**
   - Run `node verify-match-points-table.js` to confirm:
     - Table exists
     - All required columns are present
     - Basic CRUD operations work

3. **Test API in Development**
   - Run the local development server
   - Test saving match points for a valid match
   - Test retrieving match points for a valid match
   - Verify error handling for invalid inputs

4. **Commit and Push Changes**
   - Ensure all changes are committed to version control
   - Push to GitHub to trigger a preview deployment

### Preview Deployment

1. **Verify Preview Deployment**
   - Check that the preview deployment completed successfully on Vercel
   - Note the preview URL for testing

2. **Test API in Preview Environment**
   - Use `test-preview-match-points.js` with a valid match ID
   - If authentication is required, log in to the preview deployment first
   - Verify that match points can be saved and retrieved

## Production Deployment

### Pre-Production Checks

1. **Create MatchPoints Table in Production Database**
   - Go to [Supabase Dashboard for Production](https://app.supabase.com/project/ylhwysupdkmbunaascky)
   - Navigate to the SQL Editor
   - Copy and paste the contents of `create-prod-match-points-table.sql`
   - Run the SQL
   - Verify the table was created successfully

2. **Merge to Main Branch**
   - Create a pull request to merge changes into the main branch
   - Review all changes carefully
   - Merge the pull request

### Post-Deployment Verification

1. **Verify Production Deployment**
   - Check that the production deployment completed successfully on Vercel
   - Verify that the MatchPoints table still exists in the production database
   - Test the match-points API in production

2. **Monitor for Issues**
   - Watch for any errors in the Vercel logs
   - Monitor Supabase logs for database errors
   - Check for any client-side errors in the browser console

## Important Notes

- The MatchPoints table should be created manually in both development and production databases before deployment
- The table should persist during deployments due to our idempotent design
- The `ensure-match-points-table.js` script only checks for the table's existence without trying to recreate it
- All SQL scripts use the `IF NOT EXISTS` clause to prevent accidental deletion

## Troubleshooting

If the MatchPoints table is missing after deployment:

1. Check the Vercel build logs for any errors
2. Verify that the `ensure-match-points-table.js` script ran successfully
3. Manually recreate the table using the appropriate SQL script
4. Review the deployment process to identify what went wrong
