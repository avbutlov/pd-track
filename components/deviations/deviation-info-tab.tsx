"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Pencil, Save, Loader2 } from "lucide-react"
import {
  getCategoryLabel,
  getSeverityVariant,
  getSeverityLabel,
} from "@/lib/utils/deviation"
import { useTranslation } from "react-i18next"
import type { DeviationDetailDTO } from "@/lib/types"

interface DeviationInfoTabProps {
  deviation: DeviationDetailDTO
  isDevClosed: boolean
  isUpdatingDeviation: boolean
  onSeverityChange: (value: string) => void
  onSaveRationale: (rationale: string | null) => void
}

export function DeviationInfoTab({
  deviation,
  isDevClosed,
  isUpdatingDeviation,
  onSeverityChange,
  onSaveRationale,
}: DeviationInfoTabProps) {
  const { t } = useTranslation()
  const [isEditingRationale, setIsEditingRationale] = useState(false)
  const [rationaleText, setRationaleText] = useState("")

  const handleStartEditRationale = () => {
    setRationaleText(deviation.severityRationale ?? "")
    setIsEditingRationale(true)
  }

  const handleSaveRationale = () => {
    onSaveRationale(rationaleText || null)
    setIsEditingRationale(false)
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {t("deviations.deviationInfo")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-xs text-muted-foreground">
                {t("deviations.patientId")}
              </Label>
              <p className="font-mono">{deviation.patientId}</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">
                {t("deviations.category")}
              </Label>
              <p>{getCategoryLabel(deviation.category, t)}</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">
                {t("deviations.deviationDate")}
              </Label>
              <p>
                {new Date(deviation.deviationDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">
                {t("deviations.reportedAt")}
              </Label>
              <p>{new Date(deviation.reportedAt).toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {t("deviations.classification")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              {isDevClosed ? (
                deviation.severity && (
                  <Badge variant={getSeverityVariant(deviation.severity)}>
                    {getSeverityLabel(deviation.severity, t)}
                  </Badge>
                )
              ) : (
                <>
                  <Label className="text-xs text-muted-foreground">
                    {t("deviations.severity")}
                  </Label>
                  <div className="mt-1">
                    <Select
                      value={deviation.severity ?? "unclassified"}
                      onValueChange={onSeverityChange}
                      disabled={isUpdatingDeviation}
                    >
                      <SelectTrigger>
                        <SelectValue>
                          <span className="text-muted-foreground">
                            {getSeverityLabel(
                              deviation.severity || "unclassified",
                              t
                            )}
                          </span>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="major">
                          <span className="text-muted-foreground">
                            {t("severities.major")}
                          </span>
                        </SelectItem>
                        <SelectItem value="minor">
                          <span className="text-muted-foreground">
                            {t("severities.minor")}
                          </span>
                        </SelectItem>
                        <SelectItem value="unclassified">
                          <span className="text-muted-foreground">
                            {t("severities.unclassified")}
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </div>
            <div>
              <div className="flex items-center justify-between">
                <Label className="text-xs text-muted-foreground">
                  {t("deviations.rationale")}
                </Label>
                {!isEditingRationale && !isDevClosed && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={handleStartEditRationale}
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                )}
              </div>
              {isEditingRationale ? (
                <div className="mt-1 space-y-2">
                  <Textarea
                    value={rationaleText}
                    onChange={(e) => setRationaleText(e.target.value)}
                    rows={3}
                    disabled={isUpdatingDeviation}
                    placeholder={t("deviations.rationalePlaceholder")}
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleSaveRationale}
                      disabled={isUpdatingDeviation}
                    >
                      {isUpdatingDeviation ? (
                        <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                      ) : (
                        <Save className="mr-1 h-3 w-3" />
                      )}
                      {t("common.save")}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsEditingRationale(false)}
                      disabled={isUpdatingDeviation}
                    >
                      {t("common.cancel")}
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-sm">
                  {deviation.severityRationale || (
                    <span className="text-muted-foreground italic">
                      {t("deviations.noRationale")}
                    </span>
                  )}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {t("deviations.description")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed">{deviation.description}</p>
        </CardContent>
      </Card>
    </div>
  )
}
