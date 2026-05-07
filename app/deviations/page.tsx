import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { DeviationsTable } from "@/components/deviations/deviations-table";

export default function DeviationsPage() {
  return (
    <Suspense fallback={<div className="space-y-4"><Skeleton className="h-8 w-48" /><Skeleton className="h-[400px]" /></div>}>
      <DeviationsTable />
    </Suspense>
  );
}
