import type { JsonSchema } from "@/lib/types";

export const CLASSIFICATION_SCHEMA: JsonSchema = {
  name: "deviation_classification",
  strict: true,
  schema: {
    type: "object",
    properties: {
      severity: { type: "string", enum: ["major", "minor"] },
      confidence: { type: "number" },
      rationale: { type: "string" },
      risk_factors: { type: "array", items: { type: "string" } },
      regulatory_reference: { type: "string" },
    },
    required: ["severity", "confidence", "rationale", "risk_factors", "regulatory_reference"],
    additionalProperties: false,
  },
};

export const CAPA_SUGGESTION_SCHEMA: JsonSchema = {
  name: "capa_suggestion",
  strict: true,
  schema: {
    type: "object",
    properties: {
      corrective_actions: {
        type: "array",
        items: { type: "object", properties: { description: { type: "string" }, priority: { type: "string", enum: ["high", "medium", "low"] }, timeline: { type: "string" } }, required: ["description", "priority", "timeline"], additionalProperties: false },
      },
      preventive_actions: {
        type: "array",
        items: { type: "object", properties: { description: { type: "string" }, priority: { type: "string", enum: ["high", "medium", "low"] }, timeline: { type: "string" } }, required: ["description", "priority", "timeline"], additionalProperties: false },
      },
      root_cause_analysis: { type: "string" },
    },
    required: ["corrective_actions", "preventive_actions", "root_cause_analysis"],
    additionalProperties: false,
  },
};

export const PATTERN_ANALYSIS_SCHEMA: JsonSchema = {
  name: "pattern_analysis",
  strict: true,
  schema: {
    type: "object",
    properties: {
      anomalous_sites: {
        type: "array",
        items: { type: "object", properties: { site_name: { type: "string" }, site_code: { type: "string" }, deviation_count: { type: "number" }, anomaly_description: { type: "string" }, severity_level: { type: "string", enum: ["high", "medium", "low"] } }, required: ["site_name", "site_code", "deviation_count", "anomaly_description", "severity_level"], additionalProperties: false },
      },
      recurring_patterns: {
        type: "array",
        items: { type: "object", properties: { pattern: { type: "string" }, affected_sites: { type: "array", items: { type: "string" } }, frequency: { type: "number" }, recommendation: { type: "string" } }, required: ["pattern", "affected_sites", "frequency", "recommendation"], additionalProperties: false },
      },
      trend_insights: { type: "array", items: { type: "string" } },
    },
    required: ["anomalous_sites", "recurring_patterns", "trend_insights"],
    additionalProperties: false,
  },
};
