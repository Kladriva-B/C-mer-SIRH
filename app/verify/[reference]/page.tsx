import { CheckCircle2, CircleAlert, CircleX, HelpCircle } from "lucide-react";
import { Logo } from "@/components/logo";
import { getVerificationByReference } from "@/lib/services/verification.service";
import { formatDate } from "@/lib/format/date";
import { VERIFICATION_STATUS_LABELS } from "@/lib/constants/labels";

export const dynamic = "force-dynamic";

const ICONS = {
  VALID: CheckCircle2,
  EXPIRED: CircleAlert,
  INVALID: CircleX,
  NOT_FOUND: HelpCircle,
};

const TONES = {
  VALID: "bg-success/10 text-success",
  EXPIRED: "bg-warning/10 text-warning",
  INVALID: "bg-destructive/10 text-destructive",
  NOT_FOUND: "bg-muted text-muted-foreground",
};

export default async function VerifyPage({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  const { reference } = await params;
  const result = await getVerificationByReference(decodeURIComponent(reference));
  const Icon = ICONS[result.status];

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="ui-surface w-full max-w-lg p-8 text-center">
        <div className="mb-6 flex justify-center">
          <Logo withSubtitle />
        </div>
        <p className="text-[11px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
          Vérification de document
        </p>
        <div className={`mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold ${TONES[result.status]}`}>
          <Icon className="size-4" />
          {result.status === "VALID" ? "Document authentique" : VERIFICATION_STATUS_LABELS[result.status]}
        </div>
        <dl className="mt-8 space-y-3 text-left text-sm">
          <Row label="Référence" value={reference} />
          <Row
            label="Document"
            value={result.verification?.payroll ? "Bulletin de paie" : result.verification?.document?.type.name ?? "—"}
          />
          <Row
            label="Employé"
            value={
              result.verification?.employee
                ? `${result.verification.employee.firstName} ${result.verification.employee.lastName}`
                : "—"
            }
          />
          <Row
            label="Émis le"
            value={result.verification ? formatDate(result.verification.issuedAt) : "—"}
          />
          <Row label="Vérifié" value={result.status === "VALID" ? "Oui" : "Non"} />
        </dl>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1.5">
      <dt className="text-sm font-medium">{label}</dt>
      <dd className="ui-well">{value}</dd>
    </div>
  );
}
