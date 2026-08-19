"use server";

import { redirect } from "next/navigation";
import { deletePayroll, generatePayroll } from "@/lib/services/payroll.service";
import { payrollSchema } from "@/lib/validations/hr";
import { toUserMessage } from "@/lib/errors";

export async function generatePayrollAction(formData: FormData) {
  try {
    const payroll = await generatePayroll(
      payrollSchema.parse({
        employeeId: formData.get("employeeId"),
        periodYear: formData.get("periodYear"),
        periodMonth: formData.get("periodMonth"),
        grossAmount: formData.get("grossAmount"),
        notes: formData.get("notes") || "",
      }),
    );
    redirect(`/payroll/${payroll.id}`);
  } catch (error) {
    if (typeof error === "object" && error && "digest" in error) throw error;
    return { error: toUserMessage(error) };
  }
}

export async function deletePayrollAction(id: string) {
  await deletePayroll(id);
}
