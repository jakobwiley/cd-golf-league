-- Match validation trigger to ensure matches can only be marked as completed when all holes have scores
-- This should be executed in the Supabase SQL Editor

-- Create the validation function
CREATE OR REPLACE FUNCTION validate_match_completion()
RETURNS TRIGGER AS $$
DECLARE
  player_count INTEGER;
  player_id TEXT;
  scores_count INTEGER;
  all_holes_filled BOOLEAN := TRUE;
BEGIN
  -- Only run validation when status is being changed to 'completed'
  IF (NEW.status = 'completed' OR NEW.status = 'COMPLETED') AND 
     (OLD.status != 'completed' AND OLD.status != 'COMPLETED') THEN
    
    -- Get count of players in the match
    SELECT COUNT(*) INTO player_count
    FROM "MatchPlayer"
    WHERE "matchId" = NEW.id;
    
    -- If no players, don't allow completion
    IF player_count = 0 THEN
      RAISE EXCEPTION 'Cannot mark match as completed: No players assigned to match';
    END IF;
    
    -- Check each player's scores
    FOR player_id IN 
      SELECT "playerId" FROM "MatchPlayer" WHERE "matchId" = NEW.id
    LOOP
      -- Count scores for this player
      SELECT COUNT(*) INTO scores_count
      FROM "Score"
      WHERE "matchId" = NEW.id AND "playerId" = player_id;
      
      -- If less than 9 scores, set flag to false
      IF scores_count < 9 THEN
        all_holes_filled := FALSE;
        EXIT; -- No need to check other players
      END IF;
      
      -- Check if all holes 1-9 have scores
      FOR i IN 1..9 LOOP
        IF NOT EXISTS (
          SELECT 1 FROM "Score" 
          WHERE "matchId" = NEW.id 
          AND "playerId" = player_id 
          AND hole = i
        ) THEN
          all_holes_filled := FALSE;
          EXIT; -- No need to check other holes
        END IF;
      END LOOP;
      
      -- If any holes missing, exit the loop
      IF NOT all_holes_filled THEN
        EXIT;
      END IF;
    END LOOP;
    
    -- If not all holes are filled, raise exception
    IF NOT all_holes_filled THEN
      RAISE EXCEPTION 'Cannot mark match as completed: All 9 holes must have scores for all players';
    END IF;
    
    -- Standardize to lowercase 'completed'
    NEW.status := 'completed';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
DROP TRIGGER IF EXISTS match_validation_trigger ON "Match";
CREATE TRIGGER match_validation_trigger
BEFORE UPDATE ON "Match"
FOR EACH ROW
EXECUTE FUNCTION validate_match_completion();

-- Add a comment to the trigger for documentation
COMMENT ON TRIGGER match_validation_trigger ON "Match" IS 
'Ensures matches can only be marked as completed when all 9 holes have scores for all players';
