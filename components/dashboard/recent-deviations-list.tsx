"use client"

import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"
import { ROUTES } from "@/constants"
import {
  getCategoryLabel,
  getStatusLabel,
  getSeverityVariant,
  getSeverityLabel,
} from "@/lib/utils/deviation"
import type { DeviationDTO } from "@/lib/types"
import { useTranslation } from "react-i18next"

export function RecentDeviationsList({ data }: { data: DeviationDTO[] }) {
  const { t } = useTranslation()

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{t("dashboard.recentDeviations")}</CardTitle>
          <CardDescription>{t("dashboard.latestRegistered")}</CardDescription>
        </div>
        <Link
          href={ROUTES.DEVIATIONS}
          className="flex items-center gap-1 text-sm text-primary hover:underline"
        >
          {t("common.viewAll")} <ArrowRight className="h-3 w-3" />
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map((dev) => (
            <Link
              key={dev.id}
              href={ROUTES.DEVIATION_DETAIL(dev.id)}
              className="flex items-start justify-between gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-medium">
                    {dev.deviationNumber}
                  </span>
                  <Badge
                    variant={getSeverityVariant(dev.severity)}
                    className="text-[10px]"
                  >
                    {dev.severity ? getSeverityLabel(dev.severity, t) : "—"}
                  </Badge>
                </div>
                <p className="mt-1 truncate text-xs text-muted-foreground">
                  {dev.description}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {dev.site.code} · {getCategoryLabel(dev.category, t)}
                </p>
              </div>
              <Badge variant="outline" className="shrink-0 text-[10px]">
                {getStatusLabel(dev.status, t)}
              </Badge>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
