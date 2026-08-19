import { prisma } from "@/lib/db/prisma";
import { requirePermission } from "@/lib/auth/guards";
import {
  contextHasPermission,
  employeeScopeWhere,
  relatedEmployeeWhere,
} from "@/lib/auth/access";

export async function getDashboardData() {
  const ctx = await requirePermission("dashboard.read");
  const employeeWhere = employeeScopeWhere(ctx);
  const related = relatedEmployeeWhere(ctx);
  const scoped = ctx.scope !== "ALL";
  const canPayroll = contextHasPermission(ctx, "payroll.read");
  const canEmployees = contextHasPermission(ctx, "employees.read");

  const now = new Date();
  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
    return { year: date.getFullYear(), month: date.getMonth() + 1, label: date };
  });
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

  const [
    employees,
    departmentsCount,
    positionsCount,
    activeContracts,
    onLeaveToday,
    explanations,
    evaluations,
    workers,
    sanctions,
    payrolls,
    documents,
    departments,
    recentEmployees,
    recentActivity,
    pendingSanctions,
    pendingPayrolls,
  ] = await Promise.all([
    canEmployees ? prisma.employee.count({ where: employeeWhere }) : 0,
    prisma.department.count(),
    prisma.position.count(),
    prisma.contract.count({
      where: scoped
        ? { status: "ACTIVE", OR: [related, ctx.scope === "ALL" ? { workerId: { not: null } } : { id: "__none__" }] }
        : { status: "ACTIVE" },
    }),
    prisma.leaveRequest.count({
      where: {
        ...related,
        status: "APPROVED",
        startDate: { lte: todayEnd },
        endDate: { gte: todayStart },
      },
    }),
    prisma.explanationRequest.count({ where: { status: "PENDING", ...related } }),
    prisma.evaluation.count({ where: related }),
    contextHasPermission(ctx, "workers.read") ? prisma.worker.count() : 0,
    contextHasPermission(ctx, "sanctions.read") ? prisma.sanction.count({ where: related }) : 0,
    canPayroll ? prisma.payroll.count({ where: related }) : 0,
    contextHasPermission(ctx, "documents.read")
      ? prisma.document.count({ where: scoped ? { employee: employeeWhere } : {} })
      : 0,
    prisma.department.findMany({
      include: { _count: { select: { employees: { where: employeeWhere } } } },
      orderBy: { name: "asc" },
    }),
    canEmployees
      ? prisma.employee.findMany({
          where: employeeWhere,
          take: 5,
          orderBy: { createdAt: "desc" },
          include: { department: true, position: true },
        })
      : [],
    contextHasPermission(ctx, "audit.read")
      ? prisma.auditLog.findMany({
          take: 8,
          orderBy: { createdAt: "desc" },
          include: { user: true },
        })
      : prisma.auditLog.findMany({
          where: { userId: ctx.id },
          take: 8,
          orderBy: { createdAt: "desc" },
          include: { user: true },
        }),
    contextHasPermission(ctx, "sanctions.read")
      ? prisma.sanction.count({ where: { status: "PENDING", ...related } })
      : 0,
    canPayroll ? prisma.payroll.count({ where: { status: "PENDING", ...related } }) : 0,
  ]);

  const employeeTrend = await Promise.all(
    months.map(async ({ year, month, label }) => {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 1);
      const count = await prisma.employee.count({
        where: { ...employeeWhere, hiredAt: { gte: start, lt: end } },
      });
      return { label: label.toISOString(), count };
    }),
  );

  const leaveTrend = await Promise.all(
    months.map(async ({ year, month, label }) => {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 1);
      const count = await prisma.leaveRequest.count({
        where: { ...related, startDate: { gte: start, lt: end } },
      });
      return { label: label.toISOString(), count };
    }),
  );

  const explanationTrend = await Promise.all(
    months.map(async ({ year, month, label }) => {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 1);
      const count = await prisma.explanationRequest.count({
        where: { ...related, createdAt: { gte: start, lt: end } },
      });
      return { label: label.toISOString(), count };
    }),
  );

  const performanceTrend = await Promise.all(
    months.map(async ({ year, month, label }) => {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 1);
      const count = await prisma.evaluation.count({
        where: { ...related, evaluatedAt: { gte: start, lt: end } },
      });
      return { label: label.toISOString(), count };
    }),
  );

  const payrollTrend = canPayroll
    ? await Promise.all(
        months.map(async ({ year, month, label }) => {
          const result = await prisma.payroll.aggregate({
            _sum: { netAmount: true },
            where: { ...related, periodYear: year, periodMonth: month },
          });
          return { label: label.toISOString(), amount: result._sum.netAmount ?? 0 };
        }),
      )
    : months.map(({ label }) => ({ label: label.toISOString(), amount: 0 }));

  const [contractStats, sanctionStats] = await Promise.all([
    prisma.contract.groupBy({
      by: ["type"],
      _count: { type: true },
      where: scoped ? related : undefined,
    }),
    contextHasPermission(ctx, "sanctions.read")
      ? prisma.sanction.groupBy({
          by: ["status"],
          _count: { status: true },
          where: related,
        })
      : [],
  ]);

  return {
    greetingName: ctx.name ?? "équipe",
    cards: {
      employees,
      departments: departmentsCount,
      positions: positionsCount,
      activeContracts,
      onLeaveToday,
      explanations,
      evaluations,
      workers,
      sanctions,
      payrolls,
      documents,
    },
    departments,
    recentEmployees,
    recentActivity,
    actions: [
      { label: "Sanctions en attente", count: pendingSanctions, href: "/sanctions?status=PENDING" },
      { label: "Bulletins en attente", count: pendingPayrolls, href: "/payroll?status=PENDING" },
      { label: "Demandes d'explication", count: explanations, href: "/performance" },
    ],
    charts: {
      employeeTrend,
      leaveTrend,
      explanationTrend,
      performanceTrend,
      payrollTrend,
      departments: departments.map((department) => ({
        name: department.name,
        value: department._count.employees,
      })),
      contracts: contractStats.map((item) => ({
        name: item.type,
        value: item._count.type,
      })),
      sanctions: sanctionStats.map((item) => ({
        name: item.status,
        value: item._count.status,
      })),
    },
  };
}
