"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useTranslation } from "react-i18next"
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RTooltip,
} from "recharts"

export function SiteBarChart({
  data,
}: {
  data: Array<{ siteCode: string; siteName: string; count: number }>
}) {
  const { t } = useTranslation()

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("dashboard.bySite")}</CardTitle>
        <CardDescription>{t("dashboard.deviationsPerSite")}</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis type="number" className="text-xs" />
            <YAxis
              type="category"
              dataKey="siteCode"
              className="text-xs"
              width={70}
            />
            <RTooltip
              contentStyle={{
                backgroundColor: "var(--popover)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                color: "var(--popover-foreground)",
              }}
              formatter={(value) => [value, t("ai.deviationsCount")]}
              labelFormatter={(label) => {
                const s = data.find((x) => x.siteCode === label)
                return s ? `${s.siteName} (${s.siteCode})` : label
              }}
            />
            <Bar
              dataKey="count"
              fill="var(--chart-1)"
              radius={[0, 4, 4, 0]}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
