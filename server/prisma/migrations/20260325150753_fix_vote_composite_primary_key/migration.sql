-- DropIndex
DROP INDEX "votes_userId_activityId_key";

-- AlterTable
ALTER TABLE "votes" ADD CONSTRAINT "votes_pkey" PRIMARY KEY ("userId", "activityId");
