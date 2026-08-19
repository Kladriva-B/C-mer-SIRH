-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "RoleName" AS ENUM ('ADMIN', 'HR_MANAGER', 'HR_AGENT', 'MANAGER', 'EMPLOYEE');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "EmployeeStatus" AS ENUM ('ACTIVE', 'ON_LEAVE', 'SUSPENDED', 'TERMINATED');

-- CreateEnum
CREATE TYPE "WorkerStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "ContractType" AS ENUM ('CDI', 'CDD', 'INTERNSHIP', 'TEMPORARY', 'CONSULTANT');

-- CreateEnum
CREATE TYPE "SanctionStatus" AS ENUM ('PENDING', 'ACTIVE', 'CLOSED');

-- CreateEnum
CREATE TYPE "PayrollStatus" AS ENUM ('DRAFT', 'PENDING', 'GENERATED', 'ERROR', 'PAID');

-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('DRAFT', 'ACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('VALID', 'EXPIRED', 'INVALID', 'NOT_FOUND');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('SUCCESS', 'ERROR', 'WARNING', 'INFO');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('CREATE_EMPLOYEE', 'UPDATE_EMPLOYEE', 'DELETE_EMPLOYEE', 'CREATE_WORKER', 'UPDATE_WORKER', 'DELETE_WORKER', 'CREATE_SANCTION', 'UPDATE_SANCTION', 'DELETE_SANCTION', 'CREATE_PAYROLL', 'UPDATE_PAYROLL', 'DELETE_PAYROLL', 'UPLOAD_DOCUMENT', 'DELETE_DOCUMENT', 'VERIFY_DOCUMENT', 'LOGIN', 'LOGOUT');

-- CreateEnum
CREATE TYPE "PersonType" AS ENUM ('EMPLOYEE', 'WORKER');

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "name" "RoleName" NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RolePermission" (
    "roleId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,

    CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("roleId","permissionId")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" TIMESTAMP(3),
    "roleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "legalName" TEXT,
    "address" TEXT,
    "city" TEXT,
    "country" TEXT NOT NULL DEFAULT 'Cameroun',
    "phone" TEXT,
    "email" TEXT,
    "logoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Department" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Position" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "departmentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Position_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Site" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "city" TEXT,
    "address" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Site_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employee" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "dateOfBirth" DATE,
    "gender" "Gender",
    "address" TEXT,
    "matricule" TEXT NOT NULL,
    "departmentId" TEXT NOT NULL,
    "positionId" TEXT NOT NULL,
    "contractType" "ContractType" NOT NULL,
    "hiredAt" DATE NOT NULL,
    "salaryAmount" INTEGER NOT NULL,
    "status" "EmployeeStatus" NOT NULL DEFAULT 'ACTIVE',
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Worker" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "dateOfBirth" DATE,
    "gender" "Gender",
    "address" TEXT,
    "matricule" TEXT NOT NULL,
    "positionId" TEXT NOT NULL,
    "siteId" TEXT NOT NULL,
    "assignment" TEXT,
    "contractType" "ContractType" NOT NULL,
    "hiredAt" DATE NOT NULL,
    "dailyRate" INTEGER NOT NULL,
    "status" "WorkerStatus" NOT NULL DEFAULT 'ACTIVE',
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Worker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contract" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT,
    "workerId" TEXT,
    "type" "ContractType" NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE,
    "salaryAmount" INTEGER,
    "documentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contract_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SanctionType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SanctionType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sanction" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "typeId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "description" TEXT,
    "date" DATE NOT NULL,
    "durationDays" INTEGER,
    "status" "SanctionStatus" NOT NULL DEFAULT 'PENDING',
    "comment" TEXT,
    "issuerId" TEXT,
    "documentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sanction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payroll" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "periodYear" INTEGER NOT NULL,
    "periodMonth" INTEGER NOT NULL,
    "grossAmount" INTEGER NOT NULL,
    "deductions" INTEGER NOT NULL,
    "netAmount" INTEGER NOT NULL,
    "status" "PayrollStatus" NOT NULL DEFAULT 'DRAFT',
    "generatedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payroll_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PayrollItem" (
    "id" TEXT NOT NULL,
    "payrollId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "kind" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PayrollItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DocumentType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "typeId" TEXT NOT NULL,
    "employeeId" TEXT,
    "workerId" TEXT,
    "payrollId" TEXT,
    "uploaderId" TEXT,
    "storageKey" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "status" "DocumentStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Verification" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "documentId" TEXT,
    "payrollId" TEXT,
    "employeeId" TEXT,
    "status" "VerificationStatus" NOT NULL DEFAULT 'VALID',
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL DEFAULT 'INFO',
    "href" TEXT,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" "AuditAction" NOT NULL,
    "resource" TEXT NOT NULL,
    "resourceId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_key_key" ON "Permission"("key");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_roleId_idx" ON "User"("roleId");

-- CreateIndex
CREATE INDEX "User_isActive_idx" ON "User"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "Department_name_key" ON "Department"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Department_code_key" ON "Department"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Position_code_key" ON "Position"("code");

-- CreateIndex
CREATE INDEX "Position_departmentId_idx" ON "Position"("departmentId");

-- CreateIndex
CREATE UNIQUE INDEX "Site_name_key" ON "Site"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Site_code_key" ON "Site"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_userId_key" ON "Employee"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_email_key" ON "Employee"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_matricule_key" ON "Employee"("matricule");

-- CreateIndex
CREATE INDEX "Employee_lastName_idx" ON "Employee"("lastName");

-- CreateIndex
CREATE INDEX "Employee_departmentId_idx" ON "Employee"("departmentId");

-- CreateIndex
CREATE INDEX "Employee_positionId_idx" ON "Employee"("positionId");

-- CreateIndex
CREATE INDEX "Employee_status_idx" ON "Employee"("status");

-- CreateIndex
CREATE INDEX "Employee_hiredAt_idx" ON "Employee"("hiredAt");

-- CreateIndex
CREATE UNIQUE INDEX "Worker_email_key" ON "Worker"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Worker_matricule_key" ON "Worker"("matricule");

-- CreateIndex
CREATE INDEX "Worker_lastName_idx" ON "Worker"("lastName");

-- CreateIndex
CREATE INDEX "Worker_siteId_idx" ON "Worker"("siteId");

-- CreateIndex
CREATE INDEX "Worker_positionId_idx" ON "Worker"("positionId");

-- CreateIndex
CREATE INDEX "Worker_status_idx" ON "Worker"("status");

-- CreateIndex
CREATE INDEX "Contract_employeeId_idx" ON "Contract"("employeeId");

-- CreateIndex
CREATE INDEX "Contract_workerId_idx" ON "Contract"("workerId");

-- CreateIndex
CREATE UNIQUE INDEX "SanctionType_name_key" ON "SanctionType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SanctionType_code_key" ON "SanctionType"("code");

-- CreateIndex
CREATE INDEX "Sanction_employeeId_idx" ON "Sanction"("employeeId");

-- CreateIndex
CREATE INDEX "Sanction_typeId_idx" ON "Sanction"("typeId");

-- CreateIndex
CREATE INDEX "Sanction_status_idx" ON "Sanction"("status");

-- CreateIndex
CREATE INDEX "Sanction_date_idx" ON "Sanction"("date");

-- CreateIndex
CREATE INDEX "Payroll_status_idx" ON "Payroll"("status");

-- CreateIndex
CREATE INDEX "Payroll_periodYear_periodMonth_idx" ON "Payroll"("periodYear", "periodMonth");

-- CreateIndex
CREATE UNIQUE INDEX "Payroll_employeeId_periodYear_periodMonth_key" ON "Payroll"("employeeId", "periodYear", "periodMonth");

-- CreateIndex
CREATE INDEX "PayrollItem_payrollId_idx" ON "PayrollItem"("payrollId");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentType_name_key" ON "DocumentType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentType_code_key" ON "DocumentType"("code");

-- CreateIndex
CREATE INDEX "Document_typeId_idx" ON "Document"("typeId");

-- CreateIndex
CREATE INDEX "Document_employeeId_idx" ON "Document"("employeeId");

-- CreateIndex
CREATE INDEX "Document_workerId_idx" ON "Document"("workerId");

-- CreateIndex
CREATE INDEX "Document_status_idx" ON "Document"("status");

-- CreateIndex
CREATE INDEX "Document_createdAt_idx" ON "Document"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Verification_reference_key" ON "Verification"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "Verification_documentId_key" ON "Verification"("documentId");

-- CreateIndex
CREATE UNIQUE INDEX "Verification_payrollId_key" ON "Verification"("payrollId");

-- CreateIndex
CREATE INDEX "Verification_status_idx" ON "Verification"("status");

-- CreateIndex
CREATE INDEX "Notification_userId_readAt_idx" ON "Notification"("userId", "readAt");

-- CreateIndex
CREATE INDEX "Notification_createdAt_idx" ON "Notification"("createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");

-- CreateIndex
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");

-- CreateIndex
CREATE INDEX "AuditLog_resource_resourceId_idx" ON "AuditLog"("resource", "resourceId");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Position" ADD CONSTRAINT "Position_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "Position"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Worker" ADD CONSTRAINT "Worker_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "Position"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Worker" ADD CONSTRAINT "Worker_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "Worker"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sanction" ADD CONSTRAINT "Sanction_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sanction" ADD CONSTRAINT "Sanction_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "SanctionType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sanction" ADD CONSTRAINT "Sanction_issuerId_fkey" FOREIGN KEY ("issuerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payroll" ADD CONSTRAINT "Payroll_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayrollItem" ADD CONSTRAINT "PayrollItem_payrollId_fkey" FOREIGN KEY ("payrollId") REFERENCES "Payroll"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "DocumentType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "Worker"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_payrollId_fkey" FOREIGN KEY ("payrollId") REFERENCES "Payroll"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_uploaderId_fkey" FOREIGN KEY ("uploaderId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Verification" ADD CONSTRAINT "Verification_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Verification" ADD CONSTRAINT "Verification_payrollId_fkey" FOREIGN KEY ("payrollId") REFERENCES "Payroll"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Verification" ADD CONSTRAINT "Verification_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

