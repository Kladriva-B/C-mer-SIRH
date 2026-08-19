import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { PAGE_SIZE } from "@/lib/constants/labels";
import { requirePermission } from "@/lib/auth/guards";
import { assertEmployeeInScope, documentScopeWhere, mergeWhere } from "@/lib/auth/access";
import { AppError } from "@/lib/errors";
import { writeAuditLog } from "@/lib/services/audit.service";
import { assertValidUpload, getStorage } from "@/lib/storage";
import { nextDocumentReference } from "@/lib/services/verification.service";

export type DocumentListParams = {
  query?: string;
  typeId?: string;
  page?: number;
};

export async function listDocuments(params: DocumentListParams) {
  const ctx = await requirePermission("documents.read");
  const page = Math.max(1, params.page ?? 1);
  const where = mergeWhere(documentScopeWhere(ctx), {
    ...(params.typeId ? { typeId: params.typeId } : {}),
    ...(params.query
      ? {
          OR: [
            { name: { contains: params.query, mode: "insensitive" } },
            { employee: { firstName: { contains: params.query, mode: "insensitive" } } },
            { employee: { lastName: { contains: params.query, mode: "insensitive" } } },
          ],
        }
      : {}),
  });

  const [items, total] = await Promise.all([
    prisma.document.findMany({
      where,
      include: {
        type: true,
        employee: true,
        worker: true,
        uploader: true,
        verification: true,
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.document.count({ where }),
  ]);

  return { items, total, page, pageSize: PAGE_SIZE };
}

export async function getDocumentTypes() {
  await requirePermission("documents.read");
  return prisma.documentType.findMany({ orderBy: { name: "asc" } });
}

export async function uploadDocument(formData: FormData) {
  const user = await requirePermission("documents.write");
  const file = formData.get("file");
  const name = String(formData.get("name") ?? "");
  const typeId = String(formData.get("typeId") ?? "");
  const employeeId = String(formData.get("employeeId") ?? "") || null;
  const workerId = String(formData.get("workerId") ?? "") || null;
  if (employeeId) {
    await assertEmployeeInScope(user, employeeId);
  }

  if (!(file instanceof File) || file.size === 0) {
    throw new AppError("Veuillez sélectionner un fichier.", "VALIDATION");
  }
  if (!name || !typeId) {
    throw new AppError("Le nom et le type du document sont requis.", "VALIDATION");
  }

  assertValidUpload(file);
  const stored = await getStorage().put(file, "documents");
  const document = await prisma.document.create({
    data: {
      name,
      typeId,
      employeeId,
      workerId,
      uploaderId: user.id,
      storageKey: stored.key,
      mimeType: stored.mimeType,
      sizeBytes: stored.size,
      status: "ACTIVE",
    },
  });

  const reference = await nextDocumentReference();
  await prisma.verification.create({
    data: {
      reference,
      documentId: document.id,
      employeeId,
      status: "VALID",
    },
  });

  await writeAuditLog({
    userId: user.id,
    action: "UPLOAD_DOCUMENT",
    resource: "Document",
    resourceId: document.id,
  });

  revalidatePath("/documents");
  return document;
}

export async function deleteDocument(id: string) {
  const user = await requirePermission("documents.delete");
  const document = await prisma.document.findUnique({ where: { id } });
  if (!document) throw new AppError("Document introuvable.", "NOT_FOUND");
  await getStorage().delete(document.storageKey);
  await prisma.document.delete({ where: { id } });
  await writeAuditLog({
    userId: user.id,
    action: "DELETE_DOCUMENT",
    resource: "Document",
    resourceId: id,
  });
  revalidatePath("/documents");
}
