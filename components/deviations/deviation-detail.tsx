"use client"

import { useState, use } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import {
  ArrowLeft,
  BrainCircuit,
  PlusCircle,
  CheckCircle,
  Loader2,
  Sparkles,
  Pencil,
  Save,
} from "lucide-react"
import {
  getCategoryLabel,
  getStatusLabel,
  getSeverityVariant,
  getCapaStatusVariant,
  getSeverityLabel,
  getCapaStatusLabel,
} from "@/lib/utils/deviation"

import { useTranslation } from "react-i18next"
import {
  useClassifyDeviation,
  useFetchDeviation,
  useUpdateDeviation,
} from "@/services/query/deviation"
import { useQueryClient } from "@tanstack/react-query"
import { QUERY_KEYS } from "@/services/query/query-keys"
import {
  useCreateCapa,
  useSuggestCapa,
  useUpdateCapaStatus,
} from "@/services/query/capa"
import { getIsoFormattedLocalDate } from "@/lib/utils/date"

export function DeviationDetail({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const { t, i18n } = useTranslation()
  const [capaDialog, setCapaDialog] = useState(false)
  const [isEditingRationale, setIsEditingRationale] = useState(false)
  const [rationaleText, setRationaleText] = useState("")
  const [capaForm, setCapaForm] = useState({
    description: "",
    assignedTo: "",
    dueDate: "",
  })
  const [submittedCapaForm, setSubmittedCapaForm] = useState(false)

  const capaFormErrors = {
    assignedTo: submittedCapaForm && !capaForm.assignedTo,
    description: submittedCapaForm && !capaForm.description,
    dueDate: submittedCapaForm && !capaForm.dueDate,
  }

  const queryClient = useQueryClient()

  const { data: dev, isLoading: isLoadingDev } = useFetchDeviation(id)

  const isDevClosed = dev?.status === "closed"

  const { mutate: classifyDeviation, isPending: isClassifying } =
    useClassifyDeviation({
      onSuccess: () => {
        toast.success(t("ai.classificationCompleted"))
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DEVIATION] })
      },
      onError: () => toast.error(t("ai.classificationFailed")),
    })

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

  const handleSuggestCapa = () => {
    if (!dev) return

    suggestCapa({
      description: dev.description,
      category: dev.category,
      severity: dev.severity || "unknown",
      locale: i18n.language,
    })
  }

  const { mutate: createCapa, isPending: isCreatingCapa } = useCreateCapa({
    onSuccess: () => {
      toast.success(t("capa.created"))
      setCapaDialog(false)
      setCapaForm({ description: "", assignedTo: "", dueDate: "" })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DEVIATION] })
    },
    onError: () => toast.error(t("capa.createFailed")),
  })

  const handleCreateCapa = () => {
    setSubmittedCapaForm(true)

    if (
      !dev ||
      !capaForm.description ||
      !capaForm.assignedTo ||
      !capaForm.dueDate
    ) {
      toast.error(t("capa.fillAllFields"))
      return
    }

    createCapa({ deviationId: dev.id, ...capaForm })
  }

  const { mutate: updateCapaStatus, isPending: isUpdatingCapaStatus } =
    useUpdateCapaStatus({
      onSuccess: () => {
        toast.success(t("capa.updated"))
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DEVIATION] })
      },
      onError: () => toast.error(t("capa.updateFailed")),
    })

  const { mutate: updateDeviation, isPending: isUpdatingDeviation } =
    useUpdateDeviation({
      onSuccess: () => {
        toast.success(t("deviations.deviationUpdated"))
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DEVIATION] })
        setIsEditingRationale(false)
      },
      onError: () => toast.error(t("deviations.deviationUpdateFailed")),
    })

  const handleSeverityChange = (value: string) => {
    if (!dev) return
    const severity = value === "unclassified" ? null : value
    updateDeviation({ id: dev.id, severity })
  }

  const handleStartEditRationale = () => {
    if (!dev) return
    setRationaleText(dev.severityRationale ?? "")
    setIsEditingRationale(true)
  }

  const handleSaveRationale = () => {
    if (!dev) return
    updateDeviation({ id: dev.id, severityRationale: rationaleText || null })
  }

  if (isLoadingDev)
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-[400px]" />
      </div>
    )
  if (!dev) return <div>Not found</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="mr-1 h-4 w-4" />
          {t("common.back")}
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="font-mono text-2xl font-bold">
              {dev.deviationNumber}
            </h1>
            {dev.severity && (
              <Badge variant={getSeverityVariant(dev.severity)}>
                {getSeverityLabel(dev.severity, t)}
              </Badge>
            )}
            <Badge variant="outline">{getStatusLabel(dev.status, t)}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {dev.site.name} ({dev.site.code}) · {dev.site.location}
          </p>
        </div>
        <Button
          onClick={() =>
            classifyDeviation({ deviationId: dev.id, locale: i18n.language })
          }
          disabled={isClassifying}
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

      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">{t("deviations.details")}</TabsTrigger>
          <TabsTrigger value="capa">
            {t("deviations.capas")} ({dev.capas.length})
          </TabsTrigger>
          <TabsTrigger value="ai">
            {t("ai.classificationHistory")} ({dev.aiClassifications.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
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
                  <p className="font-mono">{dev.patientId}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">
                    {t("deviations.category")}
                  </Label>
                  <p>{getCategoryLabel(dev.category, t)}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">
                    {t("deviations.deviationDate")}
                  </Label>
                  <p>{new Date(dev.deviationDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">
                    {t("deviations.reportedAt")}
                  </Label>
                  <p>{new Date(dev.reportedAt).toLocaleDateString()}</p>
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
                    dev.severity && (
                      <Badge variant={getSeverityVariant(dev.severity)}>
                        {getSeverityLabel(dev.severity, t)}
                      </Badge>
                    )
                  ) : (
                    <>
                      <Label className="text-xs text-muted-foreground">
                        {t("deviations.severity")}
                      </Label>
                      <div className="mt-1">
                        <Select
                          value={dev.severity ?? "unclassified"}
                          onValueChange={handleSeverityChange}
                          disabled={isUpdatingDeviation}
                        >
                          <SelectTrigger>
                            <SelectValue>
                              <span className="text-muted-foreground">
                                {getSeverityLabel(
                                  dev.severity || "unclassified",
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
                      {dev.severityRationale || (
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
              <p className="text-sm leading-relaxed">{dev.description}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="capa" className="space-y-4">
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
              <Dialog open={capaDialog} onOpenChange={setCapaDialog}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <PlusCircle className="mr-1 h-3 w-3" />
                    {t("capa.addCapa")}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t("capa.newCapa")}</DialogTitle>
                    <DialogDescription>{t("capa.addAction")}</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label
                        className={
                          capaFormErrors.description ? "text-destructive" : ""
                        }
                      >
                        {t("capa.description")} *
                      </Label>
                      <Textarea
                        value={capaForm.description}
                        onChange={(e) =>
                          setCapaForm({
                            ...capaForm,
                            description: e.target.value,
                          })
                        }
                        rows={3}
                        className={
                          capaFormErrors.description
                            ? "border-destructive ring-destructive"
                            : ""
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        className={
                          capaFormErrors.assignedTo ? "text-destructive" : ""
                        }
                      >
                        {t("capa.assignedTo")} *
                      </Label>
                      <Input
                        value={capaForm.assignedTo}
                        onChange={(e) =>
                          setCapaForm({
                            ...capaForm,
                            assignedTo: e.target.value,
                          })
                        }
                        placeholder={t("capa.assignedToPlaceholder")}
                        className={
                          capaFormErrors.assignedTo
                            ? "border-destructive ring-destructive"
                            : ""
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        className={
                          capaFormErrors.dueDate ? "text-destructive" : ""
                        }
                      >
                        {t("capa.dueDate")} *
                      </Label>
                      <Input
                        type="date"
                        value={capaForm.dueDate}
                        onChange={(e) =>
                          setCapaForm({ ...capaForm, dueDate: e.target.value })
                        }
                        min={getIsoFormattedLocalDate(new Date())}
                        className={
                          capaFormErrors.dueDate
                            ? "border-destructive ring-destructive"
                            : ""
                        }
                      />
                    </div>
                    <Button
                      onClick={handleCreateCapa}
                      className="w-full"
                      disabled={isCreatingCapa}
                    >
                      {t("capa.createCapa")}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          {dev.capas.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                {t("capa.noCAPAs")}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {dev.capas.map((capa) => (
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
        </TabsContent>

        <TabsContent value="ai" className="space-y-4">
          <h3 className="text-lg font-semibold">
            {t("ai.classificationHistory")}
          </h3>
          {dev.aiClassifications.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                {t("ai.noClassifications")}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {dev.aiClassifications.map((c) => (
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
        </TabsContent>
      </Tabs>
    </div>
  )
}
