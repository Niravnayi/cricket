/*
  Warnings:

  - Added the required column `playerRole` to the `players` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "playerRole" AS ENUM ('BATSMAN', 'BOWLER', 'ALLROUNDER');

-- AlterTable
ALTER TABLE "players" ADD COLUMN     "isCaptain" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "playerRole" "playerRole" NOT NULL;
