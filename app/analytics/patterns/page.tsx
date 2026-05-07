import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { PatternsContent } from "@/components/analytics/patterns-content";

export default function PatternsPage() {
  return (
    <Suspense fallback={<Skeleton className="h-[400px]" />}>
      <PatternsContent />
    </Suspense>
  );
}
