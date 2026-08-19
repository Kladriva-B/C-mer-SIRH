"use client";

import Link from "next/link";
import { ChevronDown, Menu, Search } from "lucide-react";
import { ROLE_LABELS } from "@/lib/constants/labels";
import { getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";
import { CommandPalette } from "@/components/shared/command-palette";
import { NotificationBell, type HeaderNotification } from "@/components/layout/notification-bell";
import { Logo } from "@/components/logo";
import { useState } from "react";

export function Header({
  user,
  notifications,
  unreadCount,
  onMenuClick,
}: {
  user: { name?: string | null; email?: string | null; role: string };
  notifications: HeaderNotification[];
  unreadCount: number;
  onMenuClick: () => void;
}) {
  const [open, setOpen] = useState(false);
  const roleLabel = ROLE_LABELS[user.role as keyof typeof ROLE_LABELS] ?? user.role;

  return (
    <header className="flex h-16 items-center gap-3 border-b border-border bg-surface px-4 md:px-6">
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick} aria-label="Ouvrir le menu">
        <Menu className="size-4" />
      </Button>
      <Logo withSubtitle className="min-w-0" />
      <div className="ml-auto flex items-center gap-1 sm:gap-2">
        <Button variant="ghost" size="icon" onClick={() => setOpen(true)} aria-label="Rechercher">
          <Search className="size-4" />
        </Button>
        <NotificationBell notifications={notifications} unreadCount={unreadCount} />
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" className="h-11 gap-2 rounded-xl px-1.5">
                <Avatar className="size-9 after:hidden">
                  <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">
                    {getInitials(user.name ?? "U")}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden text-left lg:block">
                  <span className="block text-sm font-semibold leading-tight">{user.name}</span>
                  <span className="block text-[10px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                    {roleLabel}
                  </span>
                </span>
                <ChevronDown className="hidden size-4 text-muted-foreground lg:block" />
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              {user.name}
              <div className="font-normal text-muted-foreground">{user.email}</div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem render={<Link href="/me" />}>Mon espace</DropdownMenuItem>
            <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/login" })}>Déconnexion</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <CommandPalette open={open} onOpenChange={setOpen} />
    </header>
  );
}
