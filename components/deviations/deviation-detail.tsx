"use client"

import { use } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"

import { useTranslation } from "react-i18next"
import {
  useClassifyDeviation,
  useFetchDeviation,
  useUpdateDeviation,
} from "@/services/query/deviation"
import { useQueryClient } from "@tanstack/react-query"
import { QUERY_KEYS } from "@/services/query/query-keys"

import { DeviationDetailHeader } from "./deviation-detail-header"
import { DeviationInfoTab } from "./deviation-info-tab"
import { CapaTab } from "./capa-tab"
import { ClassificationHistoryTab } from "./classification-history-tab"

export function DeviationDetail({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const { t, i18n } = useTranslation()
  const queryClient = useQueryClient()

  const { data: dev, isLoading: isLoadingDev } = useFetchDeviation(id)

  const isDevClosed = dev?.status === "closed"

  const { mutate: classifyDeviation, isPending: isClassifying } =
    useClassifyDeviation({
      onSuccess: () => {
        toast.success(t("ai.classificationCompleted"))
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DEVIATION] })
      },
      onError: () => toast.error(t("ai.classificationFailed")),
    })

  const { mutate: updateDeviation, isPending: isUpdatingDeviation } =
    useUpdateDeviation({
      onSuccess: () => {
        toast.success(t("deviations.deviationUpdated"))
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DEVIATION] })
      },
      onError: () => toast.error(t("deviations.deviationUpdateFailed")),
    })

  const handleClassify = () => {
    if (!dev) return
    classifyDeviation({ deviationId: dev.id, locale: i18n.language })
  }

  const handleSeverityChange = (value: string) => {
    if (!dev) return
    const severity = value === "unclassified" ? null : value
    updateDeviation({ id: dev.id, severity })
  }

  const handleSaveRationale = (rationale: string | null) => {
    if (!dev) return
    updateDeviation({ id: dev.id, severityRationale: rationale })
  }

  if (isLoadingDev)
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-[400px]" />
      </div>
    )
  if (!dev) return <div>Not found</div>

  return (
    <div className="space-y-6">
      <DeviationDetailHeader
        deviation={dev}
        onClassify={handleClassify}
        isClassifying={isClassifying}
        isDevClosed={isDevClosed ?? false}
      />

      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">{t("deviations.details")}</TabsTrigger>
          <TabsTrigger value="capa">
            {t("deviations.capas")} ({dev.capas.length})
          </TabsTrigger>
          <TabsTrigger value="ai">
            {t("ai.classificationHistory")} ({dev.aiClassifications.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <DeviationInfoTab
            deviation={dev}
            isDevClosed={isDevClosed ?? false}
            isUpdatingDeviation={isUpdatingDeviation}
            onSeverityChange={handleSeverityChange}
            onSaveRationale={handleSaveRationale}
          />
        </TabsContent>

        <TabsContent value="capa">
          <CapaTab deviation={dev} />
        </TabsContent>

        <TabsContent value="ai">
          <ClassificationHistoryTab classifications={dev.aiClassifications} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
