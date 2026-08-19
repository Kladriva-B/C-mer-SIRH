import { Settings } from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import { requirePermission } from "@/lib/auth/guards";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTime } from "@/lib/format/date";
import { ROLE_LABELS } from "@/lib/constants/labels";

export default async function SettingsPage() {
  const user = await requirePermission("settings.read");
  const [organization, logs, users] = await Promise.all([
    prisma.organization.findFirst(),
    prisma.auditLog.findMany({
      take: 20,
      orderBy: { createdAt: "desc" },
      include: { user: true },
    }),
    prisma.user.findMany({ include: { role: true }, orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader icon={Settings} title="Paramètres" description="Organisation, utilisateurs et journal d'audit." />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Organisation</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {[
              ["Raison sociale", organization?.name ?? "—"],
              ["Nom légal", organization?.legalName ?? "—"],
              ["Adresse", organization?.address ?? "—"],
              ["Ville", `${organization?.city ?? "—"}, ${organization?.country ?? "—"}`],
              ["E-mail", organization?.email ?? "—"],
              ["Téléphone", organization?.phone ?? "—"],
            ].map(([label, value]) => (
              <div key={label} className="space-y-1.5">
                <p className="text-sm font-medium">{label}</p>
                <p className="ui-well">{value}</p>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Votre profil</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {[
              ["Nom", user.name],
              ["E-mail", user.email],
              ["Rôle", ROLE_LABELS[user.role]],
            ].map(([label, value]) => (
              <div key={label} className="space-y-1.5">
                <p className="text-sm font-medium">{label}</p>
                <p className="ui-well">{value}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Utilisateurs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {users.map((item) => (
            <div key={item.id} className="ui-row flex items-center justify-between text-sm">
              <span>{item.name} · {item.email}</span>
              <span className="text-muted-foreground">{ROLE_LABELS[item.role.name]}</span>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Journal d&apos;audit</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {logs.map((log) => (
            <div key={log.id} className="ui-row text-sm">
              <div className="font-medium">{log.action.replaceAll("_", " ")}</div>
              <div className="text-muted-foreground">
                {log.user?.name ?? "Système"} · {log.resource} · {formatDateTime(log.createdAt)}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
