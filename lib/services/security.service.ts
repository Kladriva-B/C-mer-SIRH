import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { requireUser } from "@/lib/auth/guards";
import { AppError } from "@/lib/errors";
import { changePasswordSchema } from "@/lib/validations/auth";
import { writeAuditLog } from "@/lib/services/audit.service";

export async function changeMyPassword(input: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}) {
  const sessionUser = await requireUser();
  const data = changePasswordSchema.parse(input);
  const user = await prisma.user.findUnique({ where: { id: sessionUser.id } });
  if (!user) {
    throw new AppError("Utilisateur introuvable.", "NOT_FOUND");
  }

  const valid = await bcrypt.compare(data.currentPassword, user.passwordHash);
  if (!valid) {
    throw new AppError("Le mot de passe actuel est incorrect.", "UNAUTHORIZED");
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: await bcrypt.hash(data.newPassword, 10) },
  });

  await writeAuditLog({
    userId: user.id,
    action: "UPDATE_PASSWORD",
    resource: "User",
    resourceId: user.id,
  });
}

export async function toggleTwoFactor(enabled: boolean) {
  const user = await requireUser();
  await prisma.user.update({
    where: { id: user.id },
    data: { twoFactorEnabled: enabled },
  });
  await writeAuditLog({
    userId: user.id,
    action: "UPDATE_SECURITY",
    resource: "User",
    resourceId: user.id,
    metadata: { twoFactorEnabled: enabled },
  });
  revalidatePath("/me");
}
