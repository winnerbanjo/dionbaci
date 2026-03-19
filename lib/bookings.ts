import { prisma } from "@/lib/prisma";

export type BookingRecord = {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  type: string;
  notes: string | null;
  paymentProof: string | null;
  status: string;
  createdAt: Date;
};

export async function getBookings() {
  try {
    const bookings = await prisma.booking.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return bookings as BookingRecord[];
  } catch (error) {
    console.error("BOOKINGS ERROR:", error);
    return [];
  }
}
