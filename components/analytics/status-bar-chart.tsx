"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RTooltip,
  XAxis,
  YAxis,
} from "recharts"
import { getStatusLabel } from "@/lib/utils/deviation"
import { useTranslation } from "react-i18next"
import { DeviationStatus } from "@/generated/prisma/enums"
import type { AnalyticsDTO } from "@/lib/types"

interface StatusBarChartProps {
  data: AnalyticsDTO["deviationsByStatus"]
}

export function StatusBarChart({ data }: StatusBarChartProps) {
  const { t } = useTranslation()

  const chartData = data.map(
    (d: { status: DeviationStatus; count: number }) => ({
      ...d,
      label: getStatusLabel(d.status, t),
    })
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("analytics.byStatus")}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <CartesianGrid
              strokeDasharray="3 3"
              className="stroke-border"
            />
            <XAxis dataKey="label" className="text-xs" />
            <YAxis className="text-xs" />
            <RTooltip />
            <Bar
              dataKey="count"
              fill="var(--chart-3)"
              radius={[4, 4, 0, 0]}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
