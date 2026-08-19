"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createEmployee, deleteEmployee, updateEmployee } from "@/lib/services/employee.service";
import { toUserMessage } from "@/lib/errors";
import { employeeSchema } from "@/lib/validations/hr";

function formToEmployee(formData: FormData) {
  return employeeSchema.parse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    phone: formData.get("phone") || "",
    dateOfBirth: formData.get("dateOfBirth") || "",
    gender: formData.get("gender") || undefined,
    address: formData.get("address") || "",
    matricule: formData.get("matricule"),
    departmentId: formData.get("departmentId"),
    positionId: formData.get("positionId"),
    contractType: formData.get("contractType"),
    hiredAt: formData.get("hiredAt"),
    salaryAmount: formData.get("salaryAmount"),
    cnps: formData.get("cnps") || "",
    status: formData.get("status") || "ACTIVE",
  });
}

export async function createEmployeeAction(formData: FormData) {
  try {
    const employee = await createEmployee(formToEmployee(formData));
    redirect(`/employees/${employee.id}`);
  } catch (error) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT") throw error;
    return { error: toUserMessage(error) };
  }
}

export async function updateEmployeeAction(id: string, formData: FormData) {
  try {
    await updateEmployee(id, formToEmployee(formData));
    revalidatePath(`/employees/${id}`);
    redirect(`/employees/${id}`);
  } catch (error) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT") throw error;
    return { error: toUserMessage(error) };
  }
}

export async function deleteEmployeeAction(id: string) {
  await deleteEmployee(id);
}
