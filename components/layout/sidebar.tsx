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
  ChevronsLeft,
  ChevronsRight,
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
  collapsed,
  onToggle,
  onNavigate,
}: {
  role: string;
  user: { name?: string | null; email?: string | null };
  collapsed: boolean;
  onToggle: () => void;
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

  return (
    <aside
      className={cn(
        "flex h-full flex-col bg-sidebar text-sidebar-foreground transition-[width] duration-200",
        collapsed ? "w-[72px]" : "w-64",
      )}
    >
      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-3 pt-4" aria-label="Navigation principale">
        {items.map((item) =>
          item.children?.length ? (
            <NavGroup
              key={item.label}
              item={item}
              collapsed={collapsed}
              pathname={pathname}
              onNavigate={onNavigate}
            />
          ) : (
            <NavLink
              key={item.href}
              href={item.href!}
              label={item.label}
              icon={item.icon}
              collapsed={collapsed}
              active={pathname === item.href || pathname.startsWith(`${item.href}/`)}
              onNavigate={onNavigate}
            />
          ),
        )}
      </nav>
      <div className="space-y-2 border-t border-white/10 p-3">
        <div className={cn("flex items-center gap-2 rounded-xl bg-white/10 p-2", collapsed && "justify-center")}>
          <Avatar size="sm" className="after:hidden">
            <AvatarFallback className="bg-primary text-[10px] font-semibold text-primary-foreground">
              {getInitials(user.name ?? "U")}
            </AvatarFallback>
          </Avatar>
          {!collapsed ? (
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-white">{user.name}</p>
              <p className="truncate text-[10px] font-semibold tracking-wide text-white/55 uppercase">
                {ROLE_LABELS[role as keyof typeof ROLE_LABELS] ?? role}
              </p>
            </div>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white",
            collapsed && "justify-center px-0",
          )}
        >
          <LogOut className="size-4" />
          {!collapsed ? "Déconnexion" : <span className="sr-only">Déconnexion</span>}
        </button>
        <button
          type="button"
          onClick={onToggle}
          className="flex w-full items-center justify-center rounded-lg py-2 text-white/60 hover:bg-white/10 hover:text-white"
          aria-label={collapsed ? "Déplier le menu" : "Réduire le menu"}
        >
          {collapsed ? <ChevronsRight className="size-4" /> : <ChevronsLeft className="size-4" />}
        </button>
      </div>
    </aside>
  );
}

function NavGroup({
  item,
  collapsed,
  pathname,
  onNavigate,
}: {
  item: NavItem;
  collapsed: boolean;
  pathname: string;
  onNavigate?: () => void;
}) {
  const childActive = item.children?.some((child) => pathname === child.href || pathname.startsWith(`${child.href}/`));
  const [open, setOpen] = useState(Boolean(childActive));
  const Icon = item.icon;

  if (collapsed) {
    return (
      <Link
        href={item.children?.[0]?.href ?? "/dashboard"}
        onClick={onNavigate}
        className={cn(
          "flex items-center justify-center rounded-lg py-2",
          childActive ? "bg-sidebar-accent text-white" : "text-white/65 hover:bg-white/10 hover:text-white",
        )}
        title={item.label}
      >
        <Icon className="size-4" />
      </Link>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={cn(
          "flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium",
          childActive ? "bg-white/10 text-white" : "text-white/65 hover:bg-white/10 hover:text-white",
        )}
      >
        <Icon className="size-4 shrink-0" />
        <span className="flex-1 text-left">{item.label}</span>
        <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} />
      </button>
      {open ? (
        <div className="ml-4 space-y-0.5 border-l border-white/15 pl-2">
          {item.children?.map((child) => {
            const active = pathname === child.href;
            return (
              <Link
                key={child.href}
                href={child.href}
                onClick={onNavigate}
                className={cn(
                  "block rounded-lg px-2.5 py-1.5 text-sm",
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
  collapsed,
  active,
  onNavigate,
}: {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  collapsed: boolean;
  active: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors",
        collapsed && "justify-center px-0",
        active
          ? "border-l-[3px] border-primary bg-white/15 text-white"
          : "border-l-[3px] border-transparent text-white/65 hover:bg-white/10 hover:text-white",
      )}
      aria-current={active ? "page" : undefined}
    >
      <Icon className="size-4 shrink-0" />
      {!collapsed ? <span>{label}</span> : <span className="sr-only">{label}</span>}
    </Link>
  );
}
