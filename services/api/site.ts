import { SiteDTO } from "@/lib/types"

export async function fetchSites(): Promise<SiteDTO[]> {
  const res = await fetch(`/api/sites`)
  if (!res.ok) throw new Error("Failed to fetch sites")
  return res.json()
}
