import { PatternAnalysisResultDTO } from "@/lib/types"

export async function analyzePatterns(
  locale: string
): Promise<PatternAnalysisResultDTO> {
  const res = await fetch(`/api/ai/patterns`, {
    method: "POST",
    body: JSON.stringify({ locale }),
  })
  if (!res.ok) throw new Error("Pattern analysis failed")
  return res.json()
}

export async function fetchPatternResults(): Promise<PatternAnalysisResultDTO[]> {
  const res = await fetch(`/api/patterns`)
  if (!res.ok) throw new Error("Failed to fetch pattern results")
  return res.json()
}
