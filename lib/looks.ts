import { prisma } from "@/lib/prisma";
import { curatedBeautyByImage, curatedBeautyCatalog } from "@/lib/beauty-catalog";
import { curatedLookByImage, curatedLookCatalog } from "@/lib/look-catalog";
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
  const image = normalizeImagePath(item.image);

  if (!name || !type) {
    return null;
  }

  const curatedBeautyItem = type === "beauty" ? curatedBeautyByImage.get(image) : null;
  const curatedLookItem = type === "look" ? curatedLookByImage.get(image) : null;

  return {
    id: item.id?.trim() || `fallback-${createItemSlug(curatedBeautyItem?.name ?? curatedLookItem?.name ?? name)}`,
    slug: curatedBeautyItem?.slug || curatedLookItem?.slug || item.slug?.trim() || createItemSlug(name),
    name: curatedBeautyItem?.name || curatedLookItem?.name || name,
    category: curatedBeautyItem?.category || curatedLookItem?.category || item.category?.trim() || "Atelier",
    image,
    type,
    createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
  };
}

function getCuratedBeautyItems(): ShopItem[] {
  return curatedBeautyCatalog.map((item, index) => ({
    id: `curated-beauty-${index + 1}`,
    slug: item.slug,
    name: item.name,
    category: item.category,
    image: item.image,
    type: "beauty",
    createdAt: new Date(`2026-03-${String(index + 1).padStart(2, "0")}T00:00:00.000Z`),
  }));
}

function mergeCuratedBeautyItems(items: ShopItem[]) {
  const catalog = [...items];
  const existingImages = new Set(
    catalog.filter((item) => item.type === "beauty").map((item) => item.image)
  );

  for (const item of getCuratedBeautyItems()) {
    if (!existingImages.has(item.image)) {
      catalog.push(item);
    }
  }

  return catalog;
}

function getCuratedLookItems(): ShopItem[] {
  return curatedLookCatalog.map((item, index) => ({
    id: `curated-look-${index + 1}`,
    slug: item.slug,
    name: item.name,
    category: item.category,
    image: item.image,
    type: "look",
    createdAt: new Date(`2026-02-${String(index + 1).padStart(2, "0")}T00:00:00.000Z`),
  }));
}

function mergeCuratedLookItems(items: ShopItem[]) {
  const catalog = [...items];
  const existingImages = new Set(
    catalog.filter((item) => item.type === "look").map((item) => item.image)
  );

  for (const item of getCuratedLookItems()) {
    if (!existingImages.has(item.image)) {
      catalog.push(item);
    }
  }

  return catalog;
}

export async function getAllItems() {
  try {
    const rows = await prisma.item.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return mergeCuratedLookItems(
      mergeCuratedBeautyItems(
        rows
        .map((item) => normalizeItem(item))
        .filter((item): item is ShopItem => item !== null)
      )
    );
  } catch (error) {
    console.error("DATABASE ERROR:", error);
    return [...getCuratedLookItems(), ...getCuratedBeautyItems()];
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

    const items = rows
      .map((item) => normalizeItem(item))
      .filter((item): item is ShopItem => item !== null && item.type === type);

    if (type === "beauty") {
      return mergeCuratedBeautyItems(items);
    }

    if (type === "look") {
      return mergeCuratedLookItems(items);
    }

    return items;
  } catch (error) {
    console.error("DATABASE ERROR:", error);
    return type === "beauty" ? getCuratedBeautyItems() : getCuratedLookItems();
  }
}

export async function getLookBySlug(slug: string) {
  try {
    const item = await prisma.item.findUnique({
      where: { slug },
    });

    return item ? normalizeItem(item) : getCuratedLookItems().find((entry) => entry.slug === slug) ?? null;
  } catch (error) {
    console.error("DATABASE ERROR:", error);
    return getCuratedLookItems().find((entry) => entry.slug === slug) ?? null;
  }
}
