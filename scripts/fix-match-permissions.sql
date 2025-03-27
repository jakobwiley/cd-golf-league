-- Script to fix Match permissions in Supabase
-- This script implements the following permission structure:
-- 1. All users can view matches
-- 2. Regular users can update matches that are scheduled or in-progress
-- 3. Only admins can create, update completed matches, or delete matches

-- First, enable Row Level Security on the Match table
ALTER TABLE "Match" ENABLE ROW LEVEL SECURITY;

-- Drop any existing RLS policies for the Match table
DROP POLICY IF EXISTS "Users can view all matches" ON "Match";
DROP POLICY IF EXISTS "Users can insert matches" ON "Match";
DROP POLICY IF EXISTS "Users can update matches" ON "Match";
DROP POLICY IF EXISTS "Users can update match status" ON "Match";
DROP POLICY IF EXISTS "Users can update match status to in_progress" ON "Match";
DROP POLICY IF EXISTS "Users can delete matches" ON "Match";
DROP POLICY IF EXISTS "Admins can manage all matches" ON "Match";

-- Create policy for viewing matches (all users can view all matches)
CREATE POLICY "Users can view all matches"
ON "Match"
FOR SELECT
USING (true);

-- Create policy for inserting matches (admin users only)
CREATE POLICY "Users can insert matches"
ON "Match"
FOR INSERT
WITH CHECK (
  -- Check if the user has the admin role
  auth.uid() IN (
    SELECT auth.uid() FROM auth.users
    WHERE auth.jwt() ->> 'role' = 'admin'
  )
);

-- Create policy for updating matches (regular users can update scheduled/in-progress matches)
CREATE POLICY "Users can update matches"
ON "Match"
FOR UPDATE
USING (
  -- Allow updates if the match is scheduled or in-progress
  (status = 'SCHEDULED' OR status = 'IN_PROGRESS')
  OR
  -- Or if the user is an admin
  auth.uid() IN (
    SELECT auth.uid() FROM auth.users
    WHERE auth.jwt() ->> 'role' = 'admin'
  )
);

-- Create policy for deleting matches (admin users only)
CREATE POLICY "Users can delete matches"
ON "Match"
FOR DELETE
USING (
  -- Check if the user has the admin role
  auth.uid() IN (
    SELECT auth.uid() FROM auth.users
    WHERE auth.jwt() ->> 'role' = 'admin'
  )
);

-- Create a comprehensive admin policy that allows admins to do everything
CREATE POLICY "Admins can manage all matches"
ON "Match"
FOR ALL
USING (
  -- Check if the user has the admin role
  auth.uid() IN (
    SELECT auth.uid() FROM auth.users
    WHERE auth.jwt() ->> 'role' = 'admin'
  )
);

-- Grant permissions to authenticated users
GRANT SELECT ON "Match" TO authenticated;
GRANT INSERT, UPDATE, DELETE ON "Match" TO authenticated;
