import { prisma } from "@/lib/prisma";
import { fallbackBeautyItems, fallbackLooks } from "@/data/shop";

export function createItemSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export async function getItemsByType(type: "look" | "beauty") {
  try {
    return await prisma.item.findMany({
      where: { type },
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch {
    return type === "look" ? fallbackLooks : fallbackBeautyItems;
  }
}

export async function getLookBySlug(slug: string) {
  try {
    return await prisma.item.findFirst({
      where: { slug, type: "look" },
    });
  } catch {
    return fallbackLooks.find((item) => item.slug === slug) ?? null;
  }
}
