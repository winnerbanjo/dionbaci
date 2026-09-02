import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { createItemSlug, getAllItems, normalizeItem } from "@/lib/looks";

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
  const price = Number(body.price);
  const description = String(body.description ?? "").trim();
  const slug = String(body.slug ?? "").trim() || createItemSlug(name);

  if (!name || !image || !category || !type || !slug || !description || !Number.isInteger(price) || price <= 0) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    const createdItem = await prisma.item.create({
      data: {
        name,
        slug,
        image,
        category,
        type,
        price,
        description,
      },
    });

    const item = normalizeItem(createdItem);

    return NextResponse.json({ item });
  } catch (error) {
    console.error("DATABASE ERROR:", error);
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
}
