import { NextResponse } from "next/server";

import { getBookings } from "@/lib/bookings";

export async function GET() {
  try {
    const bookings = await getBookings();
    return NextResponse.json({ bookings });
  } catch (error) {
    console.error("BOOKINGS ADMIN ERROR:", error);
    return NextResponse.json({ error: "Unable to load bookings" }, { status: 503 });
  }
}
