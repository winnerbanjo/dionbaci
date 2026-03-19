import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function DELETE(_: Request, context: RouteContext) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ error: "Missing subscriber id" }, { status: 400 });
    }

    await prisma.subscriber.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("SUBSCRIBER DELETE ERROR:", error);
    return NextResponse.json({ error: "Unable to delete subscriber" }, { status: 503 });
  }
}
