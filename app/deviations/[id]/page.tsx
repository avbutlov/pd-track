import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { DeviationDetail } from "@/components/deviations/deviation-detail"

export default function DeviationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  return (
    <Suspense
      fallback={
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-100" />
        </div>
      }
    >
      <DeviationDetail params={params} />
    </Suspense>
  )
}
