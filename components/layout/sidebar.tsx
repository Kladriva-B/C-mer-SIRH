"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import {
  LayoutDashboard,
  UserRound,
  Users,
  FileSignature,
  Building2,
  CalendarDays,
  Files,
  ShieldAlert,
  Gauge,
  Wallet,
  HardHat,
  BarChart3,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn, getInitials } from "@/lib/utils";
import { signOut } from "next-auth/react";
import { hasPermission, type PermissionKey } from "@/lib/permissions";
import { ROLE_LABELS } from "@/lib/constants/labels";

type NavChild = { href: string; label: string; permission: PermissionKey | null };
type NavItem = {
  href?: string;
  label: string;
  icon: typeof LayoutDashboard;
  permission: PermissionKey | null;
  children?: NavChild[];
};

const NAV: NavItem[] = [
  { href: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard, permission: "dashboard.read" },
  { href: "/me", label: "Mon espace", icon: UserRound, permission: null },
  { href: "/employees", label: "Employés", icon: Users, permission: "employees.read" },
  { href: "/contracts", label: "Contrats", icon: FileSignature, permission: "contracts.read" },
  {
    label: "Organisation",
    icon: Building2,
    permission: "organization.read",
    children: [
      { href: "/organization/companies", label: "Entreprises", permission: "organization.read" },
      { href: "/organization/departments", label: "Départements", permission: "organization.read" },
      { href: "/organization/positions", label: "Postes", permission: "organization.read" },
    ],
  },
  {
    label: "Congés & Absences",
    icon: CalendarDays,
    permission: "leaves.read",
    children: [
      { href: "/leaves/mine", label: "Mes demandes", permission: "leaves.read" },
      { href: "/leaves/new", label: "Nouvelle demande", permission: "leaves.write" },
      { href: "/leaves", label: "Gestion des demandes", permission: "employees.read" },
    ],
  },
  {
    label: "Documents",
    icon: Files,
    permission: "documents.read",
    children: [
      { href: "/documents", label: "Tous les documents", permission: "documents.read" },
      { href: "/documents/certificates", label: "Certificat de travail", permission: "employees.write" },
    ],
  },
  {
    label: "Discipline",
    icon: ShieldAlert,
    permission: "sanctions.read",
    children: [
      { href: "/sanctions", label: "Toutes les sanctions", permission: "sanctions.write" },
      { href: "/sanctions/mine", label: "Mes sanctions", permission: "sanctions.read" },
      { href: "/sanctions/new", label: "Nouvelle sanction", permission: "sanctions.write" },
    ],
  },
  {
    label: "Performance",
    icon: Gauge,
    permission: "performance.read",
    children: [
      { href: "/performance", label: "Tableau de bord", permission: "performance.read" },
      { href: "/performance/evaluations", label: "Évaluations", permission: "performance.read" },
      { href: "/performance/ranking", label: "Classement", permission: "performance.read" },
    ],
  },
  { href: "/payroll", label: "Paie", icon: Wallet, permission: "payroll.read" },
  { href: "/workers", label: "Ouvriers", icon: HardHat, permission: "workers.read" },
  { href: "/reports", label: "Rapports", icon: BarChart3, permission: "reports.read" },
  {
    label: "Admin",
    icon: Settings,
    permission: "settings.read",
    children: [
      { href: "/settings", label: "Paramètres", permission: "settings.read" },
      { href: "/settings/permissions", label: "Permissions", permission: "roles.manage" },
    ],
  },
];

function allowed(role: string, permission: PermissionKey | null) {
  return permission === null || hasPermission(role, permission);
}

export function Sidebar({
  role,
  user,
  onNavigate,
}: {
  role: string;
  user: { name?: string | null; email?: string | null };
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const items = useMemo(
    () =>
      NAV.filter((item) => allowed(role, item.permission)).map((item) => ({
        ...item,
        children: item.children?.filter((child) => allowed(role, child.permission)),
      })),
    [role],
  );
  const activeGroup = items.find((item) =>
    item.children?.some((child) => pathname === child.href || pathname.startsWith(`${child.href}/`)),
  )?.label;
  const [openGroup, setOpenGroup] = useState<string | null>(activeGroup ?? null);

  return (
    <aside className="flex h-full w-56 flex-col bg-sidebar text-sidebar-foreground">
      <nav
        className="flex min-h-0 flex-1 flex-col justify-evenly overflow-hidden px-2 py-3"
        aria-label="Navigation principale"
      >
        {items.map((item) =>
          item.children?.length ? (
            <NavGroup
              key={item.label}
              item={item}
              pathname={pathname}
              open={openGroup === item.label}
              onToggle={() => setOpenGroup((current) => (current === item.label ? null : item.label))}
              onNavigate={onNavigate}
            />
          ) : (
            <NavLink
              key={item.href}
              href={item.href!}
              label={item.label}
              icon={item.icon}
              active={pathname === item.href || pathname.startsWith(`${item.href}/`)}
              onNavigate={onNavigate}
            />
          ),
        )}
      </nav>
      <div className="shrink-0 space-y-1.5 border-t border-white/10 p-2.5">
        <div className="flex items-center gap-2 rounded-xl bg-white/10 p-1.5">
          <Avatar size="sm" className="after:hidden">
            <AvatarFallback className="bg-primary text-[10px] font-semibold text-primary-foreground">
              {getInitials(user.name ?? "U")}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-white">{user.name}</p>
            <p className="truncate text-[10px] font-semibold tracking-wide text-white/55 uppercase">
              {ROLE_LABELS[role as keyof typeof ROLE_LABELS] ?? role}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1 text-[13px] text-white/70 hover:bg-white/10 hover:text-white"
        >
          <LogOut className="size-3.5" />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}

function NavGroup({
  item,
  pathname,
  open,
  onToggle,
  onNavigate,
}: {
  item: NavItem;
  pathname: string;
  open: boolean;
  onToggle: () => void;
  onNavigate?: () => void;
}) {
  const childActive = item.children?.some((child) => pathname === child.href || pathname.startsWith(`${child.href}/`));
  const Icon = item.icon;

  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "flex w-full items-center gap-2.5 rounded-lg px-2 py-1 text-[13px] font-medium",
          childActive ? "bg-white/10 text-white" : "text-white/65 hover:bg-white/10 hover:text-white",
        )}
      >
        <Icon className="size-3.5 shrink-0" />
        <span className="flex-1 text-left">{item.label}</span>
        <ChevronDown className={cn("size-3.5 transition-transform", open && "rotate-180")} />
      </button>
      {open ? (
        <div className="ml-3 space-y-px border-l border-white/15 pl-1.5">
          {item.children?.map((child) => {
            const active = pathname === child.href;
            return (
              <Link
                key={child.href}
                href={child.href}
                onClick={onNavigate}
                className={cn(
                  "block rounded-md px-2 py-0.5 text-xs",
                  active
                    ? "bg-sidebar-accent font-medium text-white"
                    : "text-white/60 hover:bg-white/10 hover:text-white",
                )}
              >
                {child.label}
              </Link>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function NavLink({
  href,
  label,
  icon: Icon,
  active,
  onNavigate,
}: {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  active: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-2.5 rounded-lg px-2 py-1 text-[13px] font-medium transition-colors",
        active
          ? "border-l-[3px] border-primary bg-white/15 text-white"
          : "border-l-[3px] border-transparent text-white/65 hover:bg-white/10 hover:text-white",
      )}
      aria-current={active ? "page" : undefined}
    >
      <Icon className="size-3.5 shrink-0" />
      <span>{label}</span>
    </Link>
  );
}
