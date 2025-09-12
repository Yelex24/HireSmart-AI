/*
  Warnings:

  - Added the required column `contactNumber` to the `Shortlist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Shortlist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `experienceYears` to the `Shortlist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Shortlist` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Shortlist" ADD COLUMN     "contactNumber" TEXT NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "experienceMonths" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "experienceYears" INTEGER NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;
