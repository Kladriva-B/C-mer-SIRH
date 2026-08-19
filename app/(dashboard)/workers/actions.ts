"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createWorker, deleteWorker, updateWorker } from "@/lib/services/worker.service";
import { workerSchema } from "@/lib/validations/hr";
import { toUserMessage } from "@/lib/errors";

function parseWorker(formData: FormData) {
  return workerSchema.parse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email") || "",
    phone: formData.get("phone") || "",
    dateOfBirth: formData.get("dateOfBirth") || "",
    gender: formData.get("gender") || undefined,
    address: formData.get("address") || "",
    matricule: formData.get("matricule"),
    positionId: formData.get("positionId"),
    siteId: formData.get("siteId"),
    assignment: formData.get("assignment") || "",
    contractType: formData.get("contractType"),
    hiredAt: formData.get("hiredAt"),
    dailyRate: formData.get("dailyRate"),
    status: formData.get("status") || "ACTIVE",
  });
}

export async function createWorkerAction(formData: FormData) {
  try {
    const worker = await createWorker(parseWorker(formData));
    redirect(`/workers/${worker.id}`);
  } catch (error) {
    if (typeof error === "object" && error && "digest" in error) throw error;
    return { error: toUserMessage(error) };
  }
}

export async function updateWorkerAction(id: string, formData: FormData) {
  try {
    await updateWorker(id, parseWorker(formData));
    revalidatePath(`/workers/${id}`);
    redirect(`/workers/${id}`);
  } catch (error) {
    if (typeof error === "object" && error && "digest" in error) throw error;
    return { error: toUserMessage(error) };
  }
}

export async function deleteWorkerAction(id: string) {
  await deleteWorker(id);
}
