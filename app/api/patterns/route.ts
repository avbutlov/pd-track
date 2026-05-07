import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const results = await prisma.patternAnalysisResult.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(results);
}
