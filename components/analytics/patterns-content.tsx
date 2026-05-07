"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { BrainCircuit, Loader2 } from "lucide-react"
import { useTranslation } from "react-i18next"
import {
  useAnalyzePatterns,
  useFetchPatternResults,
} from "@/services/query/pattern"
import { useQueryClient } from "@tanstack/react-query"
import { QUERY_KEYS } from "@/services/query/query-keys"
import type { PatternAnalysisResultDTO } from "@/lib/types"
import { toast } from "sonner"
import { PatternResultsList } from "./pattern-results-list"
import { AnomalousSitesSection } from "./anomalous-sites-section"
import { RecurringPatternsSection } from "./recurring-patterns-section"
import { TrendInsightsSection } from "./trend-insights-section"
import { PatternEmptyState } from "./pattern-empty-state"

export function PatternsContent() {
  const { t, i18n } = useTranslation()
  const [selectedResult, setSelectedResult] =
    useState<PatternAnalysisResultDTO | null>(null)

  const queryClient = useQueryClient()

  const { data: results = [], isLoading: isLoadingResults } =
    useFetchPatternResults()

  const { mutate: analyzePatterns, isPending: isAnalyzingPatterns } =
    useAnalyzePatterns({
      onSuccess: (saved) => {
        toast.success(t("ai.analysisCompleted"))
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PATTERN] })

        if (!selectedResult) {
          setSelectedResult(saved)
        }
      },
      onError: () => toast.error(t("ai.analysisFailed")),
    })

  const data = selectedResult?.data ?? null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("ai.patternAnalysis")}
          </h1>
          <p className="text-muted-foreground">{t("ai.patternSubtitle")}</p>
        </div>
        <Button
          onClick={() => analyzePatterns(i18n.language)}
          disabled={isAnalyzingPatterns}
        >
          {isAnalyzingPatterns ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <BrainCircuit className="mr-2 h-4 w-4" />
          )}
          {isAnalyzingPatterns ? t("ai.analyzing") : t("ai.runAnalysis")}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <PatternResultsList
          results={results}
          isLoading={isLoadingResults}
          selectedId={selectedResult?.id ?? null}
          onSelect={setSelectedResult}
        />

        <div className="md:col-span-2">
          {data ? (
            <div className="space-y-6">
              <AnomalousSitesSection sites={data.anomalous_sites} />
              <RecurringPatternsSection patterns={data.recurring_patterns} />
              <TrendInsightsSection insights={data.trend_insights} />
            </div>
          ) : (
            <PatternEmptyState isAnalyzing={isAnalyzingPatterns} />
          )}
        </div>
      </div>
    </div>
  )
}
