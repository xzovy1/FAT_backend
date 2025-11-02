/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "DataType" AS ENUM ('boolean', 'numeric', 'text', 'range', 'date');

-- CreateEnum
CREATE TYPE "ResultStatus" AS ENUM ('PASS', 'FAIL', 'INCOMPLETE');

-- CreateEnum
CREATE TYPE "TestType" AS ENUM ('FULLWATER', 'BYPASS');

-- DropTable
DROP TABLE "public"."User";

-- CreateTable
CREATE TABLE "Technician" (
    "id" SERIAL NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,

    CONSTRAINT "Technician_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Job" (
    "id" SERIAL NOT NULL,
    "job_number" INTEGER NOT NULL,
    "plc_mfg" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Unit" (
    "id" SERIAL NOT NULL,
    "unit_number" INTEGER NOT NULL,
    "model" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Unit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestForm" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TestForm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnitTest" (
    "id" SERIAL NOT NULL,
    "unit_id" INTEGER NOT NULL,
    "form_id" INTEGER NOT NULL,
    "job_id" INTEGER NOT NULL,
    "technician_id" INTEGER NOT NULL,
    "test_type" "TestType" NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),
    "conditional_sign_off" BOOLEAN NOT NULL,
    "signoff_id" INTEGER,

    CONSTRAINT "UnitTest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestSection" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "sequence" INTEGER NOT NULL,
    "form_id" INTEGER NOT NULL,

    CONSTRAINT "TestSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestPoint" (
    "id" SERIAL NOT NULL,
    "section_id" INTEGER NOT NULL,
    "sequence" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "expected_value" INTEGER,
    "expected_values" INTEGER[],
    "data_type" "DataType" NOT NULL,
    "testFormId" INTEGER,

    CONSTRAINT "TestPoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestResult" (
    "id" SERIAL NOT NULL,
    "unit_test_id" INTEGER NOT NULL,
    "test_point_id" INTEGER NOT NULL,
    "actual_value" TEXT,
    "actual_number" DOUBLE PRECISION,
    "result" "ResultStatus" NOT NULL,

    CONSTRAINT "TestResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_TechnicianToUnitTest" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_TechnicianToUnitTest_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Job_job_number_key" ON "Job"("job_number");

-- CreateIndex
CREATE UNIQUE INDEX "Unit_unit_number_key" ON "Unit"("unit_number");

-- CreateIndex
CREATE UNIQUE INDEX "TestForm_name_version_key" ON "TestForm"("name", "version");

-- CreateIndex
CREATE INDEX "_TechnicianToUnitTest_B_index" ON "_TechnicianToUnitTest"("B");

-- AddForeignKey
ALTER TABLE "UnitTest" ADD CONSTRAINT "UnitTest_signoff_id_fkey" FOREIGN KEY ("signoff_id") REFERENCES "Technician"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnitTest" ADD CONSTRAINT "UnitTest_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnitTest" ADD CONSTRAINT "UnitTest_form_id_fkey" FOREIGN KEY ("form_id") REFERENCES "TestForm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnitTest" ADD CONSTRAINT "UnitTest_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestSection" ADD CONSTRAINT "TestSection_form_id_fkey" FOREIGN KEY ("form_id") REFERENCES "TestForm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestPoint" ADD CONSTRAINT "TestPoint_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "TestSection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestPoint" ADD CONSTRAINT "TestPoint_testFormId_fkey" FOREIGN KEY ("testFormId") REFERENCES "TestForm"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestResult" ADD CONSTRAINT "TestResult_unit_test_id_fkey" FOREIGN KEY ("unit_test_id") REFERENCES "UnitTest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestResult" ADD CONSTRAINT "TestResult_test_point_id_fkey" FOREIGN KEY ("test_point_id") REFERENCES "TestPoint"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TechnicianToUnitTest" ADD CONSTRAINT "_TechnicianToUnitTest_A_fkey" FOREIGN KEY ("A") REFERENCES "Technician"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TechnicianToUnitTest" ADD CONSTRAINT "_TechnicianToUnitTest_B_fkey" FOREIGN KEY ("B") REFERENCES "UnitTest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
