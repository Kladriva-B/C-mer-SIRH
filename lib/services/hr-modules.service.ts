import { prisma } from "@/lib/db/prisma";
import { requirePermission, requireUser } from "@/lib/auth/guards";
import { findEmployeeForUser } from "@/lib/auth/employee";
import { AppError } from "@/lib/errors";
import { leaveRequestSchema, type LeaveRequestInput } from "@/lib/validations/hr";
import { differenceInCalendarDays } from "date-fns";
import { revalidatePath } from "next/cache";
import {
  assertEmployeeInScope,
  canViewCompensation,
  contextHasPermission,
  relatedEmployeeWhere,
} from "@/lib/auth/access";

export async function listContracts() {
  const ctx = await requirePermission("contracts.read");
  const contracts = await prisma.contract.findMany({
    where: {
      OR: [
        relatedEmployeeWhere(ctx),
        ctx.scope === "ALL" ? { workerId: { not: null } } : { id: "__none__" },
      ],
    },
    include: {
      employee: { include: { department: true, position: true } },
      worker: true,
    },
    orderBy: { startDate: "desc" },
  });

  if (ctx.scope === "ALL" && canViewCompensation(ctx)) {
    return contracts;
  }

  return contracts.map((contract) => {
    const own = contract.employeeId === ctx.employeeId;
    if (own || canViewCompensation(ctx, contract.employeeId)) {
      return contract;
    }
    return {
      ...contract,
      salaryAmount: null,
      netAmount: null,
      hourlyRate: null,
    };
  });
}

export async function getOrganizationOverview() {
  await requirePermission("organization.read");
  const [organization, departments, positions, sites] = await Promise.all([
    prisma.organization.findFirst(),
    prisma.department.findMany({
      include: { _count: { select: { employees: true, positions: true } } },
      orderBy: { name: "asc" },
    }),
    prisma.position.findMany({
      include: { department: true, _count: { select: { employees: true, workers: true } } },
      orderBy: { name: "asc" },
    }),
    prisma.site.findMany({
      include: { _count: { select: { workers: true } } },
      orderBy: { name: "asc" },
    }),
  ]);
  return { organization, departments, positions, sites };
}

export async function listLeaves() {
  const ctx = await requirePermission("leaves.read");
  if (ctx.scope === "SELF" || !contextHasPermission(ctx, "employees.read")) {
    return listMyLeaves();
  }
  return prisma.leaveRequest.findMany({
    where: relatedEmployeeWhere(ctx),
    include: { employee: true },
    orderBy: { startDate: "desc" },
  });
}

export async function listMyLeaves() {
  const user = await requireUser();
  const employee = await findEmployeeForUser(user);
  if (!employee) return [];
  return prisma.leaveRequest.findMany({
    where: { employeeId: employee.id },
    include: { employee: true },
    orderBy: { startDate: "desc" },
  });
}

export async function getMyLeaveContext() {
  const user = await requireUser();
  return findEmployeeForUser(user);
}

export async function createLeaveRequest(input: LeaveRequestInput) {
  const user = await requirePermission("leaves.write");
  const data = leaveRequestSchema.parse(input);
  const employee = await findEmployeeForUser(user);
  if (!employee) {
    throw new AppError("Aucun dossier employé n'est lié à ce compte.", "NOT_FOUND");
  }
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);
  const days = Math.max(1, differenceInCalendarDays(end, start) + 1);
  if (data.kind === "ANNUAL" && days > employee.leaveBalance) {
    throw new AppError("Solde de congés insuffisant.", "VALIDATION");
  }

  await prisma.leaveRequest.create({
    data: {
      employeeId: employee.id,
      kind: data.kind,
      startDate: start,
      endDate: end,
      days,
      reason: data.reason || null,
      status: "PENDING",
    },
  });
  revalidatePath("/leaves");
  revalidatePath("/leaves/mine");
}

export async function decideLeaveRequest(id: string, status: "APPROVED" | "REJECTED") {
  const ctx = await requirePermission("leaves.approve");
  const leave = await prisma.leaveRequest.findUnique({ where: { id } });
  if (!leave) {
    throw new AppError("Demande introuvable.", "NOT_FOUND");
  }
  await assertEmployeeInScope(ctx, leave.employeeId);
  if (leave.status !== "PENDING") {
    throw new AppError("Cette demande a déjà été traitée.", "VALIDATION");
  }

  await prisma.$transaction(async (tx) => {
    await tx.leaveRequest.update({ where: { id }, data: { status } });
    if (status === "APPROVED" && leave.kind === "ANNUAL") {
      await tx.employee.update({
        where: { id: leave.employeeId },
        data: { leaveBalance: { decrement: leave.days } },
      });
    }
  });
  revalidatePath("/leaves");
  revalidatePath("/leaves/mine");
}

export async function listEvaluations() {
  const ctx = await requirePermission("performance.read");
  return prisma.evaluation.findMany({
    where: relatedEmployeeWhere(ctx),
    include: { employee: { include: { department: true } } },
    orderBy: { evaluatedAt: "desc" },
  });
}

export async function listExplanations() {
  const ctx = await requirePermission("performance.read");
  return prisma.explanationRequest.findMany({
    where: relatedEmployeeWhere(ctx),
    include: { employee: true },
    orderBy: { createdAt: "desc" },
  });
}

export function mentionFromScore(score: number) {
  if (score >= 90) return "EXCELLENT" as const;
  if (score >= 80) return "VERY_GOOD" as const;
  if (score >= 70) return "GOOD" as const;
  if (score >= 50) return "FAIR" as const;
  return "INSUFFICIENT" as const;
}

export async function getPerformanceDashboard() {
  const ctx = await requirePermission("performance.read");
  const evaluations = await prisma.evaluation.findMany({
    where: relatedEmployeeWhere(ctx),
    include: { employee: { include: { department: true } } },
  });
  const average = evaluations.length
    ? evaluations.reduce((sum, item) => sum + item.score, 0) / evaluations.length
    : 0;
  const top = [...evaluations].sort((a, b) => b.score - a.score)[0] ?? null;
  const byDepartment = new Map<string, { total: number; count: number }>();
  for (const item of evaluations) {
    const name = item.employee.department.name;
    const current = byDepartment.get(name) ?? { total: 0, count: 0 };
    current.total += item.score;
    current.count += 1;
    byDepartment.set(name, current);
  }
  const topDepartment = [...byDepartment.entries()]
    .map(([name, value]) => ({ name, average: value.total / value.count }))
    .sort((a, b) => b.average - a.average)[0];
  const mentions = evaluations.reduce<Record<string, number>>((acc, item) => {
    const mention = mentionFromScore(item.score);
    acc[mention] = (acc[mention] ?? 0) + 1;
    return acc;
  }, {});
  const ranking = [...evaluations]
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .map((item, index) => ({
      rank: index + 1,
      employee: item.employee,
      score: item.score,
      mention: mentionFromScore(item.score),
    }));

  return {
    total: evaluations.length,
    average,
    top,
    topDepartment,
    mentions,
    ranking,
    evaluations,
  };
}
