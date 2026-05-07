import { OPENROUTER_API_URL, DEFAULT_AI_MODEL, APP_REFERER, APP_TITLE } from "@/constants";
import type { OpenRouterMessage, OpenRouterResponse, JsonSchema, ClassificationResult, CAPASuggestion, PatternAnalysis } from "@/lib/types";
import { CLASSIFICATION_SCHEMA, CAPA_SUGGESTION_SCHEMA, PATTERN_ANALYSIS_SCHEMA } from "./schemas";
import { getClassificationMessages, getCapaSuggestionMessages, getPatternAnalysisMessages, getReportMessages } from "./messages";

async function callOpenRouter(messages: OpenRouterMessage[], model = DEFAULT_AI_MODEL, jsonSchema?: JsonSchema): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OPENROUTER_API_KEY is not set");

  const body: Record<string, unknown> = { model, messages, temperature: 0.3, max_tokens: 2000 };
  body.response_format = jsonSchema ? { type: "json_schema", json_schema: jsonSchema } : { type: "json_object" };

  const response = await fetch(OPENROUTER_API_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json", "HTTP-Referer": APP_REFERER, "X-OpenRouter-Title": APP_TITLE },
    body: JSON.stringify(body),
  });

  if (!response.ok) { const t = await response.text(); throw new Error(`OpenRouter API error: ${response.status} — ${t}`); }
  const data: OpenRouterResponse = await response.json();
  const content = data.choices[0]?.message?.content;
  if (!content) throw new Error("OpenRouter returned empty response");
  return content;
}

export async function classifyDeviation(description: string, category: string, patientId: string, siteName: string, locale = "en"): Promise<ClassificationResult> {
  const result = await callOpenRouter(getClassificationMessages(description, category, patientId, siteName, locale), DEFAULT_AI_MODEL, CLASSIFICATION_SCHEMA);
  return JSON.parse(result);
}

export async function suggestCAPA(description: string, category: string, severity: string, locale = "en"): Promise<CAPASuggestion> {
  const result = await callOpenRouter(getCapaSuggestionMessages(description, category, severity, locale), DEFAULT_AI_MODEL, CAPA_SUGGESTION_SCHEMA);
  return JSON.parse(result);
}

export async function analyzePatterns(deviationData: string, locale = "en"): Promise<PatternAnalysis> {
  const result = await callOpenRouter(getPatternAnalysisMessages(deviationData, locale), DEFAULT_AI_MODEL, PATTERN_ANALYSIS_SCHEMA);
  return JSON.parse(result);
}

export async function generateReport(statisticsData: string, period: string, locale = "en"): Promise<string> {
  const result = await callOpenRouter(getReportMessages(statisticsData, period, locale));
  const parsed = JSON.parse(result);
  return parsed.report || parsed.summary || result;
}
