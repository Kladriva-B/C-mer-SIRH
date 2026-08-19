import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { PAGE_SIZE } from "@/lib/constants/labels";

export type EmployeeListParams = {
  query?: string;
  status?: string;
  departmentId?: string;
  page?: number;
  scopeWhere?: Prisma.EmployeeWhereInput;
};

function buildEmployeeWhere(params: EmployeeListParams): Prisma.EmployeeWhereInput {
  const filters: Prisma.EmployeeWhereInput[] = [];
  if (params.scopeWhere && Object.keys(params.scopeWhere).length) {
    filters.push(params.scopeWhere);
  }
  if (params.status) {
    filters.push({ status: params.status as Prisma.EmployeeWhereInput["status"] });
  }
  if (params.departmentId) {
    filters.push({ departmentId: params.departmentId });
  }
  if (params.query) {
    filters.push({
      OR: [
        { firstName: { contains: params.query, mode: "insensitive" } },
        { lastName: { contains: params.query, mode: "insensitive" } },
        { email: { contains: params.query, mode: "insensitive" } },
        { matricule: { contains: params.query, mode: "insensitive" } },
        { phone: { contains: params.query, mode: "insensitive" } },
      ],
    });
  }
  if (filters.length === 0) return {};
  if (filters.length === 1) return filters[0];
  return { AND: filters };
}

export async function listEmployees(params: EmployeeListParams) {
  const page = Math.max(1, params.page ?? 1);
  const where = buildEmployeeWhere(params);

  const [items, total] = await Promise.all([
    prisma.employee.findMany({
      where,
      include: { department: true, position: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.employee.count({ where }),
  ]);

  return { items, total, page, pageSize: PAGE_SIZE };
}

export async function getEmployeeById(id: string) {
  return prisma.employee.findUnique({
    where: { id },
    include: {
      department: true,
      position: true,
      manager: { select: { id: true, firstName: true, lastName: true } },
      user: { include: { role: true } },
      contracts: { orderBy: { startDate: "desc" } },
      sanctions: { include: { type: true, issuer: true }, orderBy: { date: "desc" } },
      payrolls: { orderBy: [{ periodYear: "desc" }, { periodMonth: "desc" }] },
      documents: { include: { type: true, uploader: true }, orderBy: { createdAt: "desc" } },
    },
  });
}

export async function getEmployeeStats(scopeWhere?: Prisma.EmployeeWhereInput) {
  const where = scopeWhere ?? {};
  const [total, active, onLeave, suspended] = await Promise.all([
    prisma.employee.count({ where }),
    prisma.employee.count({ where: { AND: [where, { status: "ACTIVE" }] } }),
    prisma.employee.count({ where: { AND: [where, { status: "ON_LEAVE" }] } }),
    prisma.employee.count({ where: { AND: [where, { status: "SUSPENDED" }] } }),
  ]);

  return { total, active, onLeave, suspended };
}
