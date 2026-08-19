CREATE TYPE "AccessScope" AS ENUM ('ALL', 'DEPARTMENT', 'DIRECT_REPORTS', 'SELF');

ALTER TABLE "Role" ADD COLUMN "defaultScope" "AccessScope" NOT NULL DEFAULT 'SELF';
ALTER TABLE "Role" ADD COLUMN "isSystem" BOOLEAN NOT NULL DEFAULT true;

ALTER TABLE "Permission" ADD COLUMN "resource" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Permission" ADD COLUMN "action" TEXT NOT NULL DEFAULT '';

ALTER TABLE "RolePermission" ADD COLUMN "scope" "AccessScope";

ALTER TABLE "User" ADD COLUMN "scopeOverride" "AccessScope";

ALTER TABLE "Employee" ADD COLUMN "managerId" TEXT;

CREATE INDEX "Permission_resource_action_idx" ON "Permission"("resource", "action");
CREATE INDEX "User_scopeOverride_idx" ON "User"("scopeOverride");
CREATE INDEX "Employee_managerId_idx" ON "Employee"("managerId");

ALTER TABLE "Employee"
  ADD CONSTRAINT "Employee_managerId_fkey"
  FOREIGN KEY ("managerId") REFERENCES "Employee"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

UPDATE "Role" SET "defaultScope" = 'ALL' WHERE "name" IN ('ADMIN', 'HR_MANAGER', 'HR_AGENT');
UPDATE "Role" SET "defaultScope" = 'DIRECT_REPORTS' WHERE "name" = 'MANAGER';
UPDATE "Role" SET "defaultScope" = 'SELF' WHERE "name" = 'EMPLOYEE';

UPDATE "Role" SET "description" = 'Gestion complète de la plateforme, réservée à très peu de personnes.' WHERE "name" = 'ADMIN';
UPDATE "Role" SET "description" = 'Gestion RH complète, sans configuration technique du système.' WHERE "name" = 'HR_MANAGER';
UPDATE "Role" SET "description" = 'Opérations RH quotidiennes, sans validation finale ni suppressions.' WHERE "name" = 'HR_AGENT';
UPDATE "Role" SET "description" = 'Périmètre limité à son équipe directe.' WHERE "name" = 'MANAGER';
UPDATE "Role" SET "description" = 'Accès strictement personnel à son dossier.' WHERE "name" = 'EMPLOYEE';

INSERT INTO "Permission" ("id", "key", "resource", "action", "description", "createdAt")
SELECT gen_random_uuid(), x.key, split_part(x.key, '.', 1), split_part(x.key, '.', 2), x.key, NOW()
FROM (
  VALUES
    ('employees.deactivate'),
    ('sanctions.approve'),
    ('payroll.approve'),
    ('documents.archive'),
    ('leaves.approve'),
    ('reports.export'),
    ('users.manage'),
    ('roles.manage'),
    ('integrations.manage')
) AS x(key)
WHERE NOT EXISTS (SELECT 1 FROM "Permission" p WHERE p.key = x.key);

UPDATE "Permission"
SET
  "resource" = split_part("key", '.', 1),
  "action" = split_part("key", '.', 2)
WHERE "key" LIKE '%.%';

DELETE FROM "RolePermission";

INSERT INTO "RolePermission" ("roleId", "permissionId")
SELECT r.id, p.id
FROM "Role" r
CROSS JOIN "Permission" p
WHERE r.name = 'ADMIN';

INSERT INTO "RolePermission" ("roleId", "permissionId")
SELECT r.id, p.id
FROM "Role" r
JOIN "Permission" p ON p.key IN (
  'dashboard.read',
  'employees.read', 'employees.write', 'employees.deactivate',
  'workers.read', 'workers.write',
  'sanctions.read', 'sanctions.write', 'sanctions.approve',
  'payroll.read', 'payroll.write', 'payroll.approve',
  'documents.read', 'documents.write', 'documents.archive',
  'contracts.read', 'contracts.write',
  'organization.read', 'organization.write',
  'leaves.read', 'leaves.write', 'leaves.approve',
  'performance.read', 'performance.write',
  'reports.read', 'reports.export'
)
WHERE r.name = 'HR_MANAGER';

INSERT INTO "RolePermission" ("roleId", "permissionId")
SELECT r.id, p.id
FROM "Role" r
JOIN "Permission" p ON p.key IN (
  'dashboard.read',
  'employees.read', 'employees.write',
  'workers.read', 'workers.write',
  'sanctions.read', 'sanctions.write',
  'payroll.read', 'payroll.write',
  'documents.read', 'documents.write',
  'contracts.read',
  'organization.read',
  'leaves.read', 'leaves.write',
  'performance.read',
  'reports.read'
)
WHERE r.name = 'HR_AGENT';

INSERT INTO "RolePermission" ("roleId", "permissionId")
SELECT r.id, p.id
FROM "Role" r
JOIN "Permission" p ON p.key IN (
  'dashboard.read',
  'employees.read',
  'documents.read',
  'contracts.read',
  'leaves.read', 'leaves.write', 'leaves.approve',
  'performance.read',
  'reports.read'
)
WHERE r.name = 'MANAGER';

INSERT INTO "RolePermission" ("roleId", "permissionId")
SELECT r.id, p.id
FROM "Role" r
JOIN "Permission" p ON p.key IN (
  'dashboard.read',
  'documents.read',
  'payroll.read',
  'leaves.read', 'leaves.write',
  'contracts.read',
  'sanctions.read'
)
WHERE r.name = 'EMPLOYEE';
