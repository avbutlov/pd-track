"use client"

import {
  Card,
  CardContent,
  CardDescription,
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
import { useTranslation } from "react-i18next"
import type { AnalyticsDTO } from "@/lib/types"
import { chartTooltipStyle } from "@/lib/styles"

interface SiteBarChartProps {
  data: AnalyticsDTO["deviationsBySite"]
}

export function SiteBarChart({ data }: SiteBarChartProps) {
  const { t } = useTranslation()

  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>{t("dashboard.bySite")}</CardTitle>
        <CardDescription>
          {t("dashboard.deviationsPerSite")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              className="stroke-border"
            />
            <XAxis dataKey="siteCode" className="text-xs" />
            <YAxis className="text-xs" />
            <RTooltip
              contentStyle={chartTooltipStyle}
              labelFormatter={(l) => {
                const s = data.find(
                  (x) => x.siteCode === l
                )
                return s ? `${s.siteName} (${s.siteCode})` : l
              }}
            />
            <Bar
              dataKey="count"
              fill="var(--chart-1)"
              radius={[4, 4, 0, 0]}
              name={t("ai.deviationsCount")}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
