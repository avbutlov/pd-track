import {
  CAPAStatus,
  DeviationCategory,
  DeviationStatus,
} from "@/generated/prisma/enums"
import { DeviationSeverity } from "@/lib/types/deviation"

type TranslationFn = (key: string) => string

export const CATEGORY_KEYS = [
  "MISSED_VISIT",
  "WINDOW_VIOLATION",
  "DOSING_ERROR",
  "ICF_ISSUE",
  "SAMPLE_HANDLING",
  "ELIGIBILITY",
  "PROCEDURE_DEVIATION",
  "DOCUMENTATION",
  "OTHER",
] as const

export const STATUS_KEYS = [
  "open",
  "in_review",
  "capa_assigned",
  "closed",
] as const

export function getCategoryLabel(
  category: DeviationCategory,
  t: TranslationFn
): string {
  const value = t(`categories.${category}`)
  return value === `categories.${category}` ? formatEnumLabel(category) : value
}

export function getStatusLabel(
  status: DeviationStatus,
  t: TranslationFn
): string {
  const value = t(`statuses.${status}`)
  return value === `statuses.${status}` ? formatEnumLabel(status) : value
}

export function getSeverityLabel(
  severity: DeviationSeverity | "unclassified",
  t: TranslationFn
): string {
  const value = t(`severities.${severity}`)
  return value === `severities.${severity}` ? formatEnumLabel(severity) : value
}

export function getCapaStatusLabel(
  status: CAPAStatus,
  t: TranslationFn
): string {
  const value = t(`capaStatuses.${status}`)
  return value === `capaStatuses.${status}` ? formatEnumLabel(status) : value
}

export function formatEnumLabel(value: string): string {
  return value
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

export function getMonthLabel(monthStr: string, t: TranslationFn): string {
  const monthIndex = parseInt(monthStr.split("-")[1]) - 1
  const value = t(`months.${monthIndex}`)
  return value === `months.${monthIndex}` ? monthStr : value
}

export function getSeverityVariant(
  severity: DeviationSeverity | null
): "destructive" | "secondary" | "outline" {
  if (severity === "major") return "destructive"
  if (severity === "minor") return "secondary"
  return "outline"
}

export function getCapaStatusVariant(
  status: CAPAStatus
): "default" | "destructive" | "secondary" {
  if (status === "completed") return "default"
  if (status === "overdue") return "destructive"
  return "secondary"
}
