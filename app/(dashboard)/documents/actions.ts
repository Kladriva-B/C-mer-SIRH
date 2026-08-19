"use server";

import { deleteDocument, uploadDocument } from "@/lib/services/document.service";
import { toUserMessage } from "@/lib/errors";
import { revalidatePath } from "next/cache";

export async function uploadDocumentAction(formData: FormData) {
  try {
    await uploadDocument(formData);
    revalidatePath("/documents");
    return { ok: true };
  } catch (error) {
    return { error: toUserMessage(error) };
  }
}

export async function deleteDocumentAction(id: string) {
  await deleteDocument(id);
}
