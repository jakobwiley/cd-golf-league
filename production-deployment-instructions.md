# Production Deployment Instructions

Follow these steps to ensure the MatchPoints table is properly set up in your production environment:

## 1. Create the MatchPoints Table in Production

1. Go to [https://app.supabase.com/project/ylhwysupdkmbunaascky](https://app.supabase.com/project/ylhwysupdkmbunaascky) (your production Supabase project)
2. Navigate to the SQL Editor
3. Create a new query
4. Copy and paste the contents of `create-prod-match-points-table.sql`
5. Run the SQL

This will create the MatchPoints table with the correct structure in your production database if it doesn't already exist.

## 2. Deploy to Production

Once you've verified everything is working correctly in the preview environment:

1. Merge the `Prototype-Phase-1` branch into your main branch
2. Push the changes to GitHub
3. Deploy the main branch to production

## 3. Verify Production Deployment

After deploying to production:

1. Check that the MatchPoints table still exists in the production database
2. Test the match-points API in production to ensure it can save and retrieve data
3. Verify that the scoring functionality works correctly in the production environment

## 4. Monitor for Issues

Keep an eye on the production environment for any issues related to the MatchPoints table or scoring functionality. The changes we've made should prevent the table from being deleted during future deployments, but it's always good to monitor the first few deployments to be sure.

## 5. Future Considerations

For future database changes:

1. Always use the `IF NOT EXISTS` clause when creating tables
2. Avoid using `DROP TABLE` statements in migration files
3. Consider using Supabase migrations for more complex schema changes
4. Test all database changes in the preview environment before deploying to production

These practices will help prevent similar issues in the future and ensure a smooth deployment process.
