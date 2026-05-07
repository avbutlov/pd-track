/** OpenRouter message role */
export type OpenRouterRole = "system" | "user" | "assistant";

export interface OpenRouterMessage {
  role: OpenRouterRole;
  content: string;
}

export interface OpenRouterResponse {
  id: string;
  choices: Array<{
    finish_reason: string | null;
    message: { content: string | null; role: string };
  }>;
  model: string;
  usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
}

/** JSON Schema property definition */
export interface JsonSchemaProperty {
  type: "string" | "number" | "boolean" | "array" | "object";
  enum?: readonly string[];
  items?: JsonSchemaProperty | { type: string };
  properties?: Record<string, JsonSchemaProperty>;
  required?: readonly string[];
  additionalProperties?: boolean;
}

/** JSON Schema wrapper for structured output */
export interface JsonSchema {
  name: string;
  strict: boolean;
  schema: {
    type: "object";
    properties: Record<string, JsonSchemaProperty>;
    required: readonly string[];
    additionalProperties: boolean;
  };
}

export interface ClassificationResult {
  severity: "major" | "minor";
  confidence: number;
  rationale: string;
  risk_factors: string[];
  regulatory_reference: string;
}

export interface CAPASuggestion {
  corrective_actions: Array<{ description: string; priority: "high" | "medium" | "low"; timeline: string }>;
  preventive_actions: Array<{ description: string; priority: "high" | "medium" | "low"; timeline: string }>;
  root_cause_analysis: string;
}

export interface PatternAnalysis {
  anomalous_sites: Array<{ site_name: string; site_code: string; deviation_count: number; anomaly_description: string; severity_level: "high" | "medium" | "low" }>;
  recurring_patterns: Array<{ pattern: string; affected_sites: string[]; frequency: number; recommendation: string }>;
  trend_insights: string[];
}
