"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  Tooltip as RTooltip,
  Legend,
} from "recharts"
import { getCategoryLabel } from "@/lib/utils/deviation"
import { useTranslation } from "react-i18next"
import { DeviationCategory } from "@/generated/prisma/enums"

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

export function CategoryPieChart({
  data,
}: {
  data: Array<{ category: string; count: number }>
}) {
  const { t } = useTranslation()

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("dashboard.byCategory")}</CardTitle>
        <CardDescription>{t("dashboard.distributionOfTypes")}</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart className="flex flex-col-reverse">
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="count"
              nameKey="category"
              labelLine={false}
              isAnimationActive={false}
            >
              {data.map((_, i) => (
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
              formatter={(value, name) => [
                value,
                getCategoryLabel(name as DeviationCategory, t),
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
