import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const deviationId = searchParams.get("deviationId");

  const where: Record<string, unknown> = {};
  if (deviationId) where.deviationId = parseInt(deviationId);

  const capas = await prisma.cAPA.findMany({
    where,
    include: {
      deviation: {
        select: { deviationNumber: true, description: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(capas);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const capa = await prisma.cAPA.create({
    data: {
      deviationId: parseInt(body.deviationId),
      description: body.description,
      assignedTo: body.assignedTo,
      dueDate: new Date(body.dueDate),
      status: "pending",
    },
  });

  // Update deviation status
  await prisma.deviation.update({
    where: { id: parseInt(body.deviationId) },
    data: { status: "capa_assigned" },
  });

  return NextResponse.json(capa, { status: 201 });
}
