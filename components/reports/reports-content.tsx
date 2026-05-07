"use client"

import { useState } from "react"
import ReactMarkdown from "react-markdown"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { FileText, Loader2, Download, Clock } from "lucide-react"
import type { ReportDTO } from "@/lib/types"
import { ReportPdfDocument } from "@/components/reports/pdf-report"
import { pdf } from "@react-pdf/renderer"
import { useTranslation } from "react-i18next"
import { useFetchReports, useGenerateReport } from "@/services/query/report"
import { QUERY_KEYS } from "@/services/query/query-keys"
import { useQueryClient } from "@tanstack/react-query"
import { getIsoFormattedLocalDate } from "@/lib/utils/date"

async function exportToPdf(report: ReportDTO) {
  const blob = await pdf(
    <ReportPdfDocument
      title={report.title}
      content={report.content}
      startDate={report.startDate}
      endDate={report.endDate}
    />
  ).toBlob()

  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `${report.title.replace(/[^а-яА-ЯёЁa-zA-Z0-9]/g, "_")}.pdf`
  a.click()
  URL.revokeObjectURL(url)
  toast.success("PDF exported")
}

const getDateMonthBefore = () => {
  const date = new Date()
  const month = date.getMonth()
  const year = date.getFullYear()

  if (month === 0) {
    date.setFullYear(year - 1)
    date.setMonth(11)
  } else {
    date.setMonth(date.getMonth() - 1)
  }

  return getIsoFormattedLocalDate(date)
}

export function ReportsContent() {
  const { t, i18n } = useTranslation()
  const [selectedReport, setSelectedReport] = useState<ReportDTO | null>(null)
  const [startDate, setStartDate] = useState(getDateMonthBefore())
  const [endDate, setEndDate] = useState(getIsoFormattedLocalDate(new Date()))

  const queryClient = useQueryClient()

  const { data: reports = [], isLoading: isLoadingReports } = useFetchReports()

  const { mutate: generateReport, isPending: isGeneratingReport } =
    useGenerateReport({
      onSuccess: (reportData) => {
        toast.success(t("reports.generated"))
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.REPORT] })

        if (!selectedReport) {
          setSelectedReport(reportData.report)
        }
      },
      onError: () => toast.error(t("reports.generateFailed")),
    })

  const renderReports = () => {
    if (isLoadingReports) {
      return (
        <div className="space-y-2">
          {[...Array(5)].map((_, index) => (
            <Skeleton key={index} className="h-16.5" />
          ))}
        </div>
      )
    }

    if (reports.length === 0)
      return (
        <p className="text-sm text-muted-foreground">
          {t("reports.noReports")}
        </p>
      )

    return (
      <div className="space-y-2">
        {reports.map((r) => (
          <button
            key={r.id}
            onClick={() => setSelectedReport(r)}
            className={`w-full cursor-pointer rounded-lg border p-3 text-left text-sm transition-colors hover:bg-muted/50 ${selectedReport?.id === r.id ? "border-primary bg-muted/30" : ""}`}
          >
            <div className="truncate font-medium">{r.title}</div>
            <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {new Date(r.createdAt).toLocaleString()}
            </div>
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {t("reports.title")}
        </h1>
        <p className="text-muted-foreground">{t("reports.subtitle")}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("reports.parameters")}</CardTitle>
          <CardDescription>{t("reports.selectPeriod")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-4">
            <div className="space-y-2">
              <Label>{t("reports.startDate")}</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                max={getIsoFormattedLocalDate(new Date())}
              />
            </div>
            <div className="space-y-2">
              <Label>{t("reports.endDate")}</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                max={getIsoFormattedLocalDate(new Date())}
              />
            </div>
            <Button
              onClick={() =>
                generateReport({ startDate, endDate, locale: i18n.language })
              }
              disabled={isGeneratingReport}
            >
              {isGeneratingReport ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <FileText className="mr-2 h-4 w-4" />
              )}
              {isGeneratingReport
                ? t("reports.generating")
                : t("reports.generate")}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">
              {t("reports.savedReports")}
            </CardTitle>
          </CardHeader>
          <CardContent>{renderReports()}</CardContent>
        </Card>

        {/* Selected report view */}
        <div className="md:col-span-2">
          {selectedReport ? (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>{selectedReport.title}</CardTitle>
                  <CardDescription>
                    {t("reports.period")}:{" "}
                    {new Date(selectedReport.startDate).toLocaleDateString()} —{" "}
                    {new Date(selectedReport.endDate).toLocaleDateString()}
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => exportToPdf(selectedReport)}
                >
                  <Download className="mr-1 h-3 w-3" />
                  {t("reports.exportPdf")}
                </Button>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none rounded-lg border bg-muted/20 p-6">
                  <ReactMarkdown>{selectedReport.content}</ReactMarkdown>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              {isGeneratingReport ? (
                <Skeleton className="mx-4 h-66.5" />
              ) : (
                <CardContent className="py-16 text-center">
                  <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                  <h3 className="mb-1 text-lg font-semibold">
                    {t("reports.generate")}
                  </h3>
                  <p className="text-muted-foreground">
                    {t("reports.generateDescription")}
                  </p>
                </CardContent>
              )}
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
