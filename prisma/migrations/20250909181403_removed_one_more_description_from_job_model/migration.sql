/*
  Warnings:

  - You are about to drop the column `description` on the `Job` table. All the data in the column will be lost.
  - Added the required column `companyDescription` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyName` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `experience` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pay` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `skills` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Job" DROP COLUMN "description",
ADD COLUMN     "companyDescription" TEXT NOT NULL,
ADD COLUMN     "companyName" TEXT NOT NULL,
ADD COLUMN     "experience" INTEGER NOT NULL,
ADD COLUMN     "pay" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "role" TEXT NOT NULL,
ADD COLUMN     "skills" TEXT NOT NULL;
