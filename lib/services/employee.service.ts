import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { requirePermission } from "@/lib/auth/guards";
import {
  assertEmployeeInScope,
  canViewCompensation,
  canViewSanctions,
  contextHasPermission,
  employeeScopeWhere,
  redactCompensation,
} from "@/lib/auth/access";
import { AppError } from "@/lib/errors";
import { writeAuditLog } from "@/lib/services/audit.service";
import { employeeSchema, type EmployeeInput } from "@/lib/validations/hr";
import { SENSITIVE_DOCUMENT_TYPE_CODES } from "@/lib/permissions";
import {
  getEmployeeById,
  getEmployeeStats,
  listEmployees,
  type EmployeeListParams,
} from "@/lib/repositories/employee.repository";

function toDate(value?: string) {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export async function fetchEmployees(params: EmployeeListParams) {
  const ctx = await requirePermission("employees.read");
  return listEmployees({ ...params, scopeWhere: employeeScopeWhere(ctx) });
}

export async function fetchEmployee(id: string) {
  const ctx = await requirePermission("employees.read");
  await assertEmployeeInScope(ctx, id);
  const employee = await getEmployeeById(id);
  if (!employee) {
    throw new AppError("Employé introuvable.", "NOT_FOUND");
  }

  let result = employee;
  if (!canViewCompensation(ctx, employee.id)) {
    result = redactCompensation(employee);
  }
  if (!canViewSanctions(ctx, employee.id)) {
    result = { ...result, sanctions: [] };
  }
  if (ctx.scope === "DIRECT_REPORTS") {
    result = {
      ...result,
      documents: result.documents.filter(
        (document) => !(SENSITIVE_DOCUMENT_TYPE_CODES as readonly string[]).includes(document.type.code),
      ),
    };
  }
  return result;
}

export async function fetchEmployeeStats() {
  const ctx = await requirePermission("employees.read");
  return getEmployeeStats(employeeScopeWhere(ctx));
}

export async function createEmployee(input: EmployeeInput) {
  const user = await requirePermission("employees.write");
  const data = employeeSchema.parse(input);

  const existing = await prisma.employee.findFirst({
    where: { OR: [{ email: data.email.toLowerCase() }, { matricule: data.matricule }] },
  });
  if (existing) {
    throw new AppError("Un employé avec cet e-mail ou ce matricule existe déjà.", "CONFLICT");
  }

  const employee = await prisma.employee.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email.toLowerCase(),
      phone: data.phone || null,
      dateOfBirth: toDate(data.dateOfBirth),
      gender: data.gender,
      address: data.address || null,
      matricule: data.matricule,
      departmentId: data.departmentId,
      positionId: data.positionId,
      contractType: data.contractType,
      hiredAt: toDate(data.hiredAt) ?? new Date(),
      salaryAmount: data.salaryAmount,
      cnps: data.cnps || null,
      status: data.status,
      contracts: {
        create: {
          type: data.contractType,
          startDate: toDate(data.hiredAt) ?? new Date(),
          salaryAmount: data.salaryAmount,
        },
      },
    },
  });

  await writeAuditLog({
    userId: user.id,
    action: "CREATE_EMPLOYEE",
    resource: "Employee",
    resourceId: employee.id,
    metadata: { matricule: employee.matricule },
  });

  revalidatePath("/employees");
  return employee;
}

export async function updateEmployee(id: string, input: EmployeeInput) {
  const user = await requirePermission("employees.write");
  await assertEmployeeInScope(user, id);
  const data = employeeSchema.parse(input);

  const current = await prisma.employee.findUnique({ where: { id }, select: { status: true } });
  if (!current) {
    throw new AppError("Employé introuvable.", "NOT_FOUND");
  }

  const deactivating =
    data.status !== current.status && (data.status === "TERMINATED" || data.status === "SUSPENDED");
  if (deactivating && !contextHasPermission(user, "employees.deactivate")) {
    throw new AppError("Vous ne pouvez pas désactiver un employé.", "FORBIDDEN");
  }

  const employee = await prisma.employee.update({
    where: { id },
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email.toLowerCase(),
      phone: data.phone || null,
      dateOfBirth: toDate(data.dateOfBirth),
      gender: data.gender,
      address: data.address || null,
      matricule: data.matricule,
      departmentId: data.departmentId,
      positionId: data.positionId,
      contractType: data.contractType,
      hiredAt: toDate(data.hiredAt) ?? new Date(),
      salaryAmount: data.salaryAmount,
      cnps: data.cnps || null,
      status: data.status,
    },
  });

  await writeAuditLog({
    userId: user.id,
    action: "UPDATE_EMPLOYEE",
    resource: "Employee",
    resourceId: employee.id,
  });

  revalidatePath("/employees");
  revalidatePath(`/employees/${id}`);
  return employee;
}

export async function deleteEmployee(id: string) {
  const user = await requirePermission("employees.delete");
  await prisma.employee.delete({ where: { id } });
  await writeAuditLog({
    userId: user.id,
    action: "DELETE_EMPLOYEE",
    resource: "Employee",
    resourceId: id,
  });
  revalidatePath("/employees");
}

export async function getEmployeeFormOptions() {
  await requirePermission("employees.read");
  const [departments, positions] = await Promise.all([
    prisma.department.findMany({ orderBy: { name: "asc" } }),
    prisma.position.findMany({ orderBy: { name: "asc" } }),
  ]);
  return { departments, positions };
}
