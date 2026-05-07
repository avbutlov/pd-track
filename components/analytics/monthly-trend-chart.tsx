"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip as RTooltip,
  XAxis,
  YAxis,
} from "recharts"
import { getMonthLabel } from "@/lib/utils/deviation"
import { useTranslation } from "react-i18next"
import type { AnalyticsDTO } from "@/lib/types"
import { chartTooltipStyle } from "@/lib/styles"

interface MonthlyTrendChartProps {
  data: AnalyticsDTO["monthlyTrend"]
}

export function MonthlyTrendChart({ data }: MonthlyTrendChartProps) {
  const { t } = useTranslation()

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("dashboard.monthlyTrend")}</CardTitle>
        <CardDescription>
          {t("dashboard.deviationsOverMonths")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              className="stroke-border"
            />
            <XAxis
              dataKey="month"
              className="text-xs"
              tickFormatter={(v) => getMonthLabel(v, t)}
            />
            <YAxis className="text-xs" />
            <RTooltip contentStyle={chartTooltipStyle} />
            <Legend />
            <Line
              type="monotone"
              dataKey="total"
              stroke="var(--chart-1)"
              strokeWidth={2}
              name={t("dashboard.total")}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="major"
              stroke="var(--chart-5)"
              strokeWidth={2}
              name={t("dashboard.major")}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="minor"
              stroke="var(--chart-2)"
              strokeWidth={2}
              name={t("dashboard.minor")}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
