-- Script to fix Team permissions in Supabase
-- This script implements the following permission structure:
-- 1. All users can view teams
-- 2. Only authenticated users can create teams
-- 3. Only admins can edit or delete teams

-- First, enable Row Level Security on the Team table
ALTER TABLE "Team" ENABLE ROW LEVEL SECURITY;

-- Drop any existing RLS policies for the Team table
DROP POLICY IF EXISTS "Users can view all teams" ON "Team";
DROP POLICY IF EXISTS "Users can insert teams" ON "Team";
DROP POLICY IF EXISTS "Users can update teams" ON "Team";
DROP POLICY IF EXISTS "Users can delete teams" ON "Team";
DROP POLICY IF EXISTS "Admins can manage all teams" ON "Team";

-- Create policy for viewing teams (all users can view all teams)
CREATE POLICY "Users can view all teams"
ON "Team"
FOR SELECT
USING (true);

-- Create policy for inserting teams (authenticated users only)
CREATE POLICY "Users can insert teams"
ON "Team"
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- Create policy for updating teams (admin users only)
CREATE POLICY "Users can update teams"
ON "Team"
FOR UPDATE
USING (
  -- Check if the user has the admin role
  auth.uid() IN (
    SELECT auth.uid() FROM auth.users
    WHERE auth.jwt() ->> 'role' = 'admin'
  )
);

-- Create policy for deleting teams (admin users only)
CREATE POLICY "Users can delete teams"
ON "Team"
FOR DELETE
USING (
  -- Check if the user has the admin role
  auth.uid() IN (
    SELECT auth.uid() FROM auth.users
    WHERE auth.jwt() ->> 'role' = 'admin'
  )
);

-- Verify that the policies have been created
SELECT * FROM pg_policies WHERE tablename = 'team';
