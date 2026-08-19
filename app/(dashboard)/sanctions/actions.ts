"use server";

import { redirect } from "next/navigation";
import { createSanction, deleteSanction } from "@/lib/services/sanction.service";
import { sanctionSchema } from "@/lib/validations/hr";
import { toUserMessage } from "@/lib/errors";

export async function createSanctionAction(formData: FormData) {
  try {
    await createSanction(
      sanctionSchema.parse({
        employeeId: formData.get("employeeId"),
        typeId: formData.get("typeId"),
        reason: formData.get("reason"),
        description: formData.get("description") || "",
        date: formData.get("date"),
        durationDays: formData.get("durationDays") || 0,
        comment: formData.get("comment") || "",
        status: formData.get("status") || "PENDING",
      }),
    );
    redirect("/sanctions");
  } catch (error) {
    if (typeof error === "object" && error && "digest" in error) throw error;
    return { error: toUserMessage(error) };
  }
}

export async function deleteSanctionAction(id: string) {
  await deleteSanction(id);
}
