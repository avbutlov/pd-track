"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Clock } from "lucide-react"
import { useTranslation } from "react-i18next"
import type { PatternAnalysisResultDTO } from "@/lib/types"

interface PatternResultsListProps {
  results: PatternAnalysisResultDTO[]
  isLoading: boolean
  selectedId: number | null
  onSelect: (result: PatternAnalysisResultDTO) => void
}

export function PatternResultsList({
  results,
  isLoading,
  selectedId,
  onSelect,
}: PatternResultsListProps) {
  const { t } = useTranslation()

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-2">
          {[...Array(3)].map((_, index) => (
            <Skeleton key={index} className="h-14" />
          ))}
        </div>
      )
    }

    if (results.length === 0) {
      return (
        <p className="text-sm text-muted-foreground">
          {t("ai.noAnalysisResults")}
        </p>
      )
    }

    return (
      <div className="space-y-2">
        {results.map((r) => (
          <button
            key={r.id}
            onClick={() => onSelect(r)}
            className={`w-full cursor-pointer rounded-lg border p-3 text-left text-sm transition-colors hover:bg-muted/50 ${selectedId === r.id ? "border-primary bg-muted/30" : ""}`}
          >
            <div className="truncate font-medium">
              {t("ai.patternAnalysis")} #{r.id}
            </div>
            <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {new Date(r.createdAt).toLocaleString()}
            </div>
          </button>
        ))}
      </div>
    )
  }

  return (
    <Card className="md:col-span-1">
      <CardHeader>
        <CardTitle className="text-base">{t("ai.savedAnalyses")}</CardTitle>
      </CardHeader>
      <CardContent>{renderContent()}</CardContent>
    </Card>
  )
}
