-- Simplified script to verify admin permissions in Supabase
-- This script is more compatible with different Supabase versions

-- List all tables with RLS policies
SELECT 
  relname as table_name,
  COUNT(polname) as policy_count
FROM pg_policy
JOIN pg_class ON pg_policy.polrelid = pg_class.oid
WHERE relname IN ('Match', 'MatchScore', 'MatchPlayer', 'Player', 'Team')
GROUP BY relname;

-- List all policies for each table
SELECT 
  relname as table_name,
  polname as policy_name,
  polcmd as command
FROM pg_policy
JOIN pg_class ON pg_policy.polrelid = pg_class.oid
WHERE relname IN ('Match', 'MatchScore', 'MatchPlayer', 'Player', 'Team')
ORDER BY relname, polname;

-- Check for any users with admin role
SELECT 
  id,
  email,
  raw_user_meta_data ->> 'name' as name,
  raw_app_meta_data ->> 'role' as role
FROM auth.users
WHERE raw_app_meta_data ->> 'role' = 'admin';
