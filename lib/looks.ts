import { prisma } from "@/lib/prisma";
import { fallbackBeautyItems, fallbackLooks } from "@/data/shop";

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

async function getLegacyItems() {
  const rows = await prisma.$queryRawUnsafe<Array<Omit<RawItem, "slug" | "createdAt">>>(
    'SELECT id, name, image, category, type FROM "Item"'
  );

  return rows.map((row) => ({
    ...row,
    createdAt: null,
  }));
}

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

  if (image.startsWith("/images/") || image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  return `/images/${image.replace(/^\/+/, "")}`;
}

export function normalizeItem(item: RawItem) {
  const name = item.name?.trim();
  const type = item.type?.trim().toLowerCase();
  const image = normalizeImagePath(item.image);

  if (!name || !type) {
    return null;
  }

  return {
    id: item.id?.trim() || `fallback-${createItemSlug(name)}`,
    slug: item.slug?.trim() || createItemSlug(name),
    name,
    category: item.category?.trim() || "Atelier",
    image,
    type,
    createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
  };
}

function getFallbackItems(type: "look" | "beauty") {
  const source = type === "look" ? fallbackLooks : fallbackBeautyItems;

  return source
    .map((item) => normalizeItem(item))
    .filter((item): item is NonNullable<typeof item> => item !== null);
}

export async function getAllItems() {
  try {
    const items = await prisma.item.findMany({
      select: {
        id: true,
        name: true,
        image: true,
        category: true,
        type: true,
      },
    });

    const normalizedItems = items
      .map((item) => normalizeItem(item))
      .filter((item): item is NonNullable<typeof item> => item !== null);

    if (normalizedItems.length === 0) {
      return [...getFallbackItems("look"), ...getFallbackItems("beauty")];
    }

    return normalizedItems;
  } catch (error) {
    console.error("DATABASE ERROR:", error);

    try {
      const legacyItems = await getLegacyItems();
      const normalizedItems = legacyItems
        .map((item) => normalizeItem(item))
        .filter((item): item is NonNullable<typeof item> => item !== null);

      if (normalizedItems.length > 0) {
        return normalizedItems;
      }
    } catch (legacyError) {
      console.error("LEGACY DATABASE ERROR:", legacyError);
    }

    return [...getFallbackItems("look"), ...getFallbackItems("beauty")];
  }
}

export async function getItemsByType(type: "look" | "beauty") {
  const items = await getAllItems();

  const filteredItems = items.filter((item) => item.type?.toLowerCase() === type);

  if (!filteredItems.length) {
    return getFallbackItems(type);
  }

  return filteredItems;
}

export async function getLookBySlug(slug: string) {
  const items = await getAllItems();
  return items.find((item) => item.slug === slug) ?? null;
}
