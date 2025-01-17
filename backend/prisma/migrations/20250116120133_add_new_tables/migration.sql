-- CreateTable
CREATE TABLE "users" (
    "userId" SERIAL NOT NULL,
    "userEmail" TEXT NOT NULL,
    "userName" TEXT,
    "userPassword" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "organizers" (
    "organizerId" SERIAL NOT NULL,
    "organizerEmail" TEXT NOT NULL,
    "organizerName" TEXT,
    "organizerPassword" TEXT,

    CONSTRAINT "organizers_pkey" PRIMARY KEY ("organizerId")
);

-- CreateTable
CREATE TABLE "tournaments" (
    "tournamentId" SERIAL NOT NULL,
    "tournamentName" TEXT NOT NULL,
    "organizerId" INTEGER NOT NULL,

    CONSTRAINT "tournaments_pkey" PRIMARY KEY ("tournamentId")
);

-- CreateTable
CREATE TABLE "tournamentTeams" (
    "id" SERIAL NOT NULL,
    "tournamentId" INTEGER NOT NULL,
    "teamId" INTEGER NOT NULL,

    CONSTRAINT "tournamentTeams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teams" (
    "teamId" SERIAL NOT NULL,
    "teamName" TEXT NOT NULL,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("teamId")
);

-- CreateTable
CREATE TABLE "players" (
    "playerId" SERIAL NOT NULL,
    "playerName" TEXT NOT NULL,
    "playerAge" INTEGER NOT NULL,

    CONSTRAINT "players_pkey" PRIMARY KEY ("playerId")
);

-- CreateTable
CREATE TABLE "teamPlayer" (
    "id" SERIAL NOT NULL,
    "teamId" INTEGER NOT NULL,
    "playerId" INTEGER NOT NULL,
    "playerName" TEXT NOT NULL,

    CONSTRAINT "teamPlayer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "matches" (
    "matchId" SERIAL NOT NULL,
    "tournamentId" INTEGER NOT NULL,
    "firstTeamId" INTEGER NOT NULL,
    "secondTeamId" INTEGER NOT NULL,
    "firstTeamName" TEXT NOT NULL,
    "secondTeamName" TEXT NOT NULL,
    "venue" TEXT NOT NULL,
    "dateTime" TIMESTAMP(3) NOT NULL,
    "result" TEXT NOT NULL,
    "isLive" BOOLEAN NOT NULL,
    "isCompleted" BOOLEAN NOT NULL,

    CONSTRAINT "matches_pkey" PRIMARY KEY ("matchId")
);

-- CreateTable
CREATE TABLE "scorecard" (
    "scorecardId" SERIAL NOT NULL,
    "matchId" INTEGER NOT NULL,
    "teamAScore" INTEGER NOT NULL,
    "teamBScore" INTEGER NOT NULL,
    "teamAWickets" INTEGER NOT NULL,
    "teamBWickets" INTEGER NOT NULL,
    "teamAOvers" DOUBLE PRECISION NOT NULL,
    "teamBOvers" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "scorecard_pkey" PRIMARY KEY ("scorecardId")
);

-- CreateTable
CREATE TABLE "extras" (
    "extrasId" SERIAL NOT NULL,
    "scorecardId" INTEGER NOT NULL,
    "teamName" TEXT NOT NULL,
    "byes" INTEGER NOT NULL,
    "legByes" INTEGER NOT NULL,
    "wides" INTEGER NOT NULL,
    "noBalls" INTEGER NOT NULL,
    "totalExtras" INTEGER NOT NULL,

    CONSTRAINT "extras_pkey" PRIMARY KEY ("extrasId")
);

-- CreateTable
CREATE TABLE "battingStats" (
    "battingStatsId" SERIAL NOT NULL,
    "scorecardId" INTEGER NOT NULL,
    "playerName" TEXT NOT NULL,
    "teamName" TEXT NOT NULL,
    "runs" INTEGER NOT NULL,
    "balls" INTEGER NOT NULL,
    "fours" INTEGER NOT NULL,
    "sixes" INTEGER NOT NULL,
    "strikeRate" DOUBLE PRECISION NOT NULL,
    "dismissal" TEXT NOT NULL,

    CONSTRAINT "battingStats_pkey" PRIMARY KEY ("battingStatsId")
);

-- CreateTable
CREATE TABLE "bowlingStats" (
    "bowlingStatsId" SERIAL NOT NULL,
    "scorecardId" INTEGER NOT NULL,
    "playerName" TEXT NOT NULL,
    "teamName" TEXT NOT NULL,
    "overs" DOUBLE PRECISION NOT NULL,
    "maidens" INTEGER NOT NULL,
    "runsConceded" INTEGER NOT NULL,
    "wickets" INTEGER NOT NULL,
    "economyRate" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "bowlingStats_pkey" PRIMARY KEY ("bowlingStatsId")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_userEmail_key" ON "users"("userEmail");

-- CreateIndex
CREATE UNIQUE INDEX "organizers_organizerEmail_key" ON "organizers"("organizerEmail");

-- CreateIndex
CREATE UNIQUE INDEX "tournamentTeams_tournamentId_teamId_key" ON "tournamentTeams"("tournamentId", "teamId");

-- CreateIndex
CREATE INDEX "players_playerName_idx" ON "players"("playerName");

-- CreateIndex
CREATE UNIQUE INDEX "players_playerId_playerName_key" ON "players"("playerId", "playerName");

-- CreateIndex
CREATE UNIQUE INDEX "teamPlayer_teamId_playerId_key" ON "teamPlayer"("teamId", "playerId");

-- CreateIndex
CREATE UNIQUE INDEX "scorecard_matchId_key" ON "scorecard"("matchId");

-- AddForeignKey
ALTER TABLE "tournaments" ADD CONSTRAINT "tournaments_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "organizers"("organizerId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tournamentTeams" ADD CONSTRAINT "tournamentTeams_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "tournaments"("tournamentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tournamentTeams" ADD CONSTRAINT "tournamentTeams_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("teamId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teamPlayer" ADD CONSTRAINT "teamPlayer_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("teamId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teamPlayer" ADD CONSTRAINT "teamPlayer_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("playerId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "tournaments"("tournamentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scorecard" ADD CONSTRAINT "scorecard_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "matches"("matchId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "extras" ADD CONSTRAINT "extras_scorecardId_fkey" FOREIGN KEY ("scorecardId") REFERENCES "scorecard"("scorecardId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "battingStats" ADD CONSTRAINT "battingStats_scorecardId_fkey" FOREIGN KEY ("scorecardId") REFERENCES "scorecard"("scorecardId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bowlingStats" ADD CONSTRAINT "bowlingStats_scorecardId_fkey" FOREIGN KEY ("scorecardId") REFERENCES "scorecard"("scorecardId") ON DELETE RESTRICT ON UPDATE CASCADE;
