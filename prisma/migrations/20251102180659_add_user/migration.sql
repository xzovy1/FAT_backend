/*
  Warnings:

  - You are about to drop the column `firstname` on the `Technician` table. All the data in the column will be lost.
  - You are about to drop the column `lastname` on the `Technician` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Technician" DROP COLUMN "firstname",
DROP COLUMN "lastname";

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "technician_id" INTEGER,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_technician_id_key" ON "User"("technician_id");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_technician_id_fkey" FOREIGN KEY ("technician_id") REFERENCES "Technician"("id") ON DELETE SET NULL ON UPDATE CASCADE;
