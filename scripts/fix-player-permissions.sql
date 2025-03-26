-- Script to fix Player permissions in Supabase
-- This script implements the following permission structure:
-- 1. All users can view players
-- 2. Only authenticated users can add/edit/delete players

-- First, enable Row Level Security on the Player table
ALTER TABLE "Player" ENABLE ROW LEVEL SECURITY;

-- Drop any existing RLS policies for the Player table
DROP POLICY IF EXISTS "Users can view all players" ON "Player";
DROP POLICY IF EXISTS "Users can insert players" ON "Player";
DROP POLICY IF EXISTS "Users can update players" ON "Player";
DROP POLICY IF EXISTS "Users can delete players" ON "Player";
DROP POLICY IF EXISTS "Admins can manage all players" ON "Player";

-- Create policy for viewing players (all users can view all players)
CREATE POLICY "Users can view all players"
ON "Player"
FOR SELECT
USING (true);

-- Create policy for inserting players (authenticated users only)
CREATE POLICY "Users can insert players"
ON "Player"
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- Create policy for updating players (authenticated users only)
CREATE POLICY "Users can update players"
ON "Player"
FOR UPDATE
USING (auth.uid() IS NOT NULL);

-- Create policy for deleting players (authenticated users only)
CREATE POLICY "Users can delete players"
ON "Player"
FOR DELETE
USING (auth.uid() IS NOT NULL);

-- Create policy for admins to manage all players
CREATE POLICY "Admins can manage all players"
ON "Player"
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
SELECT * FROM pg_policies WHERE tablename = 'player';
