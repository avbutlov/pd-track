import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateReport } from "@/lib/ai/openrouter";
import { HttpStatus } from "@/constants";
import { formatEnumLabel } from "@/lib/utils/deviation";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { startDate, endDate, locale = "en" } = body;

  try {
    const where: Record<string, unknown> = {};
    if (startDate && endDate) where.deviationDate = { gte: new Date(startDate), lte: new Date(endDate) };

    const total = await prisma.deviation.count({ where });
    const major = await prisma.deviation.count({ where: { ...where, severity: "major" } });
    const minor = await prisma.deviation.count({ where: { ...where, severity: "minor" } });

    const byCategory = await prisma.deviation.groupBy({ by: ["category"], where, _count: { id: true } });
    const bySite = await prisma.deviation.groupBy({ by: ["siteId"], where, _count: { id: true }, orderBy: { _count: { id: "desc" } } });

    const sites = await prisma.site.findMany();
    const siteMap = Object.fromEntries(sites.map(s => [s.id, s]));

    const capas = await prisma.cAPA.count({ where: { deviation: where } });
    const completedCapas = await prisma.cAPA.count({ where: { deviation: where, status: "completed" } });

    const statisticsData = `
Total Deviations: ${total}
Major: ${major} (${total > 0 ? ((major/total)*100).toFixed(1) : 0}%)
Minor: ${minor} (${total > 0 ? ((minor/total)*100).toFixed(1) : 0}%)

By Category:
${byCategory.map(c => `  ${formatEnumLabel(c.category)}: ${c._count.id}`).join("\n")}

By Site (top):
${bySite.slice(0,5).map(s => `  ${siteMap[s.siteId]?.name} (${siteMap[s.siteId]?.code}): ${s._count.id}`).join("\n")}

CAPA Status:
  Total CAPAs: ${capas}
  Completed: ${completedCapas}
  Pending/In Progress: ${capas - completedCapas}
`;

    const period = startDate && endDate ? `${startDate} to ${endDate}` : "All time";
    const reportContent = await generateReport(statisticsData, period, locale);

    // Save report to DB
    const savedReport = await prisma.report.create({
      data: {
        title: `Sponsor Report — ${period}`,
        content: reportContent,
        startDate: new Date(startDate || "2025-01-01"),
        endDate: new Date(endDate || new Date().toISOString()),
        locale,
        statistics: { total, major, minor, byCategory, bySite: bySite.map(s => ({ ...s, siteName: siteMap[s.siteId]?.name, siteCode: siteMap[s.siteId]?.code })), capas, completedCapas },
      },
    });

    return NextResponse.json({ report: savedReport });
  } catch (error) {
    console.error("AI Report generation error:", error);
    return NextResponse.json({ error: "Report generation failed", details: String(error) }, { status: HttpStatus.INTERNAL_SERVER_ERROR });
  }
}
