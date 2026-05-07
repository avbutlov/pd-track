export type DeviationStatus = "open" | "in_review" | "capa_assigned" | "closed"

export enum DeviationCategory {
  MISSED_VISIT = "MISSED_VISIT",
  WINDOW_VIOLATION = "WINDOW_VIOLATION",
  DOSING_ERROR = "DOSING_ERROR",
  ICF_ISSUE = "ICF_ISSUE",
  SAMPLE_HANDLING = "SAMPLE_HANDLING",
  ELIGIBILITY = "ELIGIBILITY",
  PROCEDURE_DEVIATION = "PROCEDURE_DEVIATION",
  DOCUMENTATION = "DOCUMENTATION",
  OTHER = "OTHER",
}

export type DeviationSeverity = "major" | "minor"
