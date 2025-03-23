-- Drop all tables first
DROP TABLE IF EXISTS "PlayerSubstitution" CASCADE;
DROP TABLE IF EXISTS "MatchPoints" CASCADE;
DROP TABLE IF EXISTS "MatchScore" CASCADE;
DROP TABLE IF EXISTS "MatchPlayer" CASCADE;
DROP TABLE IF EXISTS "Match" CASCADE;
DROP TABLE IF EXISTS "Player" CASCADE;
DROP TABLE IF EXISTS "Team" CASCADE;

-- Drop types
DROP TYPE IF EXISTS "PlayerType" CASCADE;
DROP TYPE IF EXISTS "MatchStatus" CASCADE;

-- Create types
CREATE TYPE "PlayerType" AS ENUM ('PRIMARY', 'SUBSTITUTE');
CREATE TYPE "MatchStatus" AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED');

-- Create tables with correct schema
CREATE TABLE "Team" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Player" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "teamId" TEXT,
    "handicapIndex" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "handicap" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "playerType" "PlayerType" NOT NULL DEFAULT 'PRIMARY',
    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Match" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "weekNumber" INTEGER NOT NULL,
    "homeTeamId" TEXT NOT NULL,
    "awayTeamId" TEXT NOT NULL,
    "startingHole" SMALLINT NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "MatchStatus" NOT NULL DEFAULT 'SCHEDULED',
    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MatchScore" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "hole" SMALLINT NOT NULL,
    "score" SMALLINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "MatchScore_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MatchPoints" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "points" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "MatchPoints_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MatchPlayer" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "substituteFor" TEXT,
    "isSubstitute" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "MatchPlayer_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PlayerSubstitution" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "originalPlayerId" TEXT NOT NULL,
    "substitutePlayerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "PlayerSubstitution_pkey" PRIMARY KEY ("id")
);

-- Create indexes
CREATE UNIQUE INDEX "Team_name_key" ON "Team"("name");
CREATE INDEX "Player_teamId_idx" ON "Player"("teamId");

-- Add foreign key constraints
ALTER TABLE "Player" 
    ADD CONSTRAINT "Player_teamId_fkey" 
    FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Match"
    ADD CONSTRAINT "Match_homeTeamId_fkey" 
    FOREIGN KEY ("homeTeamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    ADD CONSTRAINT "Match_awayTeamId_fkey" 
    FOREIGN KEY ("awayTeamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "MatchScore"
    ADD CONSTRAINT "MatchScore_matchId_fkey" 
    FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    ADD CONSTRAINT "MatchScore_playerId_fkey" 
    FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "MatchPoints"
    ADD CONSTRAINT "MatchPoints_matchId_fkey" 
    FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    ADD CONSTRAINT "MatchPoints_teamId_fkey" 
    FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "MatchPlayer"
    ADD CONSTRAINT "MatchPlayer_matchId_fkey" 
    FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    ADD CONSTRAINT "MatchPlayer_playerId_fkey" 
    FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "PlayerSubstitution"
    ADD CONSTRAINT "PlayerSubstitution_matchId_fkey" 
    FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    ADD CONSTRAINT "PlayerSubstitution_originalPlayerId_fkey" 
    FOREIGN KEY ("originalPlayerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    ADD CONSTRAINT "PlayerSubstitution_substitutePlayerId_fkey" 
    FOREIGN KEY ("substitutePlayerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
