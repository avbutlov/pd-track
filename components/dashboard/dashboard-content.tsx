"use client"

import { Skeleton } from "@/components/ui/skeleton"
import {
  AlertTriangle,
  ClipboardList,
  ShieldAlert,
  Wrench,
  Clock,
} from "lucide-react"
import { KPICard } from "./kpi-card"
import { MonthlyTrendChart } from "./monthly-trend-chart"
import { CategoryPieChart } from "./category-pie-chart"
import { SiteBarChart } from "./site-bar-chart"
import { RecentDeviationsList } from "./recent-deviations-list"
import { useTranslation } from "react-i18next"
import { useFetchAnalytics } from "@/services/query/analytics"

export function DashboardContent() {
  const { t } = useTranslation()
  const { data, isLoading } = useFetchAnalytics()

  if (isLoading)
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-[120px]" />
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-[350px]" />
          <Skeleton className="h-[350px]" />
        </div>
      </div>
    )

  if (!data) return <div>{t("common.noData")}</div>

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <KPICard
          title={t("dashboard.totalDeviations")}
          value={data.kpi.totalDeviations}
          icon={ClipboardList}
          description={t("dashboard.allRegistered")}
        />
        <KPICard
          title={t("dashboard.open")}
          value={data.kpi.openDeviations}
          icon={AlertTriangle}
          description={t("dashboard.requiringAttention")}
          variant="warning"
        />
        <KPICard
          title={t("dashboard.major")}
          value={data.kpi.majorDeviations}
          icon={ShieldAlert}
          description={t("dashboard.patientSafety")}
          variant="danger"
        />
        <KPICard
          title={t("dashboard.activeCAPAs")}
          value={data.kpi.activeCAPAs}
          icon={Wrench}
          description={t("dashboard.inProgressOrPending")}
        />
        <KPICard
          title={t("dashboard.overdueCAPAs")}
          value={data.kpi.overdueCAPAs}
          icon={Clock}
          description={t("dashboard.pastDueDate")}
          variant={data.kpi.overdueCAPAs > 0 ? "danger" : "success"}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <MonthlyTrendChart data={data.monthlyTrend} />
        <CategoryPieChart data={data.deviationsByCategory} />
        <SiteBarChart data={data.deviationsBySite} />
        <RecentDeviationsList data={data.recentDeviations} />
      </div>
    </div>
  )
}
