import type { Metadata } from "next";
import { Key } from "lucide-react";
import { ModuleHero } from "@/components/shared/module-hero";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { requirePermission } from "@/lib/auth/guards";
import { prisma } from "@/lib/db/prisma";
import { ROLE_LABELS, SCOPE_LABELS } from "@/lib/constants/labels";
import {
  MATRIX_ACTIONS,
  MATRIX_RESOURCES,
  PERMISSION_LABELS,
  ROLE_DEFAULT_SCOPE,
  ROLE_DESCRIPTIONS,
  ROLE_PERMISSIONS,
  hasPermission,
  type PermissionKey,
} from "@/lib/permissions";
import type { AccessScope, RoleName } from "@prisma/client";

export const metadata: Metadata = { title: "Rôles et permissions" };

const ROLES: RoleName[] = ["ADMIN", "HR_MANAGER", "HR_AGENT", "MANAGER", "EMPLOYEE"];

function cell(role: RoleName, resource: string, action: string) {
  const key = `${resource}.${action}` as PermissionKey;
  if (!hasPermission(role, key)) {
    return { granted: false, label: "—" };
  }
  const scope = ROLE_DEFAULT_SCOPE[role];
  if (scope === "SELF") return { granted: true, label: "Soi" };
  if (scope === "DIRECT_REPORTS") return { granted: true, label: "Équipe" };
  if (scope === "DEPARTMENT") return { granted: true, label: "Dépt." };
  return { granted: true, label: "Tous" };
}

export default async function UserPermissionsPage() {
  await requirePermission("roles.manage");
  const users = await prisma.user.findMany({
    include: { role: true, employee: { select: { id: true, department: { select: { name: true } } } } },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <ModuleHero
        icon={Key}
        title="Rôles, permissions et périmètres"
        description="Le rôle définit la fonction. La permission définit l'action. Le périmètre limite les données visibles."
      />

      <div className="grid gap-3 md:grid-cols-5">
        {ROLES.map((role) => (
          <Card key={role}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">{ROLE_LABELS[role]}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-muted-foreground">
              <p>{ROLE_DESCRIPTIONS[role]}</p>
              <Badge variant="secondary">{SCOPE_LABELS[ROLE_DEFAULT_SCOPE[role]]}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Matrice RBAC</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-foreground/5 text-xs text-muted-foreground">
                <th className="py-2 pr-3 font-medium">Module</th>
                <th className="py-2 pr-3 font-medium">Action</th>
                {ROLES.map((role) => (
                  <th key={role} className="py-2 pr-3 font-medium">
                    {ROLE_LABELS[role]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MATRIX_RESOURCES.flatMap((resource) =>
                MATRIX_ACTIONS.map((action, index) => {
                  const key = `${resource.resource}.${action.action}` as PermissionKey;
                  const exists = key in PERMISSION_LABELS;
                  if (!exists) return null;
                  return (
                    <tr key={`${resource.resource}-${action.action}`} className="border-b border-foreground/5">
                      <td className="py-2 pr-3 font-medium">
                        {index === 0 ? resource.label : ""}
                      </td>
                      <td className="py-2 pr-3 text-muted-foreground">{action.label}</td>
                      {ROLES.map((role) => {
                        const value = cell(role, resource.resource, action.action);
                        return (
                          <td key={role} className="py-2 pr-3">
                            {value.granted ? (
                              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                                {value.label}
                              </span>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                }),
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Utilisateurs ({users.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {users.map((user) => (
              <div key={user.id} className="ui-row">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
                <p className="mt-1 text-xs">{ROLE_LABELS[user.role.name]}</p>
                <p className="text-[11px] text-muted-foreground">
                  {SCOPE_LABELS[(user.scopeOverride ?? user.role.defaultScope) as AccessScope]}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
        <div className="space-y-4">
          {ROLES.map((role) => {
            const keys = ROLE_PERMISSIONS[role] ?? [];
            return (
              <Card key={role}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between gap-2">
                    <span>{ROLE_LABELS[role]}</span>
                    <Badge variant="secondary">{keys.length} permissions</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-1 sm:grid-cols-2">
                    {keys.map((key) => (
                      <p key={key} className="ui-row !p-2">
                        <span className="font-mono text-[11px] text-muted-foreground">{key}</span>
                        <span className="mt-0.5 block">{PERMISSION_LABELS[key]}</span>
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
