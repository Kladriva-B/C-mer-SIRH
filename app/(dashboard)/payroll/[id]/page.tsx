import Link from "next/link";
import { notFound } from "next/navigation";
import QRCode from "qrcode";
import { getPayroll } from "@/lib/services/payroll.service";
import { Button } from "@/components/ui/button";
import { PrintButton } from "@/components/shared/print-button";
import { formatFcfa } from "@/lib/format/money";
import { formatDate, formatMonthYear } from "@/lib/format/date";
import { prisma } from "@/lib/db/prisma";

export default async function PayrollDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const payroll = await getPayroll(id).catch(() => null);
  if (!payroll) notFound();
  const organization = await prisma.organization.findFirst();
  const appUrl = process.env.APP_URL ?? "http://localhost:3000";
  const reference = payroll.verification?.reference;
  const qr = reference
    ? await QRCode.toDataURL(`${appUrl}/verify/${reference}`)
    : null;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 print:hidden">
        <Button variant="outline" render={<Link href="/payroll" />}>Retour</Button>
        <PrintButton />
        {reference ? (
          <Button variant="outline" render={<Link href={`/verify/${reference}`} />}>
            Vérifier
          </Button>
        ) : null}
      </div>
      <article className="ui-surface mx-auto max-w-3xl p-8 print:border-0 print:shadow-none">
        <header className="mb-8 flex items-start justify-between gap-4 border-b border-foreground/5 pb-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Entreprise</p>
            <h1 className="text-2xl font-semibold">{organization?.name ?? "Camer SIRH"}</h1>
            <p className="text-sm text-muted-foreground">{organization?.address}</p>
            <p className="text-sm text-muted-foreground">{organization?.city}, {organization?.country}</p>
          </div>
          {qr ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={qr} alt="QR de vérification" width={96} height={96} />
          ) : null}
        </header>
        <section className="mb-6 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Employé</p>
            <p className="font-medium">{payroll.employee.firstName} {payroll.employee.lastName}</p>
            <p className="text-sm text-muted-foreground">{payroll.employee.matricule}</p>
            <p className="text-sm text-muted-foreground">{payroll.employee.position.name} · {payroll.employee.department.name}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Période</p>
            <p className="font-medium capitalize">{formatMonthYear(payroll.periodYear, payroll.periodMonth)}</p>
            <p className="text-sm text-muted-foreground">Émis le {payroll.generatedAt ? formatDate(payroll.generatedAt) : "—"}</p>
            <p className="text-sm text-muted-foreground">Réf. {reference ?? "—"}</p>
          </div>
        </section>
        <section className="mb-6">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide">Rémunération</h2>
          <Rows items={payroll.items.filter((item) => item.kind === "earning")} />
        </section>
        <section className="mb-6">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide">Retenues</h2>
          <Rows items={payroll.items.filter((item) => item.kind === "deduction")} />
        </section>
        <section className="rounded-2xl bg-primary/5 p-4">
          <div className="flex items-center justify-between text-sm">
            <span>Brut</span>
            <strong>{formatFcfa(payroll.grossAmount)}</strong>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm">
            <span>Retenues</span>
            <strong>{formatFcfa(payroll.deductions)}</strong>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-primary/10 pt-3 text-base">
            <span>Net à payer</span>
            <strong className="text-primary">{formatFcfa(payroll.netAmount)}</strong>
          </div>
        </section>
        <footer className="mt-8 text-xs text-muted-foreground">
          Informations complémentaires : bulletin généré par Camer SIRH. La vérification d&apos;authenticité s&apos;effectue via le QR code.
          {payroll.notes ? <p className="mt-2">{payroll.notes}</p> : null}
        </footer>
      </article>
    </div>
  );
}

function Rows({ items }: { items: Array<{ id: string; label: string; amount: number }> }) {
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item.id} className="flex items-center justify-between rounded-xl bg-muted/60 px-3 py-2 text-sm">
          <span>{item.label}</span>
          <span>{formatFcfa(Math.abs(item.amount))}</span>
        </div>
      ))}
    </div>
  );
}
