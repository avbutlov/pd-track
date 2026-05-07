import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const capa = await prisma.cAPA.update({
    where: { id: parseInt(id) },
    data: {
      ...(body.status !== undefined && { status: body.status }),
      ...(body.completionNotes !== undefined && {
        completionNotes: body.completionNotes,
      }),
      ...(body.status === "completed" && { completedAt: new Date() }),
    },
  });

  // If all CAPAs for this deviation are completed, close the deviation
  if (body.status === "completed") {
    const pendingCapas = await prisma.cAPA.count({
      where: {
        deviationId: capa.deviationId,
        status: { not: "completed" },
      },
    });

    if (pendingCapas === 0) {
      await prisma.deviation.update({
        where: { id: capa.deviationId },
        data: { status: "closed" },
      });
    }
  }

  return NextResponse.json(capa);
}
