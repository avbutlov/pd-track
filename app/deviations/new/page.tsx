import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { NewDeviationForm } from "@/components/deviations/new-deviation-form";

export default function NewDeviationPage() {
  return (
    <Suspense fallback={<Skeleton className="h-[500px] max-w-2xl mx-auto" />}>
      <NewDeviationForm />
    </Suspense>
  );
}
