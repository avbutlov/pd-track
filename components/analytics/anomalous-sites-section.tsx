"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, MapPin } from "lucide-react"
import { useTranslation } from "react-i18next"
import type { PatternAnalysisResultDTO } from "@/lib/types"

type AnomalousSite =
  PatternAnalysisResultDTO["data"]["anomalous_sites"][number]

interface AnomalousSitesSectionProps {
  sites: AnomalousSite[]
}

export function AnomalousSitesSection({ sites }: AnomalousSitesSectionProps) {
  const { t } = useTranslation()

  if (sites.length === 0) return null

  return (
    <div>
      <h2 className="mb-3 flex items-center gap-2 text-xl font-semibold">
        <AlertTriangle className="h-5 w-5 text-destructive" />
        {t("ai.anomalousSites")}
      </h2>
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
        {sites.map((s, i) => (
          <Card
            key={i}
            className={
              s.severity_level === "high" ? "border-destructive/30" : ""
            }
          >
            <CardContent className="pt-4">
              <div className="mb-2 flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span className="font-semibold">{s.site_name}</span>
                  <Badge variant="outline">{s.site_code}</Badge>
                </div>
                <Badge
                  variant={
                    s.severity_level === "high" ? "destructive" : "secondary"
                  }
                >
                  {s.severity_level}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {s.anomaly_description}
              </p>
              <p className="mt-1 text-sm">
                {t("ai.deviationsCount")}:{" "}
                <span className="font-bold">{s.deviation_count}</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
