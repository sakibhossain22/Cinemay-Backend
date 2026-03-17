/*
  Warnings:

  - You are about to drop the column `username` on the `movie` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[customid]` on the table `movie` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "movie_username_key";

-- AlterTable
ALTER TABLE "movie" DROP COLUMN "username",
ADD COLUMN     "customid" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "movie_customid_key" ON "movie"("customid");
