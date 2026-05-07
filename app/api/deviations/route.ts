import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const siteId = searchParams.get("siteId");
  const category = searchParams.get("category");
  const severity = searchParams.get("severity");
  const status = searchParams.get("status");
  const search = searchParams.get("search");

  const where: Record<string, unknown> = {};

  if (siteId) where.siteId = parseInt(siteId);
  if (category) where.category = category;
  if (severity) where.severity = severity;
  if (status) where.status = status;
  if (search) {
    where.OR = [
      { deviationNumber: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { patientId: { contains: search, mode: "insensitive" } },
    ];
  }

  const [deviations, total] = await Promise.all([
    prisma.deviation.findMany({
      where,
      include: {
        site: true,
        _count: { select: { capas: true, aiClassifications: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.deviation.count({ where }),
  ]);

  return NextResponse.json({
    deviations,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  // Generate deviation number
  const lastDeviation = await prisma.deviation.findFirst({
    orderBy: { id: "desc" },
    select: { deviationNumber: true },
  });

  let nextNumber = 1;
  if (lastDeviation) {
    const match = lastDeviation.deviationNumber.match(/PD-\d+-(\d+)/);
    if (match) nextNumber = parseInt(match[1]) + 1;
  }

  const year = new Date().getFullYear();
  const deviationNumber = `PD-${year}-${String(nextNumber).padStart(4, "0")}`;

  const deviation = await prisma.deviation.create({
    data: {
      deviationNumber,
      siteId: parseInt(body.siteId),
      patientId: body.patientId,
      deviationDate: new Date(body.deviationDate),
      description: body.description,
      category: body.category,
      severity: body.severity || null,
      severityRationale: body.severityRationale || null,
      status: body.status || "open",
    },
    include: {
      site: true,
    },
  });

  return NextResponse.json(deviation, { status: 201 });
}
