import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

async function verifyDocument(formData: FormData) {
  "use server";
  const reference = String(formData.get("reference") ?? "").trim();
  if (!reference) {
    return;
  }
  redirect(`/verify/${encodeURIComponent(reference)}`);
}

export function LandingVerifyForm() {
  return (
    <form action={verifyDocument} className="mt-6 space-y-3">
      <label htmlFor="landing-reference" className="text-sm text-white/70">
        Référence du document
      </label>
      <input
        id="landing-reference"
        name="reference"
        required
        placeholder="DOC-2026-XXXXXX"
        className="h-11 w-full rounded-xl border-0 bg-white/10 px-3 text-sm text-white outline-none placeholder:text-white/35 focus-visible:ring-2 focus-visible:ring-white/40"
      />
      <Button type="submit" className="h-11 w-full bg-white text-primary-dark hover:bg-white/90">
        Vérifier l&apos;authenticité
      </Button>
    </form>
  );
}
