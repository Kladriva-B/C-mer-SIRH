import { type AuditAction, Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";

export async function writeAuditLog(input: {
  userId?: string | null;
  action: AuditAction;
  resource: string;
  resourceId?: string | null;
  metadata?: Prisma.InputJsonValue;
}) {
  await prisma.auditLog.create({
    data: {
      userId: input.userId ?? null,
      action: input.action,
      resource: input.resource,
      resourceId: input.resourceId ?? null,
      metadata: input.metadata,
    },
  });
}
