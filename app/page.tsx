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
import { DemoAccounts } from "@/components/landing/demo-accounts";
import { LandingVerifyForm } from "@/components/landing/verify-form";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants/labels";

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
  },
  {
    icon: HardHat,
    title: "Ouvriers",
    text: "Affectations, sites et statuts pour le personnel de terrain.",
  },
  {
    icon: ShieldAlert,
    title: "Sanctions",
    text: "Suivi disciplinaire clair, du motif jusqu’à la clôture.",
  },
  {
    icon: Wallet,
    title: "Paie",
    text: "Bulletins générés, masse salariale et montants affichés en FCFA.",
  },
  {
    icon: Files,
    title: "Documents",
    text: "Contrats, pièces et justificatifs classés, téléversés et traçables.",
  },
  {
    icon: QrCode,
    title: "Vérification QR",
    text: "Chaque document porte une référence unique authentifiable publiquement.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#070b16] text-white">
      <LandingHeader />
      <main>
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-32 left-1/2 size-[36rem] -translate-x-1/2 rounded-full bg-primary/30 blur-3xl" />
            <div className="absolute top-40 -left-24 size-80 rounded-full bg-brand-secondary/25 blur-3xl" />
            <div className="absolute right-0 bottom-0 size-96 rounded-full bg-accent/20 blur-3xl" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-size-[72px_72px] mask-[linear-gradient(to_bottom,black,transparent)]" />
          </div>
          <div className="relative mx-auto max-w-6xl px-4 pt-16 pb-20 sm:px-6 sm:pt-24">
            <p className="mb-4 inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium tracking-wide text-white/80">
              Plateforme RH conçue pour le Cameroun
            </p>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">
              La gestion RH, claire,{" "}
              <span className="bg-gradient-to-r from-indigo-200 via-violet-200 to-blue-200 bg-clip-text text-transparent">
                maîtrisée et vérifiable.
              </span>
            </h1>
            <p className="mt-5 max-w-2xl text-base text-white/70 sm:text-lg">
              {APP_NAME} rassemble employés, ouvriers, sanctions, paie et documents dans une console unique.
              Chaque bulletin porte un QR code d&apos;authenticité.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                className="h-11 px-6 bg-white text-primary-dark hover:bg-white/90"
                render={<Link href="/login" />}
              >
                Se connecter
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-11 px-6 border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                render={<Link href="#modules" />}
              >
                Découvrir les modules
              </Button>
            </div>
            <div className="mt-14 max-w-xl rounded-3xl bg-white/[0.06] p-5 ring-1 ring-white/10">
              <p className="text-sm font-medium text-indigo-200">Identifiants de démonstration</p>
              <div className="mt-4">
                <DemoAccounts inverted />
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-white/10 bg-white/[0.03]">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-10 sm:grid-cols-4 sm:px-6">
            {[
              ["3 comptes", "Admin, RH, employé"],
              ["FCFA", "Montants affichés proprement"],
              ["QR code", "Documents authentifiables"],
              ["Audit", "Chaque action importante est tracée"],
            ].map(([title, text]) => (
              <div key={title} className="rounded-2xl bg-white/[0.04] p-4 ring-1 ring-white/10">
                <p className="text-lg font-semibold">{title}</p>
                <p className="mt-1 text-sm text-white/55">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="modules" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-indigo-300">Une identité, un outil</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">Tout le cycle administratif, sans dispersion.</h2>
            <p className="mt-3 text-white/65">
              L&apos;interface reprend la densité d&apos;un SIRH professionnel, avec une identité indigo et violet propre à Camer SIRH.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {modules.map((module) => (
              <article
                key={module.title}
                className="rounded-3xl bg-white/[0.06] p-5 ring-1 ring-white/10 transition-transform hover:-translate-y-0.5"
              >
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary/30 text-indigo-100">
                  <module.icon className="size-5" />
                </span>
                <h3 className="mt-4 text-base font-semibold">{module.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/60">{module.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="paie" className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-20 sm:px-6 lg:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-violet-300">Bulletins de paie</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">Un bulletin lisible, imprimable, vérifiable.</h2>
            <p className="mt-3 text-white/65">
              Brut, retenues, net à payer en FCFA. Génération, consultation et QR de contrôle pour chaque période.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-white/75">
              {["Référence unique DOC-AAAA-XXXXXX", "Impression professionnelle", "Traçabilité des régénérations"].map(
                (item) => (
                  <li key={item} className="flex items-center gap-2">
                    <BadgeCheck className="size-4 text-success" />
                    {item}
                  </li>
                ),
              )}
            </ul>
          </div>
          <div id="verification" className="rounded-3xl bg-gradient-to-br from-primary/40 to-brand-secondary/30 p-8 ring-1 ring-white/10">
            <p className="text-xs uppercase tracking-[0.2em] text-white/60">Vérification publique</p>
            <p className="mt-4 text-2xl font-semibold">Contrôlez un document</p>
            <p className="mt-2 text-sm text-white/65">
              Saisissez la référence inscrite sur le bulletin ou le QR code. La page confirme l&apos;authenticité sans connexion.
            </p>
            <LandingVerifyForm />
          </div>
        </section>

        <section className="px-4 pb-24 sm:px-6">
          <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-primary-dark to-brand-secondary px-6 py-14 text-center sm:px-12">
            <h2 className="text-3xl font-semibold tracking-tight">Prêt à piloter votre administration RH ?</h2>
            <p className="mx-auto mt-3 max-w-xl text-white/80">
              Accédez à l&apos;espace sécurisé avec les identifiants de démonstration ci-dessus.
            </p>
            <Button className="mt-8 h-11 bg-white px-6 text-primary-dark hover:bg-white/90" render={<Link href="/login" />}>
              Entrer dans Camer SIRH
            </Button>
          </div>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
}
