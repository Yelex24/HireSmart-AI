/*
  Warnings:

  - Added the required column `jobDescription` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Job" ADD COLUMN     "jobDescription" TEXT NOT NULL;
