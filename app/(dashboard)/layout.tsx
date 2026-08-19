import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AppShell } from "@/components/layout/app-shell";
import { getMyNotifications } from "@/lib/services/profile.service";

export const dynamic = "force-dynamic";

export default async function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const { notifications, unreadCount } = await getMyNotifications();

  return (
    <AppShell user={session.user} notifications={notifications} unreadCount={unreadCount}>
      {children}
    </AppShell>
  );
}
