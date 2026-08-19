"use client";

import Link from "next/link";
import { useTransition } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatRelative } from "@/lib/format/date";
import { markNotificationsReadAction } from "@/app/(dashboard)/me/actions";

export type HeaderNotification = {
  id: string;
  title: string;
  message: string;
  href: string | null;
  readAt: Date | string | null;
  createdAt: Date | string;
};

export function NotificationBell({
  notifications,
  unreadCount,
}: {
  notifications: HeaderNotification[];
  unreadCount: number;
}) {
  const [, startTransition] = useTransition();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
            <Bell className="size-4" />
            {unreadCount > 0 ? (
              <span className="absolute -top-0.5 -right-0.5 flex min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-white">
                {unreadCount}
              </span>
            ) : null}
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex items-center justify-between">
            Notifications
            {unreadCount > 0 ? (
              <button
                type="button"
                className="text-xs font-normal text-primary"
                onClick={() => startTransition(() => markNotificationsReadAction())}
              >
                Tout lire
              </button>
            ) : null}
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {notifications.length ? (
            notifications.map((item) => (
              <DropdownMenuItem
                key={item.id}
                className="flex-col items-start gap-0.5 whitespace-normal"
                render={item.href ? <Link href={item.href} /> : undefined}
              >
                <span className="text-sm font-medium">{item.title}</span>
                <span className="text-xs text-muted-foreground">{item.message}</span>
                <span className="text-[11px] text-muted-foreground">{formatRelative(item.createdAt)}</span>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="px-2 py-3 text-sm text-muted-foreground">Aucune notification.</div>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
