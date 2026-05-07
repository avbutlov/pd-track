import { CAPASuggestion } from "@/lib/types"

export async function createCapa(data: {
  deviationId: number
  description: string
  assignedTo: string
  dueDate: string
}): Promise<unknown> {
  const res = await fetch(`/api/capa`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Failed to create CAPA")
  return res.json()
}

export async function updateCapaStatus(
  capaId: number,
  status: string
): Promise<unknown> {
  const res = await fetch(`/api/capa/${capaId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  })
  if (!res.ok) throw new Error("Failed to update CAPA")
  return res.json()
}

export async function suggestCapa(data: {
  description: string
  category: string
  severity: string | null
  locale: string
}): Promise<CAPASuggestion> {
  const res = await fetch(`/api/ai/suggest-capa`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Suggestion failed")
  return res.json()
}
