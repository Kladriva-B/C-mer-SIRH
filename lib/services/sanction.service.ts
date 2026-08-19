import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { PAGE_SIZE } from "@/lib/constants/labels";
import { requirePermission, requireUser } from "@/lib/auth/guards";
import { findEmployeeForUser } from "@/lib/auth/employee";
import {
  assertEmployeeInScope,
  contextHasPermission,
  employeeScopeWhere,
  mergeWhere,
  relatedEmployeeWhere,
} from "@/lib/auth/access";
import { AppError } from "@/lib/errors";
import { writeAuditLog } from "@/lib/services/audit.service";
import { sanctionSchema, type SanctionInput } from "@/lib/validations/hr";

export type SanctionListParams = {
  query?: string;
  status?: string;
  page?: number;
};

function toDate(value?: string) {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export async function listSanctions(params: SanctionListParams) {
  const ctx = await requirePermission("sanctions.read");
  const page = Math.max(1, params.page ?? 1);
  const where = mergeWhere(relatedEmployeeWhere(ctx), {
    ...(params.status ? { status: params.status as Prisma.SanctionWhereInput["status"] } : {}),
    ...(params.query
      ? {
          OR: [
            { reference: { contains: params.query, mode: "insensitive" } },
            { reason: { contains: params.query, mode: "insensitive" } },
            { employee: { firstName: { contains: params.query, mode: "insensitive" } } },
            { employee: { lastName: { contains: params.query, mode: "insensitive" } } },
            { employee: { matricule: { contains: params.query, mode: "insensitive" } } },
          ],
        }
      : {}),
  });

  const [items, total] = await Promise.all([
    prisma.sanction.findMany({
      where,
      include: {
        employee: true,
        type: true,
        issuer: true,
      },
      orderBy: { date: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.sanction.count({ where }),
  ]);

  return { items, total, page, pageSize: PAGE_SIZE };
}

export async function listMySanctions() {
  const user = await requireUser();
  const employee = await findEmployeeForUser(user);
  if (!employee) return [];
  return prisma.sanction.findMany({
    where: { employeeId: employee.id },
    include: { employee: true, type: true, issuer: true },
    orderBy: { date: "desc" },
  });
}

async function nextSanctionReference() {
  const year = new Date().getFullYear();
  const count = await prisma.sanction.count({
    where: { reference: { startsWith: `SAN-${year}-` } },
  });
  return `SAN-${year}-${String(count + 1).padStart(4, "0")}`;
}

export async function getSanctionStats() {
  const ctx = await requirePermission("sanctions.read");
  const scope = relatedEmployeeWhere(ctx);
  const [total, pending, active, closed, cancelled] = await Promise.all([
    prisma.sanction.count({ where: scope }),
    prisma.sanction.count({ where: mergeWhere(scope, { status: "PENDING" }) }),
    prisma.sanction.count({ where: mergeWhere(scope, { status: "ACTIVE" }) }),
    prisma.sanction.count({ where: mergeWhere(scope, { status: "CLOSED" }) }),
    prisma.sanction.count({ where: mergeWhere(scope, { status: "CANCELLED" }) }),
  ]);
  return { total, pending, active, closed, cancelled };
}

export async function getSanction(id: string) {
  const ctx = await requirePermission("sanctions.read");
  const sanction = await prisma.sanction.findUnique({
    where: { id },
    include: { employee: true, type: true, issuer: true },
  });
  if (!sanction) throw new AppError("Sanction introuvable.", "NOT_FOUND");
  await assertEmployeeInScope(ctx, sanction.employeeId);
  return sanction;
}

export async function createSanction(input: SanctionInput) {
  const user = await requirePermission("sanctions.write");
  const data = sanctionSchema.parse(input);
  await assertEmployeeInScope(user, data.employeeId);
  const status = contextHasPermission(user, "sanctions.approve") ? data.status : "PENDING";
  const sanction = await prisma.sanction.create({
    data: {
      reference: await nextSanctionReference(),
      employeeId: data.employeeId,
      typeId: data.typeId,
      reason: data.reason,
      description: data.description || null,
      date: toDate(data.date) ?? new Date(),
      durationDays: data.durationDays || null,
      comment: data.comment || null,
      status,
      issuerId: user.id,
    },
  });
  await writeAuditLog({
    userId: user.id,
    action: "CREATE_SANCTION",
    resource: "Sanction",
    resourceId: sanction.id,
  });
  revalidatePath("/sanctions");
  return sanction;
}

export async function updateSanction(id: string, input: SanctionInput) {
  const user = await requirePermission("sanctions.write");
  const data = sanctionSchema.parse(input);
  await assertEmployeeInScope(user, data.employeeId);
  const current = await prisma.sanction.findUnique({ where: { id } });
  if (!current) throw new AppError("Sanction introuvable.", "NOT_FOUND");

  if (!contextHasPermission(user, "sanctions.approve")) {
    if (current.status !== "PENDING") {
      throw new AppError("Cette sanction n'est plus modifiable.", "FORBIDDEN");
    }
    if (data.status !== "PENDING") {
      throw new AppError("Vous ne pouvez pas valider une sanction.", "FORBIDDEN");
    }
  }

  const sanction = await prisma.sanction.update({
    where: { id },
    data: {
      employeeId: data.employeeId,
      typeId: data.typeId,
      reason: data.reason,
      description: data.description || null,
      date: toDate(data.date) ?? new Date(),
      durationDays: data.durationDays || null,
      comment: data.comment || null,
      status: data.status,
    },
  });
  await writeAuditLog({
    userId: user.id,
    action: "UPDATE_SANCTION",
    resource: "Sanction",
    resourceId: sanction.id,
  });
  revalidatePath("/sanctions");
  return sanction;
}

export async function deleteSanction(id: string) {
  const user = await requirePermission("sanctions.delete");
  await prisma.sanction.delete({ where: { id } });
  await writeAuditLog({
    userId: user.id,
    action: "DELETE_SANCTION",
    resource: "Sanction",
    resourceId: id,
  });
  revalidatePath("/sanctions");
}

export async function getSanctionFormOptions() {
  const ctx = await requirePermission("sanctions.read");
  const [employees, types] = await Promise.all([
    prisma.employee.findMany({
      where: { status: { not: "TERMINATED" }, ...employeeScopeWhere(ctx) },
      orderBy: { lastName: "asc" },
      select: { id: true, firstName: true, lastName: true, matricule: true },
    }),
    prisma.sanctionType.findMany({ orderBy: { name: "asc" } }),
  ]);
  return { employees, types };
}
