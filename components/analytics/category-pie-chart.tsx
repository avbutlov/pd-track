"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RTooltip,
} from "recharts"
import { getCategoryLabel } from "@/lib/utils/deviation"
import { useTranslation } from "react-i18next"
import { DeviationCategory } from "@/generated/prisma/enums"
import type { AnalyticsDTO } from "@/lib/types"
import { chartTooltipStyle } from "@/lib/styles"

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff8042",
]

interface CategoryPieChartProps {
  data: AnalyticsDTO["deviationsByCategory"]
}

export function CategoryPieChart({ data }: CategoryPieChartProps) {
  const { t } = useTranslation()

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("dashboard.byCategory")}</CardTitle>
        <CardDescription>
          {t("dashboard.distributionOfTypes")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart className="flex flex-col-reverse">
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120}
              paddingAngle={2}
              dataKey="count"
              nameKey="category"
              isAnimationActive={false}
            >
              {data.map((_: unknown, i: number) => (
                <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
              ))}
            </Pie>
            <RTooltip
              contentStyle={chartTooltipStyle}
              formatter={(v, n) => [
                v,
                getCategoryLabel(n as DeviationCategory, t),
              ]}
            />
            <Legend
              formatter={(v: DeviationCategory) => getCategoryLabel(v, t)}
              wrapperStyle={{ position: "static" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
