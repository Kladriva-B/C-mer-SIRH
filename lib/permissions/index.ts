import type { AccessScope, RoleName } from "@prisma/client";

export const PERMISSIONS = [
  "dashboard.read",
  "employees.read",
  "employees.write",
  "employees.deactivate",
  "employees.delete",
  "workers.read",
  "workers.write",
  "workers.delete",
  "sanctions.read",
  "sanctions.write",
  "sanctions.approve",
  "sanctions.delete",
  "payroll.read",
  "payroll.write",
  "payroll.approve",
  "payroll.delete",
  "documents.read",
  "documents.write",
  "documents.archive",
  "documents.delete",
  "contracts.read",
  "contracts.write",
  "organization.read",
  "organization.write",
  "leaves.read",
  "leaves.write",
  "leaves.approve",
  "performance.read",
  "performance.write",
  "reports.read",
  "reports.export",
  "users.manage",
  "roles.manage",
  "settings.read",
  "settings.write",
  "audit.read",
  "integrations.manage",
] as const;

export type PermissionKey = (typeof PERMISSIONS)[number];

export const PERMISSION_LABELS: Record<PermissionKey, string> = {
  "dashboard.read": "Consulter le tableau de bord",
  "employees.read": "Consulter les employés",
  "employees.write": "Créer et modifier un employé",
  "employees.deactivate": "Désactiver un employé",
  "employees.delete": "Supprimer définitivement un employé",
  "workers.read": "Consulter les ouvriers",
  "workers.write": "Créer et modifier un ouvrier",
  "workers.delete": "Supprimer un ouvrier",
  "sanctions.read": "Consulter les sanctions",
  "sanctions.write": "Préparer une sanction",
  "sanctions.approve": "Valider ou clôturer une sanction",
  "sanctions.delete": "Supprimer une sanction",
  "payroll.read": "Consulter la paie",
  "payroll.write": "Préparer et générer un bulletin",
  "payroll.approve": "Approuver la paie finale",
  "payroll.delete": "Supprimer un bulletin",
  "documents.read": "Consulter les documents",
  "documents.write": "Ajouter ou modifier un document",
  "documents.archive": "Archiver un document",
  "documents.delete": "Supprimer un document",
  "contracts.read": "Consulter les contrats",
  "contracts.write": "Gérer les contrats",
  "organization.read": "Consulter l'organisation",
  "organization.write": "Gérer départements, postes et sites",
  "leaves.read": "Consulter les congés",
  "leaves.write": "Déposer une demande de congé",
  "leaves.approve": "Valider une demande de congé",
  "performance.read": "Consulter la performance",
  "performance.write": "Saisir une évaluation",
  "reports.read": "Consulter les rapports",
  "reports.export": "Exporter les rapports",
  "users.manage": "Gérer les utilisateurs",
  "roles.manage": "Créer et attribuer les rôles",
  "settings.read": "Consulter la configuration",
  "settings.write": "Modifier la configuration plateforme",
  "audit.read": "Consulter les journaux d'audit",
  "integrations.manage": "Gérer les intégrations et secrets",
};

export const ROLE_DEFAULT_SCOPE: Record<RoleName, AccessScope> = {
  ADMIN: "ALL",
  HR_MANAGER: "ALL",
  HR_AGENT: "ALL",
  MANAGER: "DIRECT_REPORTS",
  EMPLOYEE: "SELF",
};

export const ROLE_DESCRIPTIONS: Record<RoleName, string> = {
  ADMIN: "Gestion complète de la plateforme, réservée à très peu de personnes.",
  HR_MANAGER: "Gestion RH complète, sans configuration technique du système.",
  HR_AGENT: "Opérations RH quotidiennes, sans validation finale ni suppressions.",
  MANAGER: "Périmètre limité à son équipe directe.",
  EMPLOYEE: "Accès strictement personnel à son dossier.",
};

export const SCOPE_LABELS: Record<AccessScope, string> = {
  ALL: "Tous les employés",
  DEPARTMENT: "Son département",
  DIRECT_REPORTS: "Son équipe",
  SELF: "Lui-même",
};

const ADMIN_PERMISSIONS: PermissionKey[] = [...PERMISSIONS];

const HR_MANAGER_PERMISSIONS: PermissionKey[] = [
  "dashboard.read",
  "employees.read",
  "employees.write",
  "employees.deactivate",
  "workers.read",
  "workers.write",
  "sanctions.read",
  "sanctions.write",
  "sanctions.approve",
  "payroll.read",
  "payroll.write",
  "payroll.approve",
  "documents.read",
  "documents.write",
  "documents.archive",
  "contracts.read",
  "contracts.write",
  "organization.read",
  "organization.write",
  "leaves.read",
  "leaves.write",
  "leaves.approve",
  "performance.read",
  "performance.write",
  "reports.read",
  "reports.export",
];

const HR_AGENT_PERMISSIONS: PermissionKey[] = [
  "dashboard.read",
  "employees.read",
  "employees.write",
  "workers.read",
  "workers.write",
  "sanctions.read",
  "sanctions.write",
  "payroll.read",
  "payroll.write",
  "documents.read",
  "documents.write",
  "contracts.read",
  "organization.read",
  "leaves.read",
  "leaves.write",
  "performance.read",
  "reports.read",
];

const MANAGER_PERMISSIONS: PermissionKey[] = [
  "dashboard.read",
  "employees.read",
  "documents.read",
  "contracts.read",
  "leaves.read",
  "leaves.write",
  "leaves.approve",
  "performance.read",
  "reports.read",
];

const EMPLOYEE_PERMISSIONS: PermissionKey[] = [
  "dashboard.read",
  "documents.read",
  "payroll.read",
  "leaves.read",
  "leaves.write",
  "contracts.read",
  "sanctions.read",
];

export const ROLE_PERMISSIONS: Record<RoleName, PermissionKey[]> = {
  ADMIN: ADMIN_PERMISSIONS,
  HR_MANAGER: HR_MANAGER_PERMISSIONS,
  HR_AGENT: HR_AGENT_PERMISSIONS,
  MANAGER: MANAGER_PERMISSIONS,
  EMPLOYEE: EMPLOYEE_PERMISSIONS,
};

export const SENSITIVE_DOCUMENT_TYPE_CODES = ["ID", "PAYSLIP"] as const;

export type MatrixAction = "read" | "write" | "delete" | "approve";

export const MATRIX_RESOURCES = [
  { resource: "employees", label: "Employés" },
  { resource: "workers", label: "Ouvriers" },
  { resource: "payroll", label: "Paie" },
  { resource: "sanctions", label: "Sanctions" },
  { resource: "documents", label: "Documents" },
  { resource: "leaves", label: "Congés" },
  { resource: "reports", label: "Rapports" },
] as const;

export const MATRIX_ACTIONS: { action: MatrixAction; label: string }[] = [
  { action: "read", label: "Voir" },
  { action: "write", label: "Créer / modifier" },
  { action: "delete", label: "Supprimer" },
  { action: "approve", label: "Approuver" },
];

export function parsePermissionKey(key: string) {
  const [resource, action] = key.split(".");
  return { resource, action };
}

export function hasPermission(role: string, permission: PermissionKey) {
  return (ROLE_PERMISSIONS[role as RoleName] ?? []).includes(permission);
}

export function permissionListForRole(role: RoleName) {
  return ROLE_PERMISSIONS[role] ?? [];
}
