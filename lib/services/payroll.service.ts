import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { PAGE_SIZE } from "@/lib/constants/labels";
import { requirePermission } from "@/lib/auth/guards";
import {
  assertEmployeeInScope,
  contextHasPermission,
  mergeWhere,
  relatedEmployeeWhere,
} from "@/lib/auth/access";
import { AppError } from "@/lib/errors";
import { writeAuditLog } from "@/lib/services/audit.service";
import { payrollSchema, type PayrollInput } from "@/lib/validations/hr";
import { nextDocumentReference } from "@/lib/services/verification.service";

export type PayrollListParams = {
  query?: string;
  status?: string;
  page?: number;
};

function computeItems(grossAmount: number) {
  const transport = 25_000;
  const taxable = grossAmount + transport;
  const cnps = Math.round(grossAmount * 0.042);
  const irpp = Math.round(Math.max(taxable - 50_000, 0) * 0.1);
  const deductions = cnps + irpp;
  const netAmount = taxable - deductions;

  return {
    grossAmount: taxable,
    deductions,
    netAmount,
    items: [
      { label: "Salaire de base", amount: grossAmount, kind: "earning" },
      { label: "Prime de transport", amount: transport, kind: "earning" },
      { label: "CNPS (4,2 %)", amount: -cnps, kind: "deduction" },
      { label: "IRPP (estimé)", amount: -irpp, kind: "deduction" },
    ],
  };
}

export async function listPayrolls(params: PayrollListParams) {
  const ctx = await requirePermission("payroll.read");
  const page = Math.max(1, params.page ?? 1);
  const where = mergeWhere(relatedEmployeeWhere(ctx), {
    ...(params.status ? { status: params.status as Prisma.PayrollWhereInput["status"] } : {}),
    ...(params.query
      ? {
          OR: [
            { employee: { firstName: { contains: params.query, mode: "insensitive" } } },
            { employee: { lastName: { contains: params.query, mode: "insensitive" } } },
            { employee: { matricule: { contains: params.query, mode: "insensitive" } } },
          ],
        }
      : {}),
  });

  const [items, total] = await Promise.all([
    prisma.payroll.findMany({
      where,
      include: { employee: true, verification: true },
      orderBy: [{ periodYear: "desc" }, { periodMonth: "desc" }],
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.payroll.count({ where }),
  ]);

  return { items, total, page, pageSize: PAGE_SIZE };
}

export async function getPayrollStats() {
  const ctx = await requirePermission("payroll.read");
  const scope = relatedEmployeeWhere(ctx);
  const [generated, pending, errors, mass] = await Promise.all([
    prisma.payroll.count({ where: mergeWhere(scope, { status: "GENERATED" }) }),
    prisma.payroll.count({ where: mergeWhere(scope, { status: "PENDING" }) }),
    prisma.payroll.count({ where: mergeWhere(scope, { status: "ERROR" }) }),
    prisma.payroll.aggregate({
      _sum: { netAmount: true },
      where: mergeWhere(scope, { status: { in: ["GENERATED", "PAID"] } }),
    }),
  ]);
  return {
    generated,
    pending,
    errors,
    mass: mass._sum.netAmount ?? 0,
  };
}

export async function getPayroll(id: string) {
  const ctx = await requirePermission("payroll.read");
  const payroll = await prisma.payroll.findUnique({
    where: { id },
    include: {
      employee: { include: { department: true, position: true } },
      items: true,
      verification: true,
    },
  });
  if (!payroll) throw new AppError("Bulletin introuvable.", "NOT_FOUND");
  await assertEmployeeInScope(ctx, payroll.employeeId);
  return payroll;
}

export async function generatePayroll(input: PayrollInput) {
  const user = await requirePermission("payroll.write");
  const data = payrollSchema.parse(input);
  await assertEmployeeInScope(user, data.employeeId);
  const employee = await prisma.employee.findUnique({ where: { id: data.employeeId } });
  if (!employee) throw new AppError("Employé introuvable.", "NOT_FOUND");

  const computed = computeItems(data.grossAmount || employee.salaryAmount);
  const existing = await prisma.payroll.findUnique({
    where: {
      employeeId_periodYear_periodMonth: {
        employeeId: data.employeeId,
        periodYear: data.periodYear,
        periodMonth: data.periodMonth,
      },
    },
  });

  const status = contextHasPermission(user, "payroll.approve") ? "GENERATED" : "PENDING";

  const payroll = existing
    ? await prisma.payroll.update({
        where: { id: existing.id },
        data: {
          ...computed,
          status,
          generatedAt: status === "GENERATED" ? new Date() : null,
          notes: data.notes || null,
          items: {
            deleteMany: {},
            create: computed.items,
          },
        },
      })
    : await prisma.payroll.create({
        data: {
          employeeId: data.employeeId,
          periodYear: data.periodYear,
          periodMonth: data.periodMonth,
          ...computed,
          status,
          generatedAt: status === "GENERATED" ? new Date() : null,
          notes: data.notes || null,
          items: { create: computed.items },
        },
      });

  const reference = await nextDocumentReference();
  await prisma.verification.upsert({
    where: { payrollId: payroll.id },
    update: { status: "VALID", issuedAt: new Date() },
    create: {
      reference,
      payrollId: payroll.id,
      employeeId: employee.id,
      status: "VALID",
    },
  });

  await writeAuditLog({
    userId: user.id,
    action: existing ? "UPDATE_PAYROLL" : "CREATE_PAYROLL",
    resource: "Payroll",
    resourceId: payroll.id,
  });

  revalidatePath("/payroll");
  return payroll;
}

export async function deletePayroll(id: string) {
  const user = await requirePermission("payroll.delete");
  await prisma.payroll.delete({ where: { id } });
  await writeAuditLog({
    userId: user.id,
    action: "DELETE_PAYROLL",
    resource: "Payroll",
    resourceId: id,
  });
  revalidatePath("/payroll");
}

export async function getPayrollFormOptions() {
  const ctx = await requirePermission("payroll.read");
  const employees = await prisma.employee.findMany({
    where: { status: "ACTIVE", ...relatedEmployeeWhere(ctx).employee },
    orderBy: { lastName: "asc" },
    select: { id: true, firstName: true, lastName: true, matricule: true, salaryAmount: true },
  });
  return { employees };
}
