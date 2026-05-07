import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardContent } from "@/components/dashboard/dashboard-content";

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div><Skeleton className="h-8 w-48" /><Skeleton className="h-4 w-80 mt-1" /></div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-[120px]" />)}</div>
      <div className="grid gap-4 md:grid-cols-2"><Skeleton className="h-[350px]" /><Skeleton className="h-[350px]" /></div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}
