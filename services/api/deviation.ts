import { DeviationDetailDTO, DeviationListResponse } from "@/lib/types"

export async function fetchDeviations(
  params: Record<string, string>
): Promise<DeviationListResponse> {
  const search = new URLSearchParams(params)
  const res = await fetch(`/api/deviations?${search}`)
  if (!res.ok) throw new Error("Failed to fetch deviations")
  return res.json()
}

export async function fetchDeviation(
  id: number | string
): Promise<DeviationDetailDTO> {
  const res = await fetch(`/api/deviations/${id}`)
  if (!res.ok) throw new Error("Failed to fetch deviation")
  return res.json()
}

export async function createDeviation(data: {
  siteId: string
  patientId: string
  deviationDate: string
  description: string
  category: string
}): Promise<DeviationDetailDTO> {
  const res = await fetch(`/api/deviations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Failed to create deviation")
  return res.json()
}

export async function classifyDeviation(
  deviationId: number,
  locale: string
): Promise<unknown> {
  const res = await fetch(`/api/ai/classify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ deviationId, locale }),
  })
  if (!res.ok) throw new Error("Classification failed")
  return res.json()
}

export async function updateDeviation(
  id: number,
  data: { severity?: string | null; severityRationale?: string | null; status?: string; description?: string; category?: string }
): Promise<DeviationDetailDTO> {
  const res = await fetch(`/api/deviations/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Failed to update deviation")
  return res.json()
}
