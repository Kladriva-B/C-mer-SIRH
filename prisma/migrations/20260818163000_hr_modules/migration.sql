-- AlterEnum
ALTER TYPE "ContractType" ADD VALUE 'TRIAL';
ALTER TYPE "AuditAction" ADD VALUE 'UPDATE_PASSWORD';
ALTER TYPE "AuditAction" ADD VALUE 'UPDATE_SECURITY';

-- CreateEnum
CREATE TYPE "ContractStatus" AS ENUM ('ACTIVE', 'ENDED', 'PENDING');
CREATE TYPE "LeaveKind" AS ENUM ('ANNUAL', 'SICK', 'UNPAID', 'OTHER');
CREATE TYPE "LeaveStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
CREATE TYPE "ExplanationStatus" AS ENUM ('PENDING', 'ANSWERED', 'CLOSED');

-- AlterTable
ALTER TABLE "User" ADD COLUMN "emailVerifiedAt" TIMESTAMP(3);
ALTER TABLE "User" ADD COLUMN "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "Employee" ADD COLUMN "cnps" TEXT;

ALTER TABLE "Contract" ADD COLUMN "status" "ContractStatus" NOT NULL DEFAULT 'ACTIVE';
ALTER TABLE "Contract" ADD COLUMN "netAmount" INTEGER;
ALTER TABLE "Contract" ADD COLUMN "hourlyRate" INTEGER;
ALTER TABLE "Contract" ADD COLUMN "weeklyHours" INTEGER DEFAULT 40;

-- CreateTable
CREATE TABLE "LeaveRequest" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "kind" "LeaveKind" NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "days" INTEGER NOT NULL,
    "reason" TEXT,
    "status" "LeaveStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeaveRequest_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ExplanationRequest" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" "ExplanationStatus" NOT NULL DEFAULT 'PENDING',
    "dueDate" DATE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExplanationRequest_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Evaluation" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "comment" TEXT,
    "evaluatedAt" DATE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Evaluation_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "LeaveRequest_employeeId_idx" ON "LeaveRequest"("employeeId");
CREATE INDEX "LeaveRequest_status_idx" ON "LeaveRequest"("status");
CREATE INDEX "LeaveRequest_startDate_idx" ON "LeaveRequest"("startDate");
CREATE INDEX "ExplanationRequest_employeeId_idx" ON "ExplanationRequest"("employeeId");
CREATE INDEX "ExplanationRequest_status_idx" ON "ExplanationRequest"("status");
CREATE INDEX "Evaluation_employeeId_idx" ON "Evaluation"("employeeId");
CREATE INDEX "Evaluation_evaluatedAt_idx" ON "Evaluation"("evaluatedAt");
CREATE INDEX "Contract_status_idx" ON "Contract"("status");

ALTER TABLE "LeaveRequest" ADD CONSTRAINT "LeaveRequest_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ExplanationRequest" ADD CONSTRAINT "ExplanationRequest_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Evaluation" ADD CONSTRAINT "Evaluation_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;
