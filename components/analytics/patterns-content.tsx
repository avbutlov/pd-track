"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  BrainCircuit,
  Loader2,
  AlertTriangle,
  TrendingUp,
  MapPin,
  Clock,
} from "lucide-react"
import { useTranslation } from "react-i18next"
import {
  useAnalyzePatterns,
  useFetchPatternResults,
} from "@/services/query/pattern"
import { useQueryClient } from "@tanstack/react-query"
import { QUERY_KEYS } from "@/services/query/query-keys"
import type { PatternAnalysisResultDTO } from "@/lib/types"
import { toast } from "sonner"

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

  const renderResultsList = () => {
    if (isLoadingResults) {
      return (
        <div className="space-y-2">
          {[...Array(3)].map((_, index) => (
            <Skeleton key={index} className="h-14" />
          ))}
        </div>
      )
    }

    if (results.length === 0)
      return (
        <p className="text-sm text-muted-foreground">
          {t("ai.noAnalysisResults")}
        </p>
      )

    return (
      <div className="space-y-2">
        {results.map((r) => (
          <button
            key={r.id}
            onClick={() => setSelectedResult(r)}
            className={`w-full cursor-pointer rounded-lg border p-3 text-left text-sm transition-colors hover:bg-muted/50 ${selectedResult?.id === r.id ? "border-primary bg-muted/30" : ""}`}
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
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">{t("ai.savedAnalyses")}</CardTitle>
          </CardHeader>
          <CardContent>{renderResultsList()}</CardContent>
        </Card>

        <div className="md:col-span-2">
          {data ? (
            <div className="space-y-6">
              {data.anomalous_sites.length > 0 && (
                <div>
                  <h2 className="mb-3 flex items-center gap-2 text-xl font-semibold">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    {t("ai.anomalousSites")}
                  </h2>
                  <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
                    {data.anomalous_sites.map((s, i) => (
                      <Card
                        key={i}
                        className={
                          s.severity_level === "high"
                            ? "border-destructive/30"
                            : ""
                        }
                      >
                        <CardContent className="pt-4">
                          <div className="mb-2 flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              <span className="font-semibold">
                                {s.site_name}
                              </span>
                              <Badge variant="outline">{s.site_code}</Badge>
                            </div>
                            <Badge
                              variant={
                                s.severity_level === "high"
                                  ? "destructive"
                                  : "secondary"
                              }
                            >
                              {s.severity_level}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {s.anomaly_description}
                          </p>
                          <p className="mt-1 text-sm">
                            {t("ai.deviationsCount")}:{" "}
                            <span className="font-bold">
                              {s.deviation_count}
                            </span>
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
              {data.recurring_patterns.length > 0 && (
                <div>
                  <h2 className="mb-3 flex items-center gap-2 text-xl font-semibold">
                    <TrendingUp className="h-5 w-5 text-warning" />
                    {t("ai.recurringPatterns")}
                  </h2>
                  <div className="space-y-3">
                    {data.recurring_patterns.map((p, i) => (
                      <Card key={i}>
                        <CardContent className="pt-4">
                          <p className="mb-1 font-medium">{p.pattern}</p>
                          <div className="mb-2 flex flex-wrap gap-1">
                            {p.affected_sites.map((s, j) => (
                              <Badge
                                key={j}
                                variant="outline"
                                className="text-xs"
                              >
                                {s}
                              </Badge>
                            ))}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            <span className="font-medium">
                              {t("ai.recommendation")}:
                            </span>{" "}
                            {p.recommendation}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
              {data.trend_insights.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>{t("ai.trendInsights")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {data.trend_insights.map((insight, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <span className="mt-1 text-primary">•</span>
                          {insight}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <Card>
              {isAnalyzingPatterns ? (
                <Skeleton className="mx-4 h-61" />
              ) : (
                <CardContent className="py-16 text-center">
                  <BrainCircuit className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                  <h3 className="mb-1 text-lg font-semibold">
                    {t("ai.runAnalysis")}
                  </h3>
                  <p className="text-muted-foreground">
                    {t("ai.clickRunAnalysis")}
                  </p>
                </CardContent>
              )}
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
