"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Sheet, SheetContent } from "@/components/ui/sheet";

export function AppShell({
  user,
  notifications,
  unreadCount,
  children,
}: {
  user: { name?: string | null; email?: string | null; role: string };
  notifications: Array<{
    id: string;
    title: string;
    message: string;
    href: string | null;
    readAt: Date | string | null;
    createdAt: Date | string;
  }>;
  unreadCount: number;
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden lg:block">
        <div className="sticky top-0 h-screen">
          <Sidebar role={user.role} user={user} />
        </div>
      </div>
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-56 border-sidebar-border bg-sidebar p-0 text-sidebar-foreground" showCloseButton={false}>
          <Sidebar
            role={user.role}
            user={user}
            onNavigate={() => setMobileOpen(false)}
          />
        </SheetContent>
      </Sheet>
      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          user={user}
          notifications={notifications}
          unreadCount={unreadCount}
          onMenuClick={() => setMobileOpen(true)}
        />
        <main className="flex-1 p-3 md:p-5">{children}</main>
      </div>
    </div>
  );
}
