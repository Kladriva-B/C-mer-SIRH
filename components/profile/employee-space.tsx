import Link from "next/link";
import {
  BadgeCheck,
  Briefcase,
  Building2,
  CalendarDays,
  Clock,
  Download,
  Eye,
  FileText,
  Hash,
  IdCard,
  Mail,
  Pencil,
  Shield,
  UserRound,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  CONTRACT_STATUS_LABELS,
  CONTRACT_TYPE_LABELS,
  EMPLOYEE_STATUS_LABELS,
  ROLE_LABELS,
} from "@/lib/constants/labels";
import { formatDate, formatSeniority } from "@/lib/format/date";
import { formatFcfa } from "@/lib/format/money";
import { getInitials } from "@/lib/utils";
import { SecurityPanel } from "@/components/profile/security-panel";
import type { ContractStatus, ContractType, EmployeeStatus, Gender, RoleName } from "@prisma/client";

type ProfileDocument = {
  id: string;
  name: string;
  storageKey: string;
  createdAt: Date;
  type: { name: string };
  uploader: { email: string } | null;
};

type ProfileContract = {
  id: string;
  type: ContractType;
  status: ContractStatus;
  startDate: Date;
  endDate: Date | null;
  salaryAmount: number | null;
  netAmount: number | null;
  hourlyRate: number | null;
  weeklyHours: number | null;
};

export type EmployeeSpaceData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  dateOfBirth: Date | null;
  gender: Gender | null;
  address: string | null;
  matricule: string;
  cnps: string | null;
  hiredAt: Date;
  salaryAmount: number;
  status: EmployeeStatus;
  contractType: ContractType;
  department: { name: string };
  position: { name: string };
  user: {
    email: string;
    emailVerifiedAt: Date | null;
    twoFactorEnabled: boolean;
    role: { name: RoleName };
  } | null;
  documents: ProfileDocument[];
  contracts: ProfileContract[];
};

const GENDER_SHORT: Record<Gender, string> = {
  MALE: "M",
  FEMALE: "F",
  OTHER: "Autre",
};

