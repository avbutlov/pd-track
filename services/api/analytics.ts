import { AnalyticsDTO } from "@/lib/types"

export async function fetchAnalytics(): Promise<AnalyticsDTO> {
  const res = await fetch(`/api/analytics`)
  if (!res.ok) throw new Error("Failed to fetch analytics")
  return res.json()
}
