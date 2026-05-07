import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  // Total deviations
  const totalDeviations = await prisma.deviation.count();
  const openDeviations = await prisma.deviation.count({ where: { status: "open" } });
  const majorDeviations = await prisma.deviation.count({ where: { severity: "major" } });
  const activeCAPAs = await prisma.cAPA.count({
    where: { status: { in: ["pending", "in_progress"] } },
  });
  const overdueCAPAs = await prisma.cAPA.count({ where: { status: "overdue" } });

  // Deviations by site
  const bySite = await prisma.deviation.groupBy({
    by: ["siteId"],
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
  });

  const sites = await prisma.site.findMany();
  const siteMap = Object.fromEntries(sites.map((s) => [s.id, s]));

  const deviationsBySite = bySite.map((item) => ({
    siteId: item.siteId,
    siteName: siteMap[item.siteId]?.name || "Unknown",
    siteCode: siteMap[item.siteId]?.code || "Unknown",
    count: item._count.id,
  }));

  // Deviations by category
  const byCategory = await prisma.deviation.groupBy({
    by: ["category"],
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
  });

  const deviationsByCategory = byCategory.map((item) => ({
    category: item.category,
    count: item._count.id,
  }));

  // Deviations by severity
  const bySeverity = await prisma.deviation.groupBy({
    by: ["severity"],
    _count: { id: true },
  });

  const deviationsBySeverity = bySeverity.map((item) => ({
    severity: item.severity || "unclassified",
    count: item._count.id,
  }));

  // Deviations by status
  const byStatus = await prisma.deviation.groupBy({
    by: ["status"],
    _count: { id: true },
  });

  const deviationsByStatus = byStatus.map((item) => ({
    status: item.status,
    count: item._count.id,
  }));

  // Monthly trend (last 12 months)
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

  const recentDeviations = await prisma.deviation.findMany({
    where: { deviationDate: { gte: twelveMonthsAgo } },
    select: { deviationDate: true, severity: true },
    orderBy: { deviationDate: "asc" },
  });

  const monthlyTrend: Record<string, { total: number; major: number; minor: number }> = {};
  recentDeviations.forEach((d) => {
    const month = d.deviationDate.toISOString().slice(0, 7);
    if (!monthlyTrend[month]) monthlyTrend[month] = { total: 0, major: 0, minor: 0 };
    monthlyTrend[month].total++;
    if (d.severity === "major") monthlyTrend[month].major++;
    if (d.severity === "minor") monthlyTrend[month].minor++;
  });

  const trend = Object.entries(monthlyTrend)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, data]) => ({ month, ...data }));

  // Recent deviations
  const recentList = await prisma.deviation.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { site: true },
  });

  return NextResponse.json({
    kpi: {
      totalDeviations,
      openDeviations,
      majorDeviations,
      activeCAPAs,
      overdueCAPAs,
    },
    deviationsBySite,
    deviationsByCategory,
    deviationsBySeverity,
    deviationsByStatus,
    monthlyTrend: trend,
    recentDeviations: recentList,
  });
}
