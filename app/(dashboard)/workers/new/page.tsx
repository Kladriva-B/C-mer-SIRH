import { HardHat } from "lucide-react";
import { getWorkerFormOptions } from "@/lib/services/worker.service";
import { WorkerForm } from "@/components/workers/form";
import { PageHeader } from "@/components/shared/page-header";

export default async function NewWorkerPage() {
  const options = await getWorkerFormOptions();
  return (
    <div className="space-y-6">
      <PageHeader
        icon={HardHat}
        tone="warning"
        title="Nouvel ouvrier"
        description="Affectation, site et conditions de chantier."
      />
      <WorkerForm sites={options.sites} positions={options.positions} />
    </div>
  );
}
