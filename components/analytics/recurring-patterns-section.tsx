"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp } from "lucide-react"
import { useTranslation } from "react-i18next"
import type { PatternAnalysisResultDTO } from "@/lib/types"

type RecurringPattern =
  PatternAnalysisResultDTO["data"]["recurring_patterns"][number]

interface RecurringPatternsSectionProps {
  patterns: RecurringPattern[]
}

export function RecurringPatternsSection({
  patterns,
}: RecurringPatternsSectionProps) {
  const { t } = useTranslation()

  if (patterns.length === 0) return null

  return (
    <div>
      <h2 className="mb-3 flex items-center gap-2 text-xl font-semibold">
        <TrendingUp className="h-5 w-5 text-warning" />
        {t("ai.recurringPatterns")}
      </h2>
      <div className="space-y-3">
        {patterns.map((p, i) => (
          <Card key={i}>
            <CardContent className="pt-4">
              <p className="mb-1 font-medium">{p.pattern}</p>
              <div className="mb-2 flex flex-wrap gap-1">
                {p.affected_sites.map((s, j) => (
                  <Badge key={j} variant="outline" className="text-xs">
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
  )
}
