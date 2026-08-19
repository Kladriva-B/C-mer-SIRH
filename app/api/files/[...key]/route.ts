import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getStorage } from "@/lib/storage";
import { getAccessContext, assertEmployeeInScope, contextHasPermission, documentScopeWhere } from "@/lib/auth/access";
import { SENSITIVE_DOCUMENT_TYPE_CODES } from "@/lib/permissions";

export async function GET(
  _request: Request,
  context: { params: Promise<{ key: string[] }> },
) {
  const ctx = await getAccessContext();
  if (!ctx) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  if (!contextHasPermission(ctx, "documents.read") && !contextHasPermission(ctx, "payroll.read")) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const { key } = await context.params;
  const storageKey = key.join("/");
  if (!storageKey || storageKey.includes("..")) {
    return NextResponse.json({ error: "Clé invalide" }, { status: 400 });
  }

  const document = await prisma.document.findFirst({
    where: { AND: [documentScopeWhere(ctx), { storageKey }] },
    include: { type: true },
  });

  if (!document) {
    return NextResponse.json({ error: "Fichier introuvable" }, { status: 404 });
  }

  if (document.employeeId) {
    try {
      await assertEmployeeInScope(ctx, document.employeeId);
    } catch {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }
  }

  if (
    ctx.scope === "DIRECT_REPORTS" &&
    (SENSITIVE_DOCUMENT_TYPE_CODES as readonly string[]).includes(document.type.code)
  ) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  try {
    const file = await getStorage().get(storageKey);
    return new NextResponse(Uint8Array.from(file), {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${storageKey.split("/").at(-1)}"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "Fichier introuvable" }, { status: 404 });
  }
}
