# Deployment Checklist

This checklist ensures that all environments (local development, preview, and production) are properly synchronized with the latest changes.

## Pre-Deployment Database Tasks

### 1. Apply Schema Changes to Development Database
```bash
# Connect to development Supabase database (gyvaalhcjrwozinpilsw)
# Run the migration SQL scripts in the Supabase SQL editor:
# - /supabase/migrations/20250323_update_match_points_columns.sql
```

### 2. Verify Development Database
- Check that the MatchPoints table has all required columns:
  - id (text)
  - matchId (text)
  - teamId (text) - NOT NULL
  - hole (integer)
  - homePoints (numeric)
  - awayPoints (numeric)
  - points (numeric) - NOT NULL
  - createdAt (timestamp)
  - updatedAt (timestamp)

### 3. Apply Schema Changes to Production Database
```bash
# Connect to production Supabase database (ylhwysupdkmbunaascky)
# Run the same migration SQL scripts in the Supabase SQL editor
```

## Vercel Deployment Process

### 1. Environment Variables
- Verify all environment variables are set correctly in Vercel:
  - Development: Points to development database
  - Preview: Points to development database
  - Production: Points to production database

### 2. Deployment Steps
```bash
# Push changes to GitHub
git add .
git commit -m "Fix MatchPoints table structure and API"
git push origin main

# Vercel will automatically deploy:
# - Preview deployment for pull requests
# - Production deployment for main branch
```

### 3. Post-Deployment Verification
For each environment (preview and production):

1. **API Functionality**
   - Test the match-points API by updating scores
   - Verify data is saved to the MatchPoints table

2. **WebSocket Functionality**
   - Verify real-time updates work
   - Check browser console for WebSocket connection status

3. **Database Consistency**
   - Verify MatchPoints records are created with all required fields
   - Check that both homePoints and awayPoints are saved correctly

## Rollback Plan

If issues are encountered after deployment:

1. **Identify the Problem**
   - Check server logs in Vercel
   - Check browser console for client-side errors
   - Verify database records

2. **Quick Fixes**
   - For schema issues: Run additional SQL migrations
   - For API issues: Update and redeploy the API endpoint

3. **Full Rollback**
   - If necessary, revert to the previous working commit:
   ```bash
   git revert HEAD
   git push origin main
   ```

## Monitoring

After deployment, monitor:
1. Vercel logs for any server-side errors
2. Supabase logs for any database errors
3. User-reported issues
