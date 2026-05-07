"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { BrainCircuit } from "lucide-react"
import { useTranslation } from "react-i18next"

interface PatternEmptyStateProps {
  isAnalyzing: boolean
}

export function PatternEmptyState({ isAnalyzing }: PatternEmptyStateProps) {
  const { t } = useTranslation()

  return (
    <Card>
      {isAnalyzing ? (
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
  )
}
