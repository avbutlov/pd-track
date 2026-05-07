import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { analyzePatterns } from "@/lib/ai/openrouter";
import { HttpStatus } from "@/constants";
import { formatEnumLabel } from "@/lib/utils/deviation";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const locale = body?.locale || "en";

    const bySite = await prisma.deviation.groupBy({ by: ["siteId", "category"], _count: { id: true } });
    const sites = await prisma.site.findMany();
    const siteMap = Object.fromEntries(sites.map(s => [s.id, s]));

    const deviationData = bySite.map(item => {
      const site = siteMap[item.siteId];
      return `Site: ${site?.name} (${site?.code}), Category: ${formatEnumLabel(item.category)}, Count: ${item._count.id}`;
    }).join("\n");

    const monthlyData = await prisma.deviation.groupBy({ by: ["siteId"], _count: { id: true }, orderBy: { _count: { id: "desc" } } });
    const totalSummary = monthlyData.map(item => { const site = siteMap[item.siteId]; return `${site?.code}: ${item._count.id} total deviations`; }).join("\n");
    const fullData = `=== Deviations by Site and Category ===\n${deviationData}\n\n=== Total Deviations by Site ===\n${totalSummary}`;

    const patterns = await analyzePatterns(fullData, locale);

    // Save analysis result to DB
    const saved = await prisma.patternAnalysisResult.create({
      data: {
        data: JSON.parse(JSON.stringify(patterns)),
        locale,
      },
    });

    return NextResponse.json(saved);
  } catch (error) {
    console.error("AI Pattern analysis error:", error);
    return NextResponse.json({ error: "Pattern analysis failed", details: String(error) }, { status: HttpStatus.INTERNAL_SERVER_ERROR });
  }
}
