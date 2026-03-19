import { NextResponse } from "next/server";

import { createItemSlug } from "@/lib/looks";
import { prisma } from "@/lib/prisma";
import { getAllItems } from "@/lib/looks";

export async function GET() {
  try {
    const items = await getAllItems();

    return NextResponse.json({ items });
  } catch (error) {
    console.error("DATABASE ERROR:", error);
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const name = String(body.name ?? "").trim();
  const image = String(body.image ?? "").trim();
  const category = String(body.category ?? "").trim();
  const type = String(body.type ?? "").trim().toLowerCase();

  if (!name || !image || !category || !type) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  let slug = createItemSlug(name);
  let counter = 1;

  try {
    while (await prisma.item.findUnique({ where: { slug } })) {
      slug = `${createItemSlug(name)}-${counter}`;
      counter += 1;
    }

    const item = await prisma.item.create({
      data: {
        name,
        image,
        category,
        type,
        slug,
      },
    });

    return NextResponse.json({ item });
  } catch (error) {
    console.error("DATABASE ERROR:", error);
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
}
