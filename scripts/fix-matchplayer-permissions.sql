-- Script to fix MatchPlayer permissions in Supabase
-- This script implements the following permission structure:
-- 1. All users can view match players
-- 2. Regular users can modify match players for scheduled/in-progress matches
-- 3. Only admins can modify match players for completed/finalized matches

-- First, enable Row Level Security on the MatchPlayer table
ALTER TABLE "MatchPlayer" ENABLE ROW LEVEL SECURITY;

-- Drop any existing RLS policies for the MatchPlayer table
DROP POLICY IF EXISTS "Users can view all match players" ON "MatchPlayer";
DROP POLICY IF EXISTS "Users can insert match players" ON "MatchPlayer";
DROP POLICY IF EXISTS "Users can update match players" ON "MatchPlayer";
DROP POLICY IF EXISTS "Users can delete match players" ON "MatchPlayer";
DROP POLICY IF EXISTS "Admins can manage all match players" ON "MatchPlayer";

-- Create policy for viewing match players (all users can view all match players)
CREATE POLICY "Users can view all match players"
ON "MatchPlayer"
FOR SELECT
USING (true);

-- Create policy for inserting match players (only for scheduled or in-progress matches)
CREATE POLICY "Users can insert match players"
ON "MatchPlayer"
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM "Match" m
    WHERE m.id = "matchId"
    AND (
      m.status = 'SCHEDULED' OR 
      m.status = 'IN_PROGRESS'
    )
  )
);

-- Create policy for updating match players (only for scheduled or in-progress matches)
CREATE POLICY "Users can update match players"
ON "MatchPlayer"
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM "Match" m
    WHERE m.id = "matchId"
    AND (
      m.status = 'SCHEDULED' OR 
      m.status = 'IN_PROGRESS'
    )
  )
);

-- Create policy for deleting match players (only for scheduled or in-progress matches)
CREATE POLICY "Users can delete match players"
ON "MatchPlayer"
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM "Match" m
    WHERE m.id = "matchId"
    AND (
      m.status = 'SCHEDULED' OR 
      m.status = 'IN_PROGRESS'
    )
  )
);

-- Create policy for admins to manage all match players (including completed/finalized matches)
CREATE POLICY "Admins can manage all match players"
ON "MatchPlayer"
FOR ALL
USING (
  -- Check if the user has the admin role
  -- Adjust this condition based on how you identify admins in your system
  auth.uid() IN (
    SELECT auth.uid() FROM auth.users
    WHERE auth.jwt() ->> 'role' = 'admin'
  )
);

-- Verify that the policies have been created
SELECT * FROM pg_policies WHERE tablename = 'matchplayer';
