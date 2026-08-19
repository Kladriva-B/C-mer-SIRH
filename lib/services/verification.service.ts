import { prisma } from "@/lib/db/prisma";

export async function nextDocumentReference() {
  const year = new Date().getFullYear();
  const prefix = `DOC-${year}-`;
  const last = await prisma.verification.findFirst({
    where: { reference: { startsWith: prefix } },
    orderBy: { reference: "desc" },
    select: { reference: true },
  });

  const lastNumber = last ? Number(last.reference.replace(prefix, "")) : 0;
  const next = String(lastNumber + 1).padStart(6, "0");
  return `${prefix}${next}`;
}

export async function getVerificationByReference(reference: string) {
  const verification = await prisma.verification.findUnique({
    where: { reference },
    include: {
      employee: true,
      payroll: true,
      document: { include: { type: true } },
    },
  });

  if (!verification) {
    return { status: "NOT_FOUND" as const, verification: null };
  }

  if (verification.expiresAt && verification.expiresAt < new Date()) {
    return { status: "EXPIRED" as const, verification };
  }

  if (verification.status !== "VALID") {
    return { status: verification.status, verification };
  }

  await prisma.verification.update({
    where: { id: verification.id },
    data: { verifiedAt: new Date() },
  });

  await prisma.auditLog.create({
    data: {
      action: "VERIFY_DOCUMENT",
      resource: "Verification",
      resourceId: verification.id,
      metadata: { reference },
    },
  });

  return { status: "VALID" as const, verification };
}
