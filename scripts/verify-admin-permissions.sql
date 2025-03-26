-- Script to verify admin permissions in Supabase
-- This script checks that all necessary RLS policies are in place
-- for admin users to have the required permissions

-- Check RLS is enabled on all relevant tables
SELECT 
  tablename as table_name,
  relrowsecurity as rls_status
FROM pg_tables
JOIN pg_class ON pg_tables.tablename = pg_class.relname
WHERE tablename IN ('Match', 'MatchScore', 'MatchPlayer', 'Player', 'Team')
AND schemaname = 'public';

-- Check admin policies for Match table
SELECT 
  polname as policy_name,
  polpermissive as is_permissive,
  polcmd as command
FROM pg_policy
JOIN pg_class ON pg_policy.polrelid = pg_class.oid
WHERE relname = 'Match'
AND polname LIKE '%admin%';

-- Check admin policies for MatchScore table
SELECT 
  polname as policy_name,
  polpermissive as is_permissive,
  polcmd as command
FROM pg_policy
JOIN pg_class ON pg_policy.polrelid = pg_class.oid
WHERE relname = 'MatchScore'
AND polname LIKE '%admin%';

-- Check admin policies for MatchPlayer table
SELECT 
  polname as policy_name,
  polpermissive as is_permissive,
  polcmd as command
FROM pg_policy
JOIN pg_class ON pg_policy.polrelid = pg_class.oid
WHERE relname = 'MatchPlayer'
AND polname LIKE '%admin%';

-- Check admin policies for Player table
SELECT 
  polname as policy_name,
  polpermissive as is_permissive,
  polcmd as command
FROM pg_policy
JOIN pg_class ON pg_policy.polrelid = pg_class.oid
WHERE relname = 'Player'
AND polname LIKE '%admin%';

-- Check admin policies for Team table
SELECT 
  polname as policy_name,
  polpermissive as is_permissive,
  polcmd as command
FROM pg_policy
JOIN pg_class ON pg_policy.polrelid = pg_class.oid
WHERE relname = 'Team'
AND polname LIKE '%admin%';

-- Check all policies for each table to ensure complete coverage
SELECT 
  relname as table_name,
  COUNT(polname) as policy_count
FROM pg_policy
JOIN pg_class ON pg_policy.polrelid = pg_class.oid
WHERE relname IN ('Match', 'MatchScore', 'MatchPlayer', 'Player', 'Team')
GROUP BY relname;

-- Check for any users with admin role
SELECT 
  id,
  email,
  raw_user_meta_data ->> 'name' as name,
  raw_app_meta_data ->> 'role' as role
FROM auth.users
WHERE raw_app_meta_data ->> 'role' = 'admin';
