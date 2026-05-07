"use client"

import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, BrainCircuit, Loader2 } from "lucide-react"
import {
  getSeverityVariant,
  getStatusLabel,
  getSeverityLabel,
} from "@/lib/utils/deviation"
import { useTranslation } from "react-i18next"
import type { DeviationDetailDTO } from "@/lib/types"

interface DeviationDetailHeaderProps {
  deviation: DeviationDetailDTO
  onClassify: () => void
  isClassifying: boolean
  isDevClosed: boolean
}

export function DeviationDetailHeader({
  deviation,
  onClassify,
  isClassifying,
  isDevClosed,
}: DeviationDetailHeaderProps) {
  const router = useRouter()
  const { t } = useTranslation()

  return (
    <div className="flex items-center gap-4">
      <Button variant="ghost" size="sm" onClick={() => router.back()}>
        <ArrowLeft className="mr-1 h-4 w-4" />
        {t("common.back")}
      </Button>
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <h1 className="font-mono text-2xl font-bold">
            {deviation.deviationNumber}
          </h1>
          {deviation.severity && (
            <Badge variant={getSeverityVariant(deviation.severity)}>
              {getSeverityLabel(deviation.severity, t)}
            </Badge>
          )}
          <Badge variant="outline">
            {getStatusLabel(deviation.status, t)}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          {deviation.site.name} ({deviation.site.code}) ·{" "}
          {deviation.site.location}
        </p>
      </div>
      <Button
        onClick={onClassify}
        disabled={isClassifying || isDevClosed}
        variant="outline"
      >
        {isClassifying ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <BrainCircuit className="mr-2 h-4 w-4" />
        )}
        {isClassifying ? t("ai.classifying") : t("ai.classify")}
      </Button>
    </div>
  )
}
