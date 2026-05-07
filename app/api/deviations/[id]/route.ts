import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const deviation = await prisma.deviation.findUnique({
    where: { id: parseInt(id) },
    include: {
      site: true,
      capas: { orderBy: { createdAt: "desc" } },
      aiClassifications: { orderBy: { createdAt: "desc" } },
    },
  })

  if (!deviation) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  return NextResponse.json(deviation)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()

  const deviation = await prisma.deviation.update({
    where: { id: parseInt(id) },
    data: {
      ...(body.severity !== undefined && { severity: body.severity }),
      ...(body.severityRationale !== undefined && {
        severityRationale: body.severityRationale,
      }),
      ...(body.status !== undefined && { status: body.status }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.category !== undefined && { category: body.category }),
    },
    include: {
      site: true,
      capas: true,
      aiClassifications: true,
    },
  })

  if (body.severity !== undefined || body.severityRationale !== undefined) {
    await prisma.deviation.update({
      where: { id: parseInt(id) },
      data: {
        status: deviation.status === "open" ? "in_review" : deviation.status,
      },
    })
  }

  return NextResponse.json(deviation)
}
