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
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  function toggleCollapsed() {
    setCollapsed((current) => {
      const next = !current;
      window.localStorage.setItem("camer-sirh-sidebar", next ? "collapsed" : "expanded");
      return next;
    });
  }

  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden lg:block">
        <div className="sticky top-0 h-screen">
          <Sidebar role={user.role} user={user} collapsed={collapsed} onToggle={toggleCollapsed} />
        </div>
      </div>
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 border-sidebar-border bg-sidebar p-0 text-sidebar-foreground" showCloseButton={false}>
          <Sidebar
            role={user.role}
            user={user}
            collapsed={false}
            onToggle={() => setMobileOpen(false)}
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
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
