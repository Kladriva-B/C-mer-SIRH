import { Logo } from "@/components/logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-[#1e1b4b] lg:flex lg:flex-col lg:justify-between p-10 text-white">
        <Logo inverted withSubtitle />
        <div className="max-w-md space-y-4">
          <p className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-medium tracking-wide text-indigo-200">
            Console RH — Cameroun
          </p>
          <h1 className="text-3xl font-bold tracking-tight">La gestion RH, claire et maîtrisée.</h1>
          <p className="text-sm text-white/75">
            Employés, ouvriers, sanctions, paie et documents dans une console unique, pensée pour les équipes RH.
          </p>
        </div>
        <p className="text-xs text-white/60">© {new Date().getFullYear()} Camer SIRH</p>
        <div className="pointer-events-none absolute -right-24 -bottom-24 size-96 rounded-full bg-brand-secondary/40 blur-3xl" />
        <div className="pointer-events-none absolute -top-16 left-10 size-64 rounded-full bg-primary/40 blur-3xl" />
      </div>
      <div className="flex items-center justify-center bg-background p-6">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
