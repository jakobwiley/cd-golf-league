-- Fix Team table
ALTER TABLE "Team" 
  ALTER COLUMN "name" SET NOT NULL,
  ALTER COLUMN "createdAt" SET NOT NULL,
  ALTER COLUMN "updatedAt" SET NOT NULL,
  ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP,
  ALTER COLUMN "createdAt" TYPE timestamp(3) without time zone,
  ALTER COLUMN "updatedAt" TYPE timestamp(3) without time zone;

CREATE UNIQUE INDEX IF NOT EXISTS "Team_name_key" ON "Team"("name");

-- Add missing foreign key constraints
ALTER TABLE "MatchPoints" 
  ADD CONSTRAINT "MatchPoints_teamId_fkey" 
  FOREIGN KEY ("teamId") REFERENCES "Team"(id) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE "Match" 
  ADD CONSTRAINT "Match_awayTeamId_fkey" 
  FOREIGN KEY ("awayTeamId") REFERENCES "Team"(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  ADD CONSTRAINT "Match_homeTeamId_fkey" 
  FOREIGN KEY ("homeTeamId") REFERENCES "Team"(id) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE "Player" 
  ADD CONSTRAINT "Player_teamId_fkey" 
  FOREIGN KEY ("teamId") REFERENCES "Team"(id) ON UPDATE CASCADE ON DELETE SET NULL;
