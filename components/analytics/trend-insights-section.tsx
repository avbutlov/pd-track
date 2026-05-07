"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useTranslation } from "react-i18next"

interface TrendInsightsSectionProps {
  insights: string[]
}

export function TrendInsightsSection({ insights }: TrendInsightsSectionProps) {
  const { t } = useTranslation()

  if (insights.length === 0) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("ai.trendInsights")}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {insights.map((insight, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <span className="mt-1 text-primary">•</span>
              {insight}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
