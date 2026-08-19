"use server";

import { redirect } from "next/navigation";
import { createLeaveRequest, decideLeaveRequest } from "@/lib/services/hr-modules.service";
import { leaveRequestSchema } from "@/lib/validations/hr";
import { toUserMessage } from "@/lib/errors";

export async function createLeaveAction(_prev: { error?: string } | undefined, formData: FormData) {
  try {
    await createLeaveRequest(
      leaveRequestSchema.parse({
        kind: formData.get("kind"),
        startDate: formData.get("startDate"),
        endDate: formData.get("endDate"),
        reason: formData.get("reason") || "",
      }),
    );
    redirect("/leaves/mine");
  } catch (error) {
    if (typeof error === "object" && error && "digest" in error) throw error;
    return { error: toUserMessage(error) };
  }
}

export async function decideLeaveAction(id: string, status: "APPROVED" | "REJECTED") {
  await decideLeaveRequest(id, status);
}
