import { z } from "zod";

const optionalFile = z.instanceof(File).optional().or(z.literal("").optional());

export const employeeSchema = z.object({
  firstName: z.string().min(2, "Le prénom est requis"),
  lastName: z.string().min(2, "Le nom est requis"),
  email: z.string().email("Adresse e-mail invalide"),
  phone: z.string().min(8, "Le téléphone est requis").optional().or(z.literal("")),
  dateOfBirth: z.string().optional().or(z.literal("")),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  address: z.string().optional().or(z.literal("")),
  matricule: z.string().min(3, "Le matricule est requis"),
  departmentId: z.string().uuid("Département invalide"),
  positionId: z.string().uuid("Poste invalide"),
  contractType: z.enum(["CDI", "CDD", "INTERNSHIP", "TEMPORARY", "CONSULTANT", "TRIAL"]),
  hiredAt: z.string().min(1, "La date d'embauche est requise"),
  salaryAmount: z.coerce.number().int().min(0, "Le salaire doit être positif"),
  cnps: z.string().optional().or(z.literal("")),
  status: z.enum(["ACTIVE", "ON_LEAVE", "SUSPENDED", "TERMINATED"]).default("ACTIVE"),
  identityDocument: optionalFile,
  contractDocument: optionalFile,
  photo: optionalFile,
});

export type EmployeeInput = z.infer<typeof employeeSchema>;

export const workerSchema = z.object({
  firstName: z.string().min(2, "Le prénom est requis"),
  lastName: z.string().min(2, "Le nom est requis"),
  email: z.string().email("Adresse e-mail invalide").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  dateOfBirth: z.string().optional().or(z.literal("")),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  address: z.string().optional().or(z.literal("")),
  matricule: z.string().min(3, "Le matricule est requis"),
  positionId: z.string().uuid("Poste invalide"),
  siteId: z.string().uuid("Site invalide"),
  assignment: z.string().optional().or(z.literal("")),
  contractType: z.enum(["CDI", "CDD", "INTERNSHIP", "TEMPORARY", "CONSULTANT", "TRIAL"]),
  hiredAt: z.string().min(1, "La date d'embauche est requise"),
  dailyRate: z.coerce.number().int().min(0, "Le taux journalier doit être positif"),
  status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"]).default("ACTIVE"),
});

export type WorkerInput = z.infer<typeof workerSchema>;

export const sanctionSchema = z.object({
  employeeId: z.string().uuid("Employé invalide"),
  typeId: z.string().uuid("Type de sanction invalide"),
  reason: z.string().min(3, "Le motif est requis"),
  description: z.string().optional().or(z.literal("")),
  date: z.string().min(1, "La date est requise"),
  durationDays: z.coerce.number().int().min(0).optional(),
  comment: z.string().optional().or(z.literal("")),
  status: z.enum(["PENDING", "ACTIVE", "CLOSED", "CANCELLED"]).default("PENDING"),
});

export type SanctionInput = z.infer<typeof sanctionSchema>;

export const payrollSchema = z.object({
  employeeId: z.string().uuid("Employé invalide"),
  periodYear: z.coerce.number().int().min(2020),
  periodMonth: z.coerce.number().int().min(1).max(12),
  grossAmount: z.coerce.number().int().min(0),
  notes: z.string().optional().or(z.literal("")),
});

export type PayrollInput = z.infer<typeof payrollSchema>;

export const leaveRequestSchema = z.object({
  kind: z.enum(["ANNUAL", "SICK", "UNPAID", "OTHER", "PERMISSION", "ABSENCE"]),
  startDate: z.string().min(1, "La date de début est requise"),
  endDate: z.string().min(1, "La date de fin est requise"),
  reason: z.string().optional().or(z.literal("")),
});

export type LeaveRequestInput = z.infer<typeof leaveRequestSchema>;
