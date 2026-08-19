import type { Metadata } from "next";
import { EmployeeSpace } from "@/components/profile/employee-space";
import { MissingEmployeeState } from "@/components/shared/missing-employee";
import { getMyEmployeeProfile } from "@/lib/services/profile.service";

export const metadata: Metadata = {
  title: "Mon espace",
};

export default async function MySpacePage() {
  const { employee } = await getMyEmployeeProfile();
  if (!employee) {
    return <MissingEmployeeState />;
  }
  return <EmployeeSpace employee={employee} showSecurity />;
}
