"use client"

import {
  Card,
  CardContent,
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
import { getSeverityLabel } from "@/lib/utils/deviation"
import { useTranslation } from "react-i18next"
import { DeviationSeverity } from "@/lib/types/deviation"
import type { AnalyticsDTO } from "@/lib/types"

const SEVERITY_COLORS = ["var(--chart-5)", "var(--chart-2)", "var(--chart-4)"]

interface SeverityPieChartProps {
  data: AnalyticsDTO["deviationsBySeverity"]
}

export function SeverityPieChart({ data }: SeverityPieChartProps) {
  const { t } = useTranslation()

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("analytics.bySeverity")}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey="count"
              nameKey="severity"
              label
              isAnimationActive={false}
            >
              {data.map((_: unknown, i: number) => (
                <Cell
                  key={i}
                  fill={SEVERITY_COLORS[i] ?? SEVERITY_COLORS[2]}
                />
              ))}
            </Pie>
            <RTooltip
              formatter={(v, n) => [
                v,
                getSeverityLabel(n as DeviationSeverity, t),
              ]}
            />
            <Legend
              formatter={(v: DeviationSeverity) => getSeverityLabel(v, t)}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
