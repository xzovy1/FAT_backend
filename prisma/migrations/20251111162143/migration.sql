/*
  Warnings:

  - You are about to drop the column `job_number` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `model` on the `Unit` table. All the data in the column will be lost.
  - You are about to drop the column `technician_id` on the `UnitTest` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `Job` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `shift` to the `Technician` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_by` to the `TestResult` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deficiency_category` to the `TestResult` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `TestResult` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unit_hand` to the `Unit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Orientation" AS ENUM ('Left', 'Right');

-- CreateEnum
CREATE TYPE "DeficiencyCategory" AS ENUM ('INCORRECT_INSTALLATION', 'INCORRECT_TERMINATION', 'FAULTY_COMPONENT', 'MISSING_PART', 'OUT_OF_STOCK', 'POOR_WORKMANSHIP', 'ADJUSTMENT');

-- DropIndex
DROP INDEX "Job_job_number_key";

-- AlterTable
ALTER TABLE "Job" DROP COLUMN "job_number",
ADD COLUMN     "model" TEXT;

-- AlterTable
ALTER TABLE "Technician" ADD COLUMN     "shift" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "TestResult" ADD COLUMN     "comments" TEXT,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "created_by" INTEGER NOT NULL,
ADD COLUMN     "deficiency_category" "DeficiencyCategory" NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Unit" DROP COLUMN "model",
ADD COLUMN     "unit_hand" "Orientation" NOT NULL;

-- AlterTable
ALTER TABLE "UnitTest" DROP COLUMN "technician_id";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "is_admin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "last_login" TIMESTAMP(3),
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "username" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "TestFormVersion" (
    "id" SERIAL NOT NULL,
    "form_id" INTEGER NOT NULL,
    "changes" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER NOT NULL,

    CONSTRAINT "TestFormVersion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Job_id_key" ON "Job"("id");

-- CreateIndex
CREATE INDEX "UnitTest_started_at_idx" ON "UnitTest"("started_at");

-- CreateIndex
CREATE INDEX "UnitTest_completed_at_idx" ON "UnitTest"("completed_at");

-- CreateIndex
CREATE INDEX "UnitTest_unit_id_job_id_idx" ON "UnitTest"("unit_id", "job_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "TestFormVersion" ADD CONSTRAINT "TestFormVersion_form_id_fkey" FOREIGN KEY ("form_id") REFERENCES "TestForm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
