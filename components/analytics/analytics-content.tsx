"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  Tooltip as RTooltip,
  Legend,
} from "recharts"
import {
  getCategoryLabel,
  getMonthLabel,
  getSeverityLabel,
  getStatusLabel,
} from "@/lib/utils/deviation"
import { useTranslation } from "react-i18next"
import { useFetchAnalytics } from "@/services/query/analytics"
import { DeviationCategory, DeviationStatus } from "@/generated/prisma/enums"
import { DeviationSeverity } from "@/lib/types/deviation"

const COLORS = [
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
        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.monthlyTrend")}</CardTitle>
            <CardDescription>
              {t("dashboard.deviationsOverMonths")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={data.monthlyTrend}>
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
                  data={data.deviationsByCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey="count"
                  nameKey="category"
                  isAnimationActive={false}
                >
                  {data.deviationsByCategory.map((_: unknown, i: number) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <RTooltip
                  contentStyle={{
                    backgroundColor: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    color: "var(--popover-foreground)",
                  }}
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

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>{t("dashboard.bySite")}</CardTitle>
            <CardDescription>
              {t("dashboard.deviationsPerSite")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={data.deviationsBySite}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-border"
                />
                <XAxis dataKey="siteCode" className="text-xs" />
                <YAxis className="text-xs" />
                <RTooltip
                  contentStyle={{
                    backgroundColor: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    color: "var(--popover-foreground)",
                  }}
                  labelFormatter={(l) => {
                    const s = data.deviationsBySite.find(
                      (x: { siteCode: string }) => x.siteCode === l
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

        <Card>
          <CardHeader>
            <CardTitle>{t("analytics.bySeverity")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={data.deviationsBySeverity}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="count"
                  nameKey="severity"
                  label
                  isAnimationActive={false}
                >
                  {data.deviationsBySeverity.map((_: unknown, i: number) => (
                    <Cell
                      key={i}
                      fill={
                        i === 0
                          ? "var(--chart-5)"
                          : i === 1
                            ? "var(--chart-2)"
                            : "var(--chart-4)"
                      }
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

        <Card>
          <CardHeader>
            <CardTitle>{t("analytics.byStatus")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={data.deviationsByStatus.map(
                  (d: { status: DeviationStatus; count: number }) => ({
                    ...d,
                    label: getStatusLabel(d.status, t),
                  })
                )}
              >
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
      </div>
    </div>
  )
}
