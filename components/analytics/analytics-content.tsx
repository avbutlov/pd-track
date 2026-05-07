"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { useTranslation } from "react-i18next"
import { useFetchAnalytics } from "@/services/query/analytics"
import { MonthlyTrendChart } from "./monthly-trend-chart"
import { CategoryPieChart } from "./category-pie-chart"
import { SiteBarChart } from "./site-bar-chart"
import { SeverityPieChart } from "./severity-pie-chart"
import { StatusBarChart } from "./status-bar-chart"

export function AnalyticsContent() {
  const { t } = useTranslation()
  const { data, isLoading } = useFetchAnalytics()

  if (isLoading)
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-[400px]" />
        ))}
      </div>
    )
  if (!data) return <div>{t("common.noData")}</div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {t("analytics.title")}
        </h1>
        <p className="text-muted-foreground">{t("analytics.subtitle")}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <MonthlyTrendChart data={data.monthlyTrend} />
        <CategoryPieChart data={data.deviationsByCategory} />
        <SiteBarChart data={data.deviationsBySite} />
        <SeverityPieChart data={data.deviationsBySeverity} />
        <StatusBarChart data={data.deviationsByStatus} />
      </div>
    </div>
  )
}
