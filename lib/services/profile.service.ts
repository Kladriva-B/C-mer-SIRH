import { prisma } from "@/lib/db/prisma";
import { requireUser } from "@/lib/auth/guards";
import { findEmployeeForUser } from "@/lib/auth/employee";

const PROFILE_INCLUDE = {
  department: true,
  position: true,
  user: { include: { role: true } },
  contracts: { orderBy: { startDate: "desc" as const } },
  documents: { include: { type: true, uploader: true }, orderBy: { createdAt: "desc" as const } },
};

export async function getMyEmployeeProfile() {
  const user = await requireUser();
  const linked = await findEmployeeForUser(user);
  if (!linked) {
    return { user, employee: null };
  }

  const employee = await prisma.employee.findUnique({
    where: { id: linked.id },
    include: PROFILE_INCLUDE,
  });

  return { user, employee };
}

export async function getMyNotifications() {
  const user = await requireUser();
  const notifications = await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 12,
  });
  const unreadCount = notifications.filter((item) => !item.readAt).length;
  return { notifications, unreadCount };
}

export async function markNotificationsRead() {
  const user = await requireUser();
  await prisma.notification.updateMany({
    where: { userId: user.id, readAt: null },
    data: { readAt: new Date() },
  });
}
