import type { Metadata } from "next";
import Link from "next/link";
import {
  BadgeCheck,
  Files,
  HardHat,
  QrCode,
  ShieldAlert,
  Users,
  Wallet,
} from "lucide-react";
import { LandingHeader } from "@/components/landing/header";
import { LandingFooter } from "@/components/landing/footer";
import { LandingVerifyForm } from "@/components/landing/verify-form";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants/labels";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Gestion RH professionnelle",
  description:
    "Camer SIRH centralise employés, ouvriers, sanctions, paie et documents, avec vérification par QR code.",
};

const modules = [
  {
    icon: Users,
    title: "Employés",
    text: "Dossiers complets, contrats, historique et profils consultables en un clic.",
    tone: "bg-primary/10 text-primary",
  },
  {
    icon: HardHat,
    title: "Ouvriers",
    text: "Affectations, sites et statuts pour le personnel de terrain.",
    tone: "bg-warning/10 text-warning",
  },
  {
    icon: ShieldAlert,
    title: "Sanctions",
    text: "Suivi disciplinaire clair, du motif jusqu’à la clôture.",
    tone: "bg-destructive/10 text-destructive",
  },
  {
    icon: Wallet,
    title: "Paie",
    text: "Bulletins générés, masse salariale et montants affichés en FCFA.",
    tone: "bg-success/10 text-success",
  },
  {
    icon: Files,
    title: "Documents",
    text: "Contrats, pièces et justificatifs classés, téléversés et traçables.",
    tone: "bg-info/10 text-info",
  },
  {
    icon: QrCode,
    title: "Vérification QR",
    text: "Chaque document porte une référence unique authentifiable publiquement.",
    tone: "bg-brand-secondary/10 text-brand-secondary",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <LandingHeader />
      <main>
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-32 left-1/2 size-[36rem] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
            <div className="absolute top-40 -left-24 size-80 rounded-full bg-brand-secondary/15 blur-3xl" />
            <div className="absolute right-0 bottom-0 size-96 rounded-full bg-info/10 blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-6xl px-4 pt-16 pb-20 sm:px-6 sm:pt-24">
            <p className="mb-4 inline-flex items-center rounded-full bg-secondary px-3 py-1 text-xs font-semibold tracking-wide text-secondary-foreground">
              Plateforme RH conçue pour le Cameroun
            </p>
            <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
              La gestion RH, claire,{" "}
              <span className="bg-gradient-to-r from-primary via-brand-secondary to-info bg-clip-text text-transparent">
                maîtrisée et vérifiable.
              </span>
            </h1>
            <p className="mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
              {APP_NAME} rassemble employés, ouvriers, sanctions, paie et documents dans une console unique.
              Chaque bulletin porte un QR code d&apos;authenticité.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" className="h-11 px-6" render={<Link href="/login" />}>
                Se connecter
              </Button>
              <Button size="lg" variant="outline" className="h-11 px-6" render={<Link href="#modules" />}>
                Découvrir les modules
              </Button>
            </div>
          </div>
        </section>

        <section className="bg-secondary/60">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-4 py-10 sm:grid-cols-3 sm:px-6">
            {[
              ["FCFA", "Montants affichés proprement"],
              ["2Othentificator", "Documents authentifiables"],
              ["Audit", "Chaque action importante est tracée"],
            ].map(([title, text]) => (
              <div key={title} className="ui-surface p-4">
                <p className="text-lg font-semibold">{title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="modules" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-primary">Une identité, un outil</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">Tout le cycle administratif, sans dispersion.</h2>
            <p className="mt-3 text-muted-foreground">
              L&apos;interface reprend la densité d&apos;un SIRH professionnel, avec l&apos;indigo et le violet Camer SIRH.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {modules.map((module) => (
              <article key={module.title} className="ui-surface p-5 transition-transform hover:-translate-y-0.5">
                <span className={cn("flex size-10 items-center justify-center rounded-xl", module.tone)}>
                  <module.icon className="size-5" />
                </span>
                <h3 className="mt-4 text-base font-semibold">{module.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{module.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="paie" className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-20 sm:px-6 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold text-brand-secondary">Bulletins de paie</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">Un bulletin lisible, imprimable, vérifiable.</h2>
            <p className="mt-3 text-muted-foreground">
              Brut, retenues, net à payer en FCFA. Génération, consultation et QR de contrôle pour chaque période.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              {["Référence unique DOC-AAAA-XXXXXX", "Impression professionnelle", "Traçabilité des régénérations"].map(
                (item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="flex size-6 items-center justify-center rounded-lg bg-success/10 text-success">
                      <BadgeCheck className="size-4" />
                    </span>
                    {item}
                  </li>
                ),
              )}
            </ul>
          </div>
          <div id="verification" className="ui-surface p-8">
            <p className="text-[11px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
              Vérification publique
            </p>
            <p className="mt-4 text-2xl font-bold">Contrôlez un document</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Saisissez la référence inscrite sur le bulletin ou le QR code. La page confirme l&apos;authenticité sans connexion.
            </p>
            <LandingVerifyForm />
          </div>
        </section>

        <section className="px-4 pb-24 sm:px-6">
          <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-primary-dark to-brand-secondary px-6 py-14 text-center text-white sm:px-12">
            <h2 className="text-3xl font-bold tracking-tight">Prêt à piloter votre administration RH ?</h2>
            <p className="mx-auto mt-3 max-w-xl text-white/85">
              Accédez à l&apos;espace sécurisé pour piloter employés, paie et documents.
            </p>
            <Button className="mt-8 h-11 bg-white px-6 text-primary hover:bg-white/90" render={<Link href="/login" />}>
              Entrer dans Camer SIRH
            </Button>
          </div>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
}
