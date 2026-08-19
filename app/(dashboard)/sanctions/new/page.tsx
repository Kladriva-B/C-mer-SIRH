import { Gavel } from "lucide-react";
import { getSanctionFormOptions } from "@/lib/services/sanction.service";
import { SanctionForm } from "@/components/sanctions/form";
import { PageHeader } from "@/components/shared/page-header";

export default async function NewSanctionPage() {
  const options = await getSanctionFormOptions();
  return (
    <div className="space-y-6">
      <PageHeader
        icon={Gavel}
        tone="danger"
        title="Nouvelle sanction"
        description="Enregistrez une mesure disciplinaire."
      />
      <SanctionForm employees={options.employees} types={options.types} />
    </div>
  );
}
