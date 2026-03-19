import { Prisma } from "@prisma/client";
import { readdirSync } from "fs";
import { join } from "path";

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

async function getLegacyItems() {
  const rows = await prisma.$queryRaw<Array<Omit<RawItem, "slug" | "createdAt">>>(
    Prisma.sql`SELECT id, name, image, category, type FROM "Item"`
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

function titleFromFilename(filename: string) {
  return filename
    .replace(/\.[^.]+$/, "")
    .split("-")
    .map((segment) => {
      if (/^\d+ml$/i.test(segment)) {
        return segment.toUpperCase();
      }

      return segment.charAt(0).toUpperCase() + segment.slice(1);
    })
    .join(" ");
}

function categoryFromSlug(slug: string) {
  if (slug.includes("set")) {
    return "Hair Care Set";
  }

  return "Hair Care";
}

function getBeautyProductsFromFolder(): ShopItem[] {
  const beautyDirectory = join(process.cwd(), "public", "images", "beauty");
  const files = readdirSync(beautyDirectory)
    .filter((file) => !file.startsWith("."))
    .filter((file) => /\.(png|jpe?g|webp)$/i.test(file))
    .sort();

  return files.map((file, index) => {
    const slug = createItemSlug(file.replace(/\.[^.]+$/, ""));

    return {
      id: `beauty-folder-${index + 1}`,
      slug,
      name: titleFromFilename(file),
      category: categoryFromSlug(slug),
      image: `/images/beauty/${file}`,
      type: "beauty",
      createdAt: new Date(`2026-01-${String(index + 9).padStart(2, "0")}T00:00:00.000Z`),
    };
  });
}

function getManagedBeautyImages() {
  return new Set(getBeautyProductsFromFolder().map((item) => item.image));
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

async function syncBeautyFolderToDatabase(existingItems: ShopItem[]) {
  const beautyProducts = getBeautyProductsFromFolder();
  const managedBeautyImages = getManagedBeautyImages();
  const existingBeautyImages = new Set(
    existingItems.filter((item) => item.type === "beauty").map((item) => item.image)
  );

  const matchingBeautyItems = existingItems.filter(
    (item) => item.type === "beauty" && managedBeautyImages.has(item.image)
  );

  const productsToCreate =
    matchingBeautyItems.length === 0
      ? beautyProducts.filter((item) => !existingBeautyImages.has(item.image))
      : [];

  if (!productsToCreate.length) {
    return;
  }

  try {
    for (const product of productsToCreate) {
      await prisma.$executeRaw(
        Prisma.sql`
          INSERT INTO "Item" ("id", "name", "image", "category", "type")
          VALUES (${product.id}, ${product.name}, ${product.image}, ${product.category}, ${product.type})
        `
      );
    }

    await prisma.$executeRaw(
      Prisma.sql`
        DELETE FROM "Item"
        WHERE "type" = 'beauty'
        AND "image" NOT IN (${Prisma.join(beautyProducts.map((product) => product.image))})
      `
    );
  } catch (error) {
    console.error("BEAUTY SYNC ERROR:", error);
  }
}

export async function getAllItems() {
  try {
    const items = await getLegacyItems();

    const normalizedItems = items
      .map((item) => normalizeItem(item))
      .filter((item): item is NonNullable<typeof item> => item !== null);

    await syncBeautyFolderToDatabase(normalizedItems);

    const refreshedItems = await getLegacyItems();
    const normalizedRefreshedItems = refreshedItems
      .map((item) => normalizeItem(item))
      .filter((item): item is NonNullable<typeof item> => item !== null);

    if (normalizedRefreshedItems.length === 0) {
      return [];
    }

    return normalizedRefreshedItems;
  } catch (error) {
    console.error("DATABASE ERROR:", error);
    return [];
  }
}

export async function getItemsByType(type: "look" | "beauty") {
  const items = await getAllItems();

  const managedBeautyImages = getManagedBeautyImages();
  const filteredItems = items.filter((item) => {
    if (item.type?.toLowerCase() !== type) {
      return false;
    }

    if (type === "beauty") {
      return managedBeautyImages.has(item.image);
    }

    return true;
  });

  return filteredItems;
}

export async function getLookBySlug(slug: string) {
  const items = await getAllItems();
  return items.find((item) => item.slug === slug) ?? null;
}
