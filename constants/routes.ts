export const ROUTES = {
  HOME: "/",
  DEVIATIONS: "/deviations",
  DEVIATION_NEW: "/deviations/new",
  DEVIATION_DETAIL: (id: number | string) => `/deviations/${id}` as const,
  ANALYTICS: "/analytics",
  ANALYTICS_PATTERNS: "/analytics/patterns",
  REPORTS: "/reports",
} as const;
