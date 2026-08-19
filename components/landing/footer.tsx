import Link from "next/link";
import { Logo } from "@/components/logo";

export function LandingFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#070b16] py-10 text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <Logo inverted />
          <p className="mt-3 max-w-sm text-sm text-white/55">
            Console RH professionnelle pour les entreprises au Cameroun. Employés, ouvriers, paie et documents, en un seul endroit.
          </p>
        </div>
        <div className="flex flex-col gap-2 text-sm text-white/60">
          <Link href="/login" className="hover:text-white">
            Connexion
          </Link>
          <a href="#verification" className="hover:text-white">
            Vérifier un document
          </a>
          <p className="pt-2 text-xs text-white/40">© {new Date().getFullYear()} Camer SIRH</p>
        </div>
      </div>
    </footer>
  );
}
