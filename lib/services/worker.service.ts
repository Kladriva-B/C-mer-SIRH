import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { PAGE_SIZE } from "@/lib/constants/labels";
import { requirePermission } from "@/lib/auth/guards";
import { AppError } from "@/lib/errors";
import { writeAuditLog } from "@/lib/services/audit.service";
import { workerSchema, type WorkerInput } from "@/lib/validations/hr";
import { revalidatePath } from "next/cache";

export type WorkerListParams = {
  query?: string;
  status?: string;
  siteId?: string;
  page?: number;
};

function toDate(value?: string) {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export async function listWorkers(params: WorkerListParams) {
  await requirePermission("workers.read");
  const page = Math.max(1, params.page ?? 1);
  const where: Prisma.WorkerWhereInput = {};

  if (params.status) {
    where.status = params.status as Prisma.WorkerWhereInput["status"];
  }
  if (params.siteId) {
    where.siteId = params.siteId;
  }
  if (params.query) {
    where.OR = [
      { firstName: { contains: params.query, mode: "insensitive" } },
      { lastName: { contains: params.query, mode: "insensitive" } },
      { matricule: { contains: params.query, mode: "insensitive" } },
      { assignment: { contains: params.query, mode: "insensitive" } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.worker.findMany({
      where,
      include: { position: true, site: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.worker.count({ where }),
  ]);

  return { items, total, page, pageSize: PAGE_SIZE };
}

export async function getWorkerStats() {
  await requirePermission("workers.read");
  const [total, active, inactive] = await Promise.all([
    prisma.worker.count(),
    prisma.worker.count({ where: { status: "ACTIVE" } }),
    prisma.worker.count({ where: { status: "INACTIVE" } }),
  ]);
  return { total, active, inactive };
}

export async function getWorker(id: string) {
  await requirePermission("workers.read");
  const worker = await prisma.worker.findUnique({
    where: { id },
    include: { position: true, site: true, documents: { include: { type: true } }, contracts: true },
  });
  if (!worker) throw new AppError("Ouvrier introuvable.", "NOT_FOUND");
  return worker;
}

export async function createWorker(input: WorkerInput) {
  const user = await requirePermission("workers.write");
  const data = workerSchema.parse(input);
  const worker = await prisma.worker.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email ? data.email.toLowerCase() : null,
      phone: data.phone || null,
      dateOfBirth: toDate(data.dateOfBirth),
      gender: data.gender,
      address: data.address || null,
      matricule: data.matricule,
      positionId: data.positionId,
      siteId: data.siteId,
      assignment: data.assignment || null,
      contractType: data.contractType,
      hiredAt: toDate(data.hiredAt) ?? new Date(),
      dailyRate: data.dailyRate,
      status: data.status,
    },
  });
  await writeAuditLog({
    userId: user.id,
    action: "CREATE_WORKER",
    resource: "Worker",
    resourceId: worker.id,
  });
  revalidatePath("/workers");
  return worker;
}

export async function updateWorker(id: string, input: WorkerInput) {
  const user = await requirePermission("workers.write");
  const data = workerSchema.parse(input);
  const worker = await prisma.worker.update({
    where: { id },
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email ? data.email.toLowerCase() : null,
      phone: data.phone || null,
      dateOfBirth: toDate(data.dateOfBirth),
      gender: data.gender,
      address: data.address || null,
      matricule: data.matricule,
      positionId: data.positionId,
      siteId: data.siteId,
      assignment: data.assignment || null,
      contractType: data.contractType,
      hiredAt: toDate(data.hiredAt) ?? new Date(),
      dailyRate: data.dailyRate,
      status: data.status,
    },
  });
  await writeAuditLog({
    userId: user.id,
    action: "UPDATE_WORKER",
    resource: "Worker",
    resourceId: worker.id,
  });
  revalidatePath("/workers");
  revalidatePath(`/workers/${id}`);
  return worker;
}

export async function deleteWorker(id: string) {
  const user = await requirePermission("workers.delete");
  await prisma.worker.delete({ where: { id } });
  await writeAuditLog({
    userId: user.id,
    action: "DELETE_WORKER",
    resource: "Worker",
    resourceId: id,
  });
  revalidatePath("/workers");
}

export async function getWorkerFormOptions() {
  await requirePermission("workers.read");
  const [sites, positions] = await Promise.all([
    prisma.site.findMany({ orderBy: { name: "asc" } }),
    prisma.position.findMany({ orderBy: { name: "asc" } }),
  ]);
  return { sites, positions };
}
