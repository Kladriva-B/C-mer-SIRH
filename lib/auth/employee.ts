import { prisma } from "@/lib/db/prisma";

export async function findEmployeeForUser(user: { id: string; email?: string | null }) {
  const linked = await prisma.employee.findUnique({ where: { userId: user.id } });
  if (linked) {
    return linked;
  }
  if (!user.email) {
    return null;
  }
  return prisma.employee.findUnique({
    where: { email: user.email.toLowerCase() },
  });
}
