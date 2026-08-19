ALTER TYPE "LeaveKind" ADD VALUE 'PERMISSION';
ALTER TYPE "LeaveKind" ADD VALUE 'ABSENCE';
ALTER TYPE "LeaveStatus" ADD VALUE 'CANCELLED';
ALTER TYPE "SanctionStatus" ADD VALUE 'CANCELLED';

ALTER TABLE "Employee" ADD COLUMN "leaveBalance" INTEGER NOT NULL DEFAULT 18;
ALTER TABLE "Department" ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "Site" ADD COLUMN "email" TEXT;
ALTER TABLE "Site" ADD COLUMN "phone" TEXT;
ALTER TABLE "Site" ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true;

ALTER TABLE "Sanction" ADD COLUMN "reference" TEXT;
UPDATE "Sanction" AS s
SET "reference" = 'SAN-2026-' || LPAD(x.seq::text, 4, '0')
FROM (
  SELECT id, ROW_NUMBER() OVER (ORDER BY "createdAt") AS seq
  FROM "Sanction"
) AS x
WHERE s.id = x.id;
ALTER TABLE "Sanction" ALTER COLUMN "reference" SET NOT NULL;
CREATE UNIQUE INDEX "Sanction_reference_key" ON "Sanction"("reference");
