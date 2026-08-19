import { prisma } from "@/lib/db/prisma";
import { requireUser } from "@/lib/auth/guards";
import {
  contextHasPermission,
  documentScopeWhere,
  employeeScopeWhere,
  relatedEmployeeWhere,
} from "@/lib/auth/access";

export async function globalSearch(query: string) {
  const ctx = await requireUser();
  const q = query.trim();
  if (q.length < 2) {
    return { employees: [], workers: [], documents: [], sanctions: [], payrolls: [] };
  }

  const employeeWhere = employeeScopeWhere(ctx);

  const [employees, workers, documents, sanctions, payrolls] = await Promise.all([
    contextHasPermission(ctx, "employees.read")
      ? prisma.employee.findMany({
          where: {
            AND: [
              employeeWhere,
              {
                OR: [
                  { firstName: { contains: q, mode: "insensitive" } },
                  { lastName: { contains: q, mode: "insensitive" } },
                  { matricule: { contains: q, mode: "insensitive" } },
                ],
              },
            ],
          },
          take: 5,
          select: { id: true, firstName: true, lastName: true, matricule: true },
        })
      : [],
    contextHasPermission(ctx, "workers.read")
      ? prisma.worker.findMany({
          where: {
            OR: [
              { firstName: { contains: q, mode: "insensitive" } },
              { lastName: { contains: q, mode: "insensitive" } },
              { matricule: { contains: q, mode: "insensitive" } },
            ],
          },
          take: 5,
          select: { id: true, firstName: true, lastName: true, matricule: true },
        })
      : [],
    contextHasPermission(ctx, "documents.read")
      ? prisma.document.findMany({
          where: {
            AND: [documentScopeWhere(ctx), { name: { contains: q, mode: "insensitive" } }],
          },
          take: 5,
          select: { id: true, name: true },
        })
      : [],
    contextHasPermission(ctx, "sanctions.read")
      ? prisma.sanction.findMany({
          where: {
            AND: [
              relatedEmployeeWhere(ctx),
              {
                OR: [
                  { reason: { contains: q, mode: "insensitive" } },
                  { employee: { lastName: { contains: q, mode: "insensitive" } } },
                ],
              },
            ],
          },
          take: 5,
          include: { employee: true, type: true },
        })
      : [],
    contextHasPermission(ctx, "payroll.read")
      ? prisma.payroll.findMany({
          where: {
            AND: [
              relatedEmployeeWhere(ctx),
              {
                employee: {
                  OR: [
                    { firstName: { contains: q, mode: "insensitive" } },
                    { lastName: { contains: q, mode: "insensitive" } },
                    { matricule: { contains: q, mode: "insensitive" } },
                  ],
                },
              },
            ],
          },
          take: 5,
          include: { employee: true },
        })
      : [],
  ]);

  return { employees, workers, documents, sanctions, payrolls };
}