export function EmployeeSpace({
  employee,
  showSecurity,
  editableHref,
  canViewCompensation = true,
}: {
  employee: EmployeeSpaceData;
  showSecurity?: boolean;
  editableHref?: string;
  canViewCompensation?: boolean;
}) {
  const fullName = `${employee.firstName} ${employee.lastName}`;
  const roleLabel = employee.user ? ROLE_LABELS[employee.user.role.name] : "Utilisateur";
  const accountLabel = showSecurity ? "Utilisateur" : roleLabel;

  return (
    <div className="space-y-5">
      <section className="rounded-3xl bg-surface p-6 shadow-sm ring-1 ring-foreground/5 md:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <div className="flex shrink-0 flex-col items-center gap-2">
            <Avatar className="size-24 after:hidden">
              <AvatarFallback className="bg-primary text-2xl font-semibold text-primary-foreground">
                {getInitials(fullName)}
              </AvatarFallback>
            </Avatar>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-0.5 text-xs font-semibold text-success">
              <span className="size-1.5 rounded-full bg-success" />
              {EMPLOYEE_STATUS_LABELS[employee.status]}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight">{fullName}</h1>
              <Badge variant="secondary" className="h-6 rounded-full px-2.5 text-[11px] font-medium">
                {accountLabel}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{employee.position.name}</p>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
              <Mail className="size-3.5" />
              {employee.email}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <MetaChip icon={IdCard} label={employee.matricule} />
              <MetaChip icon={FileText} label={CONTRACT_TYPE_LABELS[employee.contractType]} />
              <MetaChip icon={Clock} label={formatSeniority(employee.hiredAt)} />
              <MetaChip icon={Building2} label={employee.department.name} />
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { icon: Hash, label: "Matricule", value: employee.matricule },
          { icon: Briefcase, label: "Poste", value: employee.position.name },
          { icon: CalendarDays, label: "Embauche", value: formatDate(employee.hiredAt) },
          { icon: BadgeCheck, label: "CNPS", value: canViewCompensation ? (employee.cnps ?? "—") : "Confidentiel" },
        ].map((item) => (
          <article
            key={item.label}
            className="flex items-start gap-3 rounded-2xl bg-surface p-4 shadow-sm ring-1 ring-foreground/5"
          >
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <item.icon className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                {item.label}
              </p>
              <p className="mt-1 truncate text-base font-semibold">{item.value}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="overflow-hidden rounded-3xl bg-surface shadow-sm ring-1 ring-foreground/5">
        <Tabs defaultValue="personal">
          <TabsList
            variant="line"
            className="h-auto w-full justify-start gap-1 rounded-none border-b border-border bg-transparent px-4 pt-2 sm:gap-4 sm:px-6"
          >
            <TabsTrigger value="personal" className="h-11 flex-none gap-2 px-3">
              <UserRound className="size-4" />
              Personnel
            </TabsTrigger>
            <TabsTrigger value="professional" className="h-11 flex-none gap-2 px-3">
              <Briefcase className="size-4" />
              Professionnel
            </TabsTrigger>
            <TabsTrigger value="documents" className="h-11 flex-none gap-2 px-3">
              <FileText className="size-4" />
              Documents
            </TabsTrigger>
            {showSecurity ? (
              <TabsTrigger value="security" className="h-11 flex-none gap-2 px-3">
                <Shield className="size-4" />
                Sécurité
              </TabsTrigger>
            ) : null}
          </TabsList>

          <TabsContent value="personal" className="p-5 md:p-6">
            <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">Informations personnelles</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Identité civile et coordonnées de contact du collaborateur.
                </p>
              </div>
              {editableHref ? (
                <Button className="h-9 gap-2 px-4" render={<Link href={editableHref} />}>
                  <Pencil className="size-3.5" />
                  Modifier
                </Button>
              ) : null}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <SoftField label="Nom complet" value={fullName} />
              <SoftField label="Genre" value={employee.gender ? GENDER_SHORT[employee.gender] : "—"} />
              <SoftField
                label="Date de naissance"
                value={employee.dateOfBirth ? formatDate(employee.dateOfBirth) : "—"}
              />
              <SoftField label="Téléphone" value={employee.phone ?? "—"} />
              <div className="sm:col-span-2">
                <SoftField label="Adresse de résidence" value={employee.address ?? "—"} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="professional" className="space-y-5 p-5 md:p-6">
            <div>
              <h2 className="text-lg font-semibold">Structure professionnelle</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Affectation, ancienneté et identifiants internes.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {[
                ["Matricule interne", employee.matricule],
                ["Matricule CNPS", canViewCompensation ? (employee.cnps ?? "—") : "Confidentiel"],
                ["Poste actuel", employee.position.name],
                ["Département", employee.department.name],
                ["Date d'embauche", formatDate(employee.hiredAt)],
                ["Ancienneté", formatSeniority(employee.hiredAt)],
              ].map(([label, value]) => (
                <SoftField key={label} label={label} value={value} />
              ))}
            </div>
            <div>
              <h3 className="mb-3 text-base font-semibold">Historique des contrats</h3>
              {employee.contracts.length ? (
                <div className="space-y-3">
                  {employee.contracts.map((contract) => (
                    <div key={contract.id} className="rounded-2xl border-l-4 border-l-primary bg-muted/60 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-medium">{CONTRACT_TYPE_LABELS[contract.type]}</p>
                        <StatusBadge
                          value={contract.status}
                          label={CONTRACT_STATUS_LABELS[contract.status]}
                        />
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {formatDate(contract.startDate)}
                        {contract.endDate ? ` → ${formatDate(contract.endDate)}` : " → en cours"}
                      </p>
                      {canViewCompensation ? (
                        <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2 xl:grid-cols-4">
                          <p>Salaire brut : {formatFcfa(contract.salaryAmount ?? employee.salaryAmount)}</p>
                          <p>Salaire net : {formatFcfa(contract.netAmount ?? 0)}</p>
                          <p>Taux horaire : {formatFcfa(contract.hourlyRate ?? 0)}</p>
                          <p>Heures / semaine : {contract.weeklyHours ?? 40}</p>
                        </div>
                      ) : (
                        <p className="mt-3 text-sm text-muted-foreground">
                          Rémunération masquée — hors de votre périmètre.
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Aucun contrat enregistré.</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="documents" className="p-5 md:p-6">
            <div className="mb-5">
              <h2 className="text-lg font-semibold">Documents personnels</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {employee.documents.length} document(s) rattaché(s) au dossier.
              </p>
            </div>
            {employee.documents.length ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {employee.documents.map((document) => (
                  <article key={document.id} className="rounded-2xl bg-muted/60 p-4">
                    <p className="font-medium">{document.type.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{document.name}</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {formatDate(document.createdAt)}
                      {document.uploader ? ` · ${document.uploader.email}` : ""}
                    </p>
                    <div className="mt-4 flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        render={<a href={`/api/files/${document.storageKey}`} target="_blank" rel="noreferrer" />}
                      >
                        <Eye className="size-3.5" />
                        Voir
                      </Button>
                      <Button size="sm" render={<a href={`/api/files/${document.storageKey}`} download />}>
                        <Download className="size-3.5" />
                        Télécharger
                      </Button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Aucun document.</p>
            )}
          </TabsContent>

          {showSecurity && employee.user ? (
            <TabsContent value="security" className="p-5 md:p-6">
              <SecurityPanel
                email={employee.user.email}
                verified={Boolean(employee.user.emailVerifiedAt)}
                twoFactorEnabled={employee.user.twoFactorEnabled}
                roleLabel={roleLabel}
              />
            </TabsContent>
          ) : null}
        </Tabs>
      </section>
    </div>
  );
}

function MetaChip({ icon: Icon, label }: { icon: typeof Hash; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground">
      <Icon className="size-3.5 text-primary" />
      {label}
    </span>
  );
}

function SoftField({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1.5">
      <p className="text-sm font-medium">{label}</p>
      <div className="rounded-xl bg-muted/80 px-4 py-3 text-sm font-medium">{value}</div>
    </div>
  );
}
