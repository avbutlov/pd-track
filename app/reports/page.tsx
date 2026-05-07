import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ReportsContent } from "@/components/reports/reports-content";

export default function ReportsPage() {
  return (
    <Suspense fallback={<Skeleton className="h-[500px]" />}>
      <ReportsContent />
    </Suspense>
  );
}
