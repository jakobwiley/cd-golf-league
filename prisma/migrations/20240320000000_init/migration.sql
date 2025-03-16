-- CreateTable
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

-- CreateTable
CREATE TABLE "MatchPoints" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "points" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MatchPoints_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerSubstitution" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "originalPlayerId" TEXT NOT NULL,
    "substitutePlayerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlayerSubstitution_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MatchScore_matchId_playerId_hole_key" ON "MatchScore"("matchId", "playerId", "hole");

-- CreateIndex
CREATE UNIQUE INDEX "MatchPoints_matchId_teamId_key" ON "MatchPoints"("matchId", "teamId");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerSubstitution_matchId_originalPlayerId_key" ON "PlayerSubstitution"("matchId", "originalPlayerId"); 