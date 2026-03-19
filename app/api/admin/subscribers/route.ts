import { NextResponse } from "next/server";

import { getSubscribers } from "@/lib/subscribers";

export async function GET() {
  try {
    const subscribers = await getSubscribers();
    return NextResponse.json({ subscribers });
  } catch (error) {
    console.error("SUBSCRIBERS ADMIN ERROR:", error);
    return NextResponse.json({ error: "Unable to load subscribers" }, { status: 503 });
  }
}
