/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `movie` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "movie" ADD COLUMN     "username" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "movie_username_key" ON "movie"("username");
