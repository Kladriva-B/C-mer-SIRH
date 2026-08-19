import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
      <Label htmlFor="landing-reference">Référence du document</Label>
      <Input
        id="landing-reference"
        name="reference"
        required
        placeholder="DOC-2026-XXXXXX"
        className="h-11"
      />
      <Button type="submit" className="h-11 w-full">
        Vérifier l&apos;authenticité
      </Button>
    </form>
  );
}
