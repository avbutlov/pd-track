"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RTooltip,
  Legend,
} from "recharts"
import { getMonthLabel } from "@/lib/utils/deviation"
import { useTranslation } from "react-i18next"

export function MonthlyTrendChart({
  data,
}: {
  data: Array<{ month: string; total: number; major: number; minor: number }>
}) {
  const { t } = useTranslation()

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("dashboard.monthlyTrend")}</CardTitle>
        <CardDescription>{t("dashboard.deviationsOverMonths")}</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              dataKey="month"
              className="text-xs"
              tickFormatter={(v) => getMonthLabel(v, t)}
            />
            <YAxis className="text-xs" />
            <RTooltip
              contentStyle={{
                backgroundColor: "var(--popover)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                color: "var(--popover-foreground)",
              }}
            />
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
