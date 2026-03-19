import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

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

  try {
    const id = crypto.randomUUID();

    await prisma.$executeRaw(
      Prisma.sql`
        INSERT INTO "Item" ("id", "name", "image", "category", "type")
        VALUES (${id}, ${name}, ${image}, ${category}, ${type})
      `
    );

    const items = await getAllItems();
    const item = items.find((entry) => entry.id === id);

    return NextResponse.json({ item: item ?? null });
  } catch (error) {
    console.error("DATABASE ERROR:", error);
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
}
