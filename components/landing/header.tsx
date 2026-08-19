import Link from "next/link";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

const links = [
  { href: "#modules", label: "Modules" },
  { href: "#paie", label: "Paie" },
  { href: "#verification", label: "Vérification" },
];

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0b1020]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" aria-label="Accueil Camer SIRH">
          <Logo inverted />
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-white/70 md:flex" aria-label="Navigation">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="transition-colors hover:text-white">
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white" render={<Link href="/login" />}>
            Connexion
          </Button>
          <Button className="bg-white text-primary-dark hover:bg-white/90" render={<Link href="/login" />}>
            Accéder à l&apos;espace
          </Button>
        </div>
      </div>
    </header>
  );
}
