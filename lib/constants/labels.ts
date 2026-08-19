export const APP_NAME = "Camer SIRH";
export const APP_DESCRIPTION =
  "Plateforme professionnelle de gestion RH, paie, sanctions et documents.";

export const PAGE_SIZE = 10;

export const ROLE_LABELS = {
  ADMIN: "Administrateur",
  HR_MANAGER: "Responsable RH",
  HR_AGENT: "Agent RH",
  MANAGER: "Manager",
  EMPLOYEE: "Employé",
} as const;

export const SCOPE_LABELS = {
  ALL: "Tous les employés",
  DEPARTMENT: "Son département",
  DIRECT_REPORTS: "Son équipe",
  SELF: "Lui-même",
} as const;

export const EMPLOYEE_STATUS_LABELS = {
  ACTIVE: "Actif",
  ON_LEAVE: "En congé",
  SUSPENDED: "Suspendu",
  TERMINATED: "Sorti",
} as const;

export const WORKER_STATUS_LABELS = {
  ACTIVE: "Actif",
  INACTIVE: "Inactif",
  SUSPENDED: "Suspendu",
} as const;

export const CONTRACT_TYPE_LABELS = {
  CDI: "CDI",
  CDD: "CDD",
  INTERNSHIP: "Stage",
  TEMPORARY: "Intérim",
  CONSULTANT: "Consultant",
  TRIAL: "Essai",
} as const;

export const CONTRACT_STATUS_LABELS = {
  ACTIVE: "Actif",
  ENDED: "Terminé",
  PENDING: "En attente",
} as const;

export const LEAVE_KIND_LABELS = {
  ANNUAL: "Congé annuel",
  SICK: "Congé maladie",
  UNPAID: "Sans solde",
  OTHER: "Autre",
  PERMISSION: "Permission",
  ABSENCE: "Absence",
} as const;

export const LEAVE_STATUS_LABELS = {
  PENDING: "En attente",
  APPROVED: "Approuvé",
  REJECTED: "Refusé",
  CANCELLED: "Annulé",
} as const;

export const EXPLANATION_STATUS_LABELS = {
  PENDING: "En attente",
  ANSWERED: "Répondue",
  CLOSED: "Clôturée",
} as const;

export const GENDER_LABELS = {
  MALE: "Homme",
  FEMALE: "Femme",
  OTHER: "Autre",
} as const;

export const SANCTION_STATUS_LABELS = {
  PENDING: "En attente",
  ACTIVE: "Active",
  CLOSED: "Terminée",
  CANCELLED: "Annulée",
} as const;

export const EVALUATION_MENTION_LABELS = {
  EXCELLENT: "Excellent",
  VERY_GOOD: "Très bien",
  GOOD: "Bien",
  FAIR: "Passable",
  INSUFFICIENT: "Insuffisant",
} as const;

export const PAYROLL_STATUS_LABELS = {
  DRAFT: "Brouillon",
  PENDING: "En attente",
  GENERATED: "Généré",
  ERROR: "Erreur",
  PAID: "Payé",
} as const;

export const DOCUMENT_STATUS_LABELS = {
  DRAFT: "Brouillon",
  ACTIVE: "Actif",
  ARCHIVED: "Archivé",
} as const;

export const VERIFICATION_STATUS_LABELS = {
  VALID: "Authentique",
  EXPIRED: "Expiré",
  INVALID: "Invalide",
  NOT_FOUND: "Introuvable",
} as const;
