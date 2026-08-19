import { redirect } from "next/navigation";
import { AppError } from "@/lib/errors";
import { hasPermission, type PermissionKey } from "@/lib/permissions";
import { contextHasPermission, getAccessContext, type AccessContext } from "@/lib/auth/access";

export async function getCurrentUser() {
  const ctx = await getAccessContext();
  return ctx;
}

export async function requireUser(): Promise<AccessContext> {
  const user = await getAccessContext();
  if (!user?.id) {
    redirect("/login");
  }
  return user;
}

export async function requirePermission(permission: PermissionKey): Promise<AccessContext> {
  const user = await requireUser();
  if (!contextHasPermission(user, permission)) {
    throw new AppError(
      "Vous n'avez pas l'autorisation d'effectuer cette action.",
      "FORBIDDEN",
    );
  }
  return user;
}

export function can(role: string, permission: PermissionKey) {
  return hasPermission(role, permission);
}
