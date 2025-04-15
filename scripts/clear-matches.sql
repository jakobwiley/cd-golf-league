-- Clear all matches and related data
-- Run this in the Supabase SQL editor

-- Delete in order to respect foreign key constraints
DELETE FROM "MatchScore";
DELETE FROM "MatchPoints";
DELETE FROM "MatchPlayer";
DELETE FROM "Match"; 