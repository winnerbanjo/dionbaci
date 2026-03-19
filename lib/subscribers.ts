import { prisma } from "@/lib/prisma";

export type SubscriberRecord = {
  id: string;
  email: string;
  createdAt: Date;
};

export async function getSubscribers() {
  try {
    const subscribers = await prisma.subscriber.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return subscribers as SubscriberRecord[];
  } catch (error) {
    console.error("SUBSCRIBERS ERROR:", error);
    return [];
  }
}
