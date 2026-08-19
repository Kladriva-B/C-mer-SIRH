"use server";

import { revalidatePath } from "next/cache";
import { changeMyPassword, toggleTwoFactor } from "@/lib/services/security.service";
import { markNotificationsRead } from "@/lib/services/profile.service";
import { toUserMessage } from "@/lib/errors";

export async function changePasswordAction(_prev: { error?: string; ok?: boolean } | undefined, formData: FormData) {
  try {
    await changeMyPassword({
      currentPassword: String(formData.get("currentPassword") ?? ""),
      newPassword: String(formData.get("newPassword") ?? ""),
      confirmPassword: String(formData.get("confirmPassword") ?? ""),
    });
    revalidatePath("/me");
    return { ok: true };
  } catch (error) {
    return { error: toUserMessage(error) };
  }
}

export async function toggleTwoFactorAction(enabled: boolean) {
  try {
    await toggleTwoFactor(enabled);
    return { ok: true };
  } catch (error) {
    return { error: toUserMessage(error) };
  }
}

export async function markNotificationsReadAction() {
  await markNotificationsRead();
    revalidatePath("/", "layout");
}
