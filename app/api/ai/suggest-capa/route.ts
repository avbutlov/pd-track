import { NextRequest, NextResponse } from "next/server";
import { suggestCAPA } from "@/lib/ai/openrouter";
import { HttpStatus } from "@/constants";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { description, category, severity, locale = "en" } = body;

  try {
    const suggestion = await suggestCAPA(description, category, severity || "unknown", locale);
    return NextResponse.json(suggestion);
  } catch (error) {
    console.error("AI CAPA suggestion error:", error);
    return NextResponse.json({ error: "AI suggestion failed", details: String(error) }, { status: HttpStatus.INTERNAL_SERVER_ERROR });
  }
}
