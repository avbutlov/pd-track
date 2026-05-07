"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { getSeverityVariant, getSeverityLabel } from "@/lib/utils/deviation"
import { useTranslation } from "react-i18next"
import type { AIClassificationDTO } from "@/lib/types"

interface ClassificationHistoryTabProps {
  classifications: AIClassificationDTO[]
}

export function ClassificationHistoryTab({
  classifications,
}: ClassificationHistoryTabProps) {
  const { t } = useTranslation()

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">
        {t("ai.classificationHistory")}
      </h3>
      {classifications.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            {t("ai.noClassifications")}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {classifications.map((c) => (
            <Card key={c.id}>
              <CardContent className="pt-4">
                <div className="mb-2 flex items-start justify-between">
                  <Badge variant={getSeverityVariant(c.severity)}>
                    {getSeverityLabel(c.severity, t)}
                  </Badge>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">
                      {c.modelUsed}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t("ai.confidence")}:{" "}
                      {(c.confidence * 100).toFixed(0)}%
                    </p>
                  </div>
                </div>
                <Separator className="my-2" />
                <p className="mb-2 text-sm">{c.rationale}</p>
                {c.riskFactors.length > 0 && (
                  <div className="mb-2 flex flex-wrap gap-1">
                    {c.riskFactors.map((f, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {f}
                      </Badge>
                    ))}
                  </div>
                )}
                {c.regulatoryRef && (
                  <p className="text-xs text-muted-foreground">
                    {t("ai.ref")}: {c.regulatoryRef}
                  </p>
                )}
                <p className="mt-1 text-xs text-muted-foreground">
                  {new Date(c.createdAt).toLocaleString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
