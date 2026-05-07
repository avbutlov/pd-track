import {
  CAPAStatus,
  DeviationCategory,
  DeviationStatus,
} from "@/generated/prisma/enums"
import { DeviationSeverity } from "@/lib/types/deviation"

export interface SiteDTO {
  id: number
  name: string
  code: string
  location: string
  createdAt: string
  _count?: { deviations: number }
}

export interface DeviationDTO {
  id: number
  deviationNumber: string
  siteId: number
  patientId: string
  deviationDate: string
  description: string
  category: DeviationCategory
  severity: DeviationSeverity | null
  severityRationale: string | null
  status: DeviationStatus
  reportedAt: string
  createdAt: string
  site: Pick<SiteDTO, "id" | "name" | "code" | "location">
  _count?: { capas: number; aiClassifications: number }
}

export interface DeviationDetailDTO extends DeviationDTO {
  capas: CAPADTO[]
  aiClassifications: AIClassificationDTO[]
}

export interface CAPADTO {
  id: number
  deviationId: number
  description: string
  assignedTo: string
  dueDate: string
  status: CAPAStatus
  completionNotes: string | null
  completedAt: string | null
  createdAt: string
}

export interface AIClassificationDTO {
  id: number
  deviationId: number
  severity: DeviationSeverity
  rationale: string
  confidence: number
  riskFactors: string[]
  regulatoryRef: string | null
  modelUsed: string
  createdAt: string
}

export interface PaginationDTO {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface DeviationListResponse {
  deviations: DeviationDTO[]
  pagination: PaginationDTO
}

export interface AnalyticsDTO {
  kpi: {
    totalDeviations: number
    openDeviations: number
    majorDeviations: number
    activeCAPAs: number
    overdueCAPAs: number
  }
  deviationsBySite: Array<{
    siteId: number
    siteCode: string
    siteName: string
    count: number
  }>
  deviationsByCategory: Array<{ category: DeviationCategory; count: number }>
  deviationsBySeverity: Array<{ severity: DeviationSeverity; count: number }>
  deviationsByStatus: Array<{ status: DeviationStatus; count: number }>
  monthlyTrend: Array<{
    month: string
    total: number
    major: number
    minor: number
  }>
  recentDeviations: DeviationDTO[]
}

export interface ReportDTO {
  id: number
  title: string
  content: string
  startDate: string
  endDate: string
  locale: string
  statistics: unknown
  createdAt: string
}

export interface PatternAnalysisResultDTO {
  id: number
  data: {
    anomalous_sites: Array<{
      site_name: string
      site_code: string
      deviation_count: number
      anomaly_description: string
      severity_level: "high" | "medium" | "low"
    }>
    recurring_patterns: Array<{
      pattern: string
      affected_sites: string[]
      frequency: number
      recommendation: string
    }>
    trend_insights: string[]
  }
  locale: string
  createdAt: string
}
