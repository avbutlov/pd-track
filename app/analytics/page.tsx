import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { AnalyticsContent } from "@/components/analytics/analytics-content";

export default function AnalyticsPage() {
  return (
    <Suspense fallback={<div className="grid gap-4 md:grid-cols-2">{[1,2,3,4].map(i => <Skeleton key={i} className="h-[400px]" />)}</div>}>
      <AnalyticsContent />
    </Suspense>
  );
}
