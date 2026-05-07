"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { PlusCircle } from "lucide-react"
import { useTranslation } from "react-i18next"
import { getIsoFormattedLocalDate } from "@/lib/utils/date"

interface CapaFormData {
  description: string
  assignedTo: string
  dueDate: string
}

interface CreateCapaDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  form: CapaFormData
  onFormChange: (form: CapaFormData) => void
  onSubmit: () => void
  isCreating: boolean
  formErrors: {
    description: boolean
    assignedTo: boolean
    dueDate: boolean
  }
}

export function CreateCapaDialog({
  open,
  onOpenChange,
  form,
  onFormChange,
  onSubmit,
  isCreating,
  formErrors,
}: CreateCapaDialogProps) {
  const { t } = useTranslation()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                formErrors.description ? "text-destructive" : ""
              }
            >
              {t("capa.description")} *
            </Label>
            <Textarea
              value={form.description}
              onChange={(e) =>
                onFormChange({
                  ...form,
                  description: e.target.value,
                })
              }
              rows={3}
              className={
                formErrors.description
                  ? "border-destructive ring-destructive"
                  : ""
              }
            />
          </div>
          <div className="space-y-2">
            <Label
              className={
                formErrors.assignedTo ? "text-destructive" : ""
              }
            >
              {t("capa.assignedTo")} *
            </Label>
            <Input
              value={form.assignedTo}
              onChange={(e) =>
                onFormChange({
                  ...form,
                  assignedTo: e.target.value,
                })
              }
              placeholder={t("capa.assignedToPlaceholder")}
              className={
                formErrors.assignedTo
                  ? "border-destructive ring-destructive"
                  : ""
              }
            />
          </div>
          <div className="space-y-2">
            <Label
              className={
                formErrors.dueDate ? "text-destructive" : ""
              }
            >
              {t("capa.dueDate")} *
            </Label>
            <Input
              type="date"
              value={form.dueDate}
              onChange={(e) =>
                onFormChange({ ...form, dueDate: e.target.value })
              }
              min={getIsoFormattedLocalDate(new Date())}
              className={
                formErrors.dueDate
                  ? "border-destructive ring-destructive"
                  : ""
              }
            />
          </div>
          <Button
            onClick={onSubmit}
            className="w-full"
            disabled={isCreating}
          >
            {t("capa.createCapa")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
