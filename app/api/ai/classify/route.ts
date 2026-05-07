import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { HttpStatus } from "@/constants";
import { classifyDeviation } from "@/lib/ai/openrouter";
import { DEFAULT_AI_MODEL } from "@/constants";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { deviationId, locale = "en" } = body;

  const deviation = await prisma.deviation.findUnique({ where: { id: deviationId }, include: { site: true } });
  if (!deviation) return NextResponse.json({ error: "Deviation not found" }, { status: HttpStatus.NOT_FOUND });

  try {
    const classification = await classifyDeviation(deviation.description, deviation.category, deviation.patientId, deviation.site.name, locale);

    const saved = await prisma.aIClassification.create({
      data: { deviationId: deviation.id, severity: classification.severity === "major" ? "major" : "minor", rationale: classification.rationale, confidence: classification.confidence, riskFactors: classification.risk_factors, regulatoryRef: classification.regulatory_reference, modelUsed: DEFAULT_AI_MODEL },
    });

    await prisma.deviation.update({ where: { id: deviation.id }, data: { severity: classification.severity === "major" ? "major" : "minor", severityRationale: classification.rationale, status: deviation.status === "open" ? "in_review" : deviation.status } });

    return NextResponse.json({ classification: saved, result: classification });
  } catch (error) {
    console.error("AI Classification error:", error);
    return NextResponse.json({ error: "AI classification failed", details: String(error) }, { status: HttpStatus.INTERNAL_SERVER_ERROR });
  }
}
