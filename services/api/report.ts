import { ReportDTO } from "@/lib/types"

export async function generateReport(data: {
  startDate: string
  endDate: string
  locale: string
}): Promise<{ report: ReportDTO }> {
  const res = await fetch(`/api/ai/report`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Report generation failed")
  return res.json()
}

export async function fetchReports(): Promise<ReportDTO[]> {
  const res = await fetch(`/api/reports`)
  if (!res.ok) throw new Error("Failed to fetch reports")
  return res.json()
}
