import { prisma } from "@/lib/prisma";
import { ShopItem } from "@/data/shop";

const FALLBACK_IMAGE = "/images/fallback.jpg";

type RawItem = {
  id?: string | null;
  slug?: string | null;
  name?: string | null;
  category?: string | null;
  image?: string | null;
  type?: string | null;
  createdAt?: Date | string | null;
};

export function createItemSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function normalizeImagePath(image?: string | null) {
  if (!image) {
    return FALLBACK_IMAGE;
  }

  if (
    image.startsWith("/images/") ||
    image.startsWith("http://") ||
    image.startsWith("https://")
  ) {
    return image;
  }

  return `/images/${image.replace(/^\/+/, "")}`;
}

export function normalizeItem(item: RawItem): ShopItem | null {
  const name = item.name?.trim();
  const type = item.type?.trim().toLowerCase();

  if (!name || !type) {
    return null;
  }

  return {
    id: item.id?.trim() || `fallback-${createItemSlug(name)}`,
    slug: item.slug?.trim() || createItemSlug(name),
    name,
    category: item.category?.trim() || "Atelier",
    image: normalizeImagePath(item.image),
    type,
    createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
  };
}

export async function getAllItems() {
  try {
    const rows = await prisma.item.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return rows
      .map((item) => normalizeItem(item))
      .filter((item): item is ShopItem => item !== null);
  } catch (error) {
    console.error("DATABASE ERROR:", error);
    return [];
  }
}

export async function getItemsByType(type: "look" | "beauty") {
  try {
    const rows = await prisma.item.findMany({
      where: {
        type: type.toLowerCase(),
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return rows
      .map((item) => normalizeItem(item))
      .filter((item): item is ShopItem => item !== null);
  } catch (error) {
    console.error("DATABASE ERROR:", error);
    return [];
  }
}

export async function getLookBySlug(slug: string) {
  try {
    const item = await prisma.item.findUnique({
      where: { slug },
    });

    return item ? normalizeItem(item) : null;
  } catch (error) {
    console.error("DATABASE ERROR:", error);
    return null;
  }
}
