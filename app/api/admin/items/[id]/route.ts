import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { createItemSlug } from "@/lib/looks";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const body = await request.json();
  const name = String(body.name ?? "").trim();
  const image = String(body.image ?? "").trim();
  const category = String(body.category ?? "").trim();
  const type = String(body.type ?? "").trim().toLowerCase();
  const slug = String(body.slug ?? "").trim() || createItemSlug(name);

  if (!id || !name || !image || !category || !type || !slug) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    await prisma.item.update({
      where: { id },
      data: {
        name,
        image,
        category,
        type,
        slug,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DATABASE ERROR:", error);
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
}

export async function DELETE(_: Request, context: RouteContext) {
  const { id } = await context.params;

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  try {
    await prisma.item.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DATABASE ERROR:", error);
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
}
