import { cache } from "react";
import type { AccessScope, Prisma, RoleName } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { AppError } from "@/lib/errors";
import {
  PERMISSIONS,
  ROLE_DEFAULT_SCOPE,
  ROLE_PERMISSIONS,
  SENSITIVE_DOCUMENT_TYPE_CODES,
  type PermissionKey,
} from "@/lib/permissions";

export type AccessContext = {
  id: string;
  email: string;
  name: string;
  role: RoleName;
  permissions: PermissionKey[];
  scope: AccessScope;
  employeeId: string | null;
  departmentId: string | null;
};

const PERMISSION_SET = new Set<string>(PERMISSIONS);

export const getAccessContext = cache(async (): Promise<AccessContext | null> => {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      role: { include: { permissions: { include: { permission: true } } } },
      employee: { select: { id: true, departmentId: true } },
    },
  });

  if (!dbUser || !dbUser.isActive) {
    return null;
  }

  const fromDb = dbUser.role.permissions
    .map((item) => item.permission.key)
    .filter((key): key is PermissionKey => PERMISSION_SET.has(key));

  const permissions = fromDb.length ? fromDb : (ROLE_PERMISSIONS[dbUser.role.name] ?? []);

  return {
    id: dbUser.id,
    email: dbUser.email,
    name: dbUser.name,
    role: dbUser.role.name,
    permissions,
    scope: dbUser.scopeOverride ?? dbUser.role.defaultScope ?? ROLE_DEFAULT_SCOPE[dbUser.role.name],
    employeeId: dbUser.employee?.id ?? null,
    departmentId: dbUser.employee?.departmentId ?? null,
  };
});

export function contextHasPermission(ctx: AccessContext, permission: PermissionKey) {
  return ctx.permissions.includes(permission);
}

export function employeeScopeWhere(ctx: AccessContext): Prisma.EmployeeWhereInput {
  switch (ctx.scope) {
    case "ALL":
      return {};
    case "DEPARTMENT":
      return ctx.departmentId
        ? { departmentId: ctx.departmentId }
        : { id: ctx.employeeId ?? "__none__" };
    case "DIRECT_REPORTS":
      return {
        OR: [{ id: ctx.employeeId ?? "__none__" }, { managerId: ctx.employeeId ?? "__none__" }],
      };
    case "SELF":
    default:
      return { id: ctx.employeeId ?? "__none__" };
  }
}

export function mergeWhere<T extends object>(base: T, extra: object): T {
  const extraEmpty = Object.keys(extra).length === 0;
  const baseEmpty = Object.keys(base).length === 0;
  if (extraEmpty) return base;
  if (baseEmpty) return extra as T;
  return { AND: [base, extra] } as T;
}

export function employeeInScopeWhere(ctx: AccessContext): Prisma.EmployeeWhereInput {
  return employeeScopeWhere(ctx);
}

export function relatedEmployeeWhere(ctx: AccessContext): { employee: Prisma.EmployeeWhereInput } {
  return { employee: employeeScopeWhere(ctx) };
}

export function documentScopeWhere(ctx: AccessContext): Prisma.DocumentWhereInput {
  if (ctx.scope === "ALL") {
    return {};
  }

  const scoped: Prisma.DocumentWhereInput = {
    employee: employeeScopeWhere(ctx),
  };

  if (ctx.scope === "DIRECT_REPORTS") {
    return {
      AND: [
        scoped,
        { type: { code: { notIn: [...SENSITIVE_DOCUMENT_TYPE_CODES] } } },
      ],
    };
  }

  return scoped;
}

export function canViewCompensation(ctx: AccessContext, employeeId?: string | null) {
  if (employeeId && ctx.employeeId === employeeId) {
    return contextHasPermission(ctx, "payroll.read") || contextHasPermission(ctx, "employees.read");
  }
  return contextHasPermission(ctx, "payroll.read") && ctx.scope === "ALL";
}

export function canViewSanctions(ctx: AccessContext, employeeId?: string | null) {
  if (employeeId && ctx.employeeId === employeeId) {
    return contextHasPermission(ctx, "sanctions.read");
  }
  return contextHasPermission(ctx, "sanctions.read") && ctx.scope === "ALL";
}

export async function assertEmployeeInScope(ctx: AccessContext, employeeId: string) {
  if (ctx.scope === "ALL") {
    return;
  }

  const employee = await prisma.employee.findUnique({
    where: { id: employeeId },
    select: { id: true, managerId: true, departmentId: true },
  });

  if (!employee) {
    throw new AppError("Employé introuvable.", "NOT_FOUND");
  }

  const allowed =
    (ctx.scope === "SELF" && employee.id === ctx.employeeId) ||
    (ctx.scope === "DEPARTMENT" && employee.departmentId === ctx.departmentId) ||
    (ctx.scope === "DIRECT_REPORTS" &&
      (employee.id === ctx.employeeId || employee.managerId === ctx.employeeId));

  if (!allowed) {
    throw new AppError("Vous n'avez pas accès à ce dossier.", "FORBIDDEN");
  }
}

export function redactCompensation<T extends {
  salaryAmount?: number | null;
  cnps?: string | null;
  payrolls?: unknown;
  contracts?: Array<{
    salaryAmount: number | null;
    netAmount: number | null;
    hourlyRate: number | null;
  }>;
}>(value: T): T {
  return {
    ...value,
    salaryAmount: 0,
    cnps: null,
    payrolls: [],
    contracts: value.contracts?.map((contract) => ({
      ...contract,
      salaryAmount: null,
      netAmount: null,
      hourlyRate: null,
    })),
  };
}
