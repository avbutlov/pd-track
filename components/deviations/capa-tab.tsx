"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, Sparkles, CheckCircle } from "lucide-react"
import { getCapaStatusVariant, getCapaStatusLabel } from "@/lib/utils/deviation"
import { useTranslation } from "react-i18next"
import { useQueryClient } from "@tanstack/react-query"
import { QUERY_KEYS } from "@/services/query/query-keys"
import {
  useCreateCapa,
  useSuggestCapa,
  useUpdateCapaStatus,
} from "@/services/query/capa"
import { toast } from "sonner"
import { CreateCapaDialog } from "./create-capa-dialog"
import type { DeviationDetailDTO } from "@/lib/types"

interface CapaTabProps {
  deviation: DeviationDetailDTO
}

export function CapaTab({ deviation }: CapaTabProps) {
  const { t, i18n } = useTranslation()
  const queryClient = useQueryClient()

  const [capaDialog, setCapaDialog] = useState(false)
  const [submittedCapaForm, setSubmittedCapaForm] = useState(false)
  const [capaForm, setCapaForm] = useState({
    description: "",
    assignedTo: "",
    dueDate: "",
  })

  const capaFormErrors = {
    assignedTo: submittedCapaForm && !capaForm.assignedTo,
    description: submittedCapaForm && !capaForm.description,
    dueDate: submittedCapaForm && !capaForm.dueDate,
  }

  const { mutate: suggestCapa, isPending: isSuggestingCapa } = useSuggestCapa({
    onSuccess: (suggestion) => {
      if (suggestion.corrective_actions?.[0]) {
        setCapaForm({
          description: suggestion.corrective_actions[0].description,
          assignedTo: "",
          dueDate: "",
        })

        setCapaDialog(true)
      }

      toast.success(t("ai.suggestionGenerated"))
    },
    onError: () => toast.error(t("ai.suggestionFailed")),
  })

  const { mutate: createCapa, isPending: isCreatingCapa } = useCreateCapa({
    onSuccess: () => {
      toast.success(t("capa.created"))
      setCapaDialog(false)
      setCapaForm({ description: "", assignedTo: "", dueDate: "" })
      setSubmittedCapaForm(false)
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DEVIATION] })
    },
    onError: () => toast.error(t("capa.createFailed")),
  })

  const { mutate: updateCapaStatus, isPending: isUpdatingCapaStatus } =
    useUpdateCapaStatus({
      onSuccess: () => {
        toast.success(t("capa.updated"))
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DEVIATION] })
      },
      onError: () => toast.error(t("capa.updateFailed")),
    })

  const handleSuggestCapa = () => {
    suggestCapa({
      description: deviation.description,
      category: deviation.category,
      severity: deviation.severity || "unknown",
      locale: i18n.language,
    })
  }

  const handleCreateCapa = () => {
    setSubmittedCapaForm(true)

    if (
      !capaForm.description ||
      !capaForm.assignedTo ||
      !capaForm.dueDate
    ) {
      toast.error(t("capa.fillAllFields"))
      return
    }

    createCapa({ deviationId: deviation.id, ...capaForm })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{t("capa.title")}</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSuggestCapa}
            disabled={isSuggestingCapa}
          >
            {isSuggestingCapa ? (
              <Loader2 className="mr-1 h-3 w-3 animate-spin" />
            ) : (
              <Sparkles className="mr-1 h-3 w-3" />
            )}
            {t("ai.suggestCapa")}
          </Button>
          <CreateCapaDialog
            open={capaDialog}
            onOpenChange={setCapaDialog}
            form={capaForm}
            onFormChange={setCapaForm}
            onSubmit={handleCreateCapa}
            isCreating={isCreatingCapa}
            formErrors={capaFormErrors}
          />
        </div>
      </div>

      {deviation.capas.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            {t("capa.noCAPAs")}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {deviation.capas.map((capa) => (
            <Card key={capa.id}>
              <CardContent className="pt-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-sm">{capa.description}</p>
                    <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
                      <span>
                        {t("capa.assignedTo")}: {capa.assignedTo}
                      </span>
                      <span>
                        {t("capa.dueDate")}:{" "}
                        {new Date(capa.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getCapaStatusVariant(capa.status)}>
                      {getCapaStatusLabel(capa.status, t)}
                    </Badge>
                    {capa.status !== "completed" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={isUpdatingCapaStatus}
                        onClick={() =>
                          updateCapaStatus({
                            capaId: capa.id,
                            status: "completed",
                          })
                        }
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
