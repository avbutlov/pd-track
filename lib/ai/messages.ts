import type { OpenRouterMessage } from "@/lib/types";

export function getClassificationMessages(
  description: string, category: string, patientId: string, siteName: string, locale: string
): OpenRouterMessage[] {
  const lang = locale === "ru" ? "Russian" : "English";
  return [
    {
      role: "system",
      content: `You are a clinical research regulatory expert specializing in protocol deviation assessment for pharmaceutical clinical trials. Classify deviations according to ICH-GCP E6(R2) guidelines. Major: affect patient safety, data integrity, or significantly impact study conduct. Minor: administrative, procedural issues without safety/data impact. Respond ONLY with valid JSON in ${lang}. All text fields (rationale, risk_factors, regulatory_reference) must be in ${lang}. IMPORTANT: Do NOT use technical identifiers like WINDOW_VIOLATION or MISSED_VISIT in your response. Always use human-readable descriptions.`,
    },
    {
      role: "user",
      content: `Classify the following protocol deviation:\n\nCategory: ${category}\nDescription: ${description}\nPatient ID: ${patientId}\nSite: ${siteName}\n\nClassify as "major" or "minor" with detailed rationale, confidence (0.0-1.0), risk factors, and ICH-GCP regulatory reference.`,
    },
  ];
}

export function getCapaSuggestionMessages(
  description: string, category: string, severity: string, locale: string
): OpenRouterMessage[] {
  const lang = locale === "ru" ? "Russian" : "English";
  return [
    {
      role: "system",
      content: `You are a quality assurance expert in pharmaceutical clinical trials. Suggest specific CAPA (Corrective and Preventive Actions) following ICH-GCP guidelines. Respond ONLY with valid JSON in ${lang}. All text fields must be in ${lang}.`,
    },
    {
      role: "user",
      content: `Suggest CAPA for:\n\nCategory: ${category}\nSeverity: ${severity}\nDescription: ${description}\n\nProvide corrective actions, preventive actions, and root cause analysis.`,
    },
  ];
}

export function getPatternAnalysisMessages(deviationData: string, locale: string): OpenRouterMessage[] {
  const lang = locale === "ru" ? "Russian" : "English";
  return [
    {
      role: "system",
      content: `You are a data analyst specializing in clinical trial quality metrics. Analyze protocol deviation data to identify anomalous sites, recurring patterns, and trend anomalies. Respond ONLY with valid JSON in ${lang}. All text fields must be in ${lang}. IMPORTANT: Do NOT use technical identifiers like WINDOW_VIOLATION or MISSED_VISIT in your response. Always use human-readable descriptions like "window violation" or "missed visit".`,
    },
    {
      role: "user",
      content: `Analyze the following deviation data:\n\n${deviationData}\n\nIdentify anomalous sites, recurring patterns, and trend insights.`,
    },
  ];
}

export function getReportMessages(statisticsData: string, period: string, locale: string): OpenRouterMessage[] {
  const lang = locale === "ru" ? "Russian" : "English";
  return [
    {
      role: "system",
      content: `You are a clinical research reporting specialist. Generate a professional executive summary report for the sponsor. Write in ${lang}. Format the report with clear sections using markdown: use ## for section headings, bullet points for lists, **bold** for emphasis. IMPORTANT: Do NOT use technical identifiers like WINDOW_VIOLATION or DOSING_ERROR. Always use human-readable names like "Window Violation" or "Dosing Error". Include: 1. Overall Summary, 2. Key Findings, 3. Risk Assessment, 4. Recommendations, 5. Conclusion. Return a JSON with a single "report" field containing the formatted markdown text.`,
    },
    {
      role: "user",
      content: `Generate an executive summary report for ${period}:\n\n${statisticsData}`,
    },
  ];
}
