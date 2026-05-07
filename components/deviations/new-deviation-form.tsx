"use client"

import { EventHandler, FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { ArrowLeft, Save } from "lucide-react"
import {
  ROUTES,
  PATIENT_ID_MAX_LENGTH,
  DESCRIPTION_MAX_LENGTH,
} from "@/constants"
import { useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { useFetchSites } from "@/services/query/site"
import { QUERY_KEYS } from "@/services/query/query-keys"
import { useCreateDeviation } from "@/services/query/deviation"
import { getIsoFormattedLocalDate } from "@/lib/utils/date"

const CATEGORY_KEYS = [
  "MISSED_VISIT",
  "WINDOW_VIOLATION",
  "DOSING_ERROR",
  "ICF_ISSUE",
  "SAMPLE_HANDLING",
  "ELIGIBILITY",
  "PROCEDURE_DEVIATION",
  "DOCUMENTATION",
  "OTHER",
]

export function NewDeviationForm() {
  const router = useRouter()
  const { t } = useTranslation()
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    siteId: "",
    patientId: "",
    deviationDate: getIsoFormattedLocalDate(new Date()),
    description: "",
    category: "",
  })

  const queryClient = useQueryClient()

  const { data: sites = [] } = useFetchSites()

  const errors = {
    siteId: submitted && !form.siteId,
    patientId: submitted && !form.patientId,
    description: submitted && !form.description,
    deviationDate: submitted && !form.deviationDate,
    category: submitted && !form.category,
  }

  const { mutate: createDeviation, isPending: isCreatingDeviation } =
    useCreateDeviation({
      onSuccess: (dev) => {
        toast.success(`${dev.deviationNumber} ${t("deviations.created")}`)
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.DEVIATION],
        })
        router.push(ROUTES.DEVIATION_DETAIL(dev.id))
      },
    })

  const handleSubmit: EventHandler<FormEvent> = (e) => {
    e.preventDefault()

    setSubmitted(true)

    if (
      !form.siteId ||
      !form.patientId ||
      !form.description ||
      !form.deviationDate ||
      !form.category
    ) {
      toast.error(t("deviations.fillRequired"))
      return
    }

    createDeviation(form)
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="mr-1 h-4 w-4" />
          {t("common.back")}
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("deviations.newDeviation")}
          </h1>
          <p className="text-muted-foreground">{t("deviations.registerNew")}</p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{t("deviations.details")}</CardTitle>
          <CardDescription>{t("deviations.fillDetails")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label className={errors.siteId ? "text-destructive" : ""}>
                  {t("deviations.site")} *
                </Label>
                <Select
                  value={form.siteId}
                  onValueChange={(v) => setForm({ ...form, siteId: v })}
                >
                  <SelectTrigger
                    className={
                      errors.siteId ? "border-destructive ring-destructive" : ""
                    }
                  >
                    <SelectValue placeholder={t("deviations.allSites")} />
                  </SelectTrigger>
                  <SelectContent>
                    {sites.map((s) => (
                      <SelectItem key={s.id} value={String(s.id)}>
                        {s.code} — {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className={errors.patientId ? "text-destructive" : ""}>
                  {t("deviations.patientId")} *
                </Label>
                <Input
                  placeholder="e.g. PAT-01-001"
                  value={form.patientId}
                  maxLength={PATIENT_ID_MAX_LENGTH}
                  className={
                    errors.patientId
                      ? "border-destructive ring-destructive"
                      : ""
                  }
                  onChange={(e) =>
                    setForm({ ...form, patientId: e.target.value })
                  }
                />
                <p className="text-right text-xs text-muted-foreground">
                  {form.patientId.length}/{PATIENT_ID_MAX_LENGTH}
                </p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label
                  className={errors.deviationDate ? "text-destructive" : ""}
                >
                  {t("deviations.deviationDate")} *
                </Label>
                <Input
                  type="date"
                  max={getIsoFormattedLocalDate(new Date())}
                  value={form.deviationDate}
                  onChange={(e) =>
                    setForm({ ...form, deviationDate: e.target.value })
                  }
                  className={
                    errors.deviationDate
                      ? "border-destructive ring-destructive"
                      : ""
                  }
                />
              </div>
              <div className="space-y-2">
                <Label className={errors.category ? "text-destructive" : ""}>
                  {t("deviations.category")} *
                </Label>
                <Select
                  value={form.category}
                  onValueChange={(v) => setForm({ ...form, category: v })}
                >
                  <SelectTrigger
                    className={
                      errors.category
                        ? "border-destructive ring-destructive"
                        : ""
                    }
                  >
                    <SelectValue placeholder={t("deviations.allCategories")} />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORY_KEYS.map((k) => (
                      <SelectItem key={k} value={k}>
                        {t(`categories.${k}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label className={errors.description ? "text-destructive" : ""}>
                {t("deviations.description")} *
              </Label>
              <Textarea
                placeholder={t("deviations.describeDeviation")}
                rows={5}
                value={form.description}
                maxLength={DESCRIPTION_MAX_LENGTH}
                className={
                  errors.description
                    ? "border-destructive ring-destructive"
                    : ""
                }
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
              <p className="text-right text-xs text-muted-foreground">
                {form.description.length}/{DESCRIPTION_MAX_LENGTH}
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                {t("common.cancel")}
              </Button>
              <Button type="submit" disabled={isCreatingDeviation}>
                <Save className="mr-2 h-4 w-4" />
                {isCreatingDeviation
                  ? t("deviations.saving")
                  : t("deviations.registerDeviation")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
