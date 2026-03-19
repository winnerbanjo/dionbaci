import { images } from "@/lib/images";

export type ShopItem = {
  id: string;
  slug: string;
  name: string;
  category: string;
  image: string;
  type: string;
  createdAt: Date;
};

export const fallbackLooks: ShopItem[] = [
  {
    id: "fallback-look-1",
    slug: "bridal-look-1",
    name: "Ivory Ceremony Dress",
    category: "Bridal",
    image: images.shop[0],
    type: "look",
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
  },
  {
    id: "fallback-look-2",
    slug: "bridal-look-2",
    name: "Structured Bridal Form",
    category: "Custom Piece",
    image: images.shop[1],
    type: "look",
    createdAt: new Date("2026-01-02T00:00:00.000Z"),
  },
  {
    id: "fallback-look-3",
    slug: "bridal-look-3",
    name: "Soft Veil Silhouette",
    category: "Bridal",
    image: images.shop[2],
    type: "look",
    createdAt: new Date("2026-01-03T00:00:00.000Z"),
  },
  {
    id: "fallback-look-4",
    slug: "collection-look-1",
    name: "Editorial Occasion Set",
    category: "Collection",
    image: images.shop[3],
    type: "look",
    createdAt: new Date("2026-01-04T00:00:00.000Z"),
  },
  {
    id: "fallback-look-5",
    slug: "collection-look-2",
    name: "Seasonless Wrap Edit",
    category: "Custom Piece",
    image: images.shop[4],
    type: "look",
    createdAt: new Date("2026-01-05T00:00:00.000Z"),
  },
  {
    id: "fallback-look-6",
    slug: "atelier-look-1",
    name: "Atelier Woman No. 1",
    category: "Atelier",
    image: images.shop[5],
    type: "look",
    createdAt: new Date("2026-01-06T00:00:00.000Z"),
  },
  {
    id: "fallback-look-7",
    slug: "atelier-look-2",
    name: "Atelier Bespoke Form",
    category: "Bespoke",
    image: images.shop[6],
    type: "look",
    createdAt: new Date("2026-01-07T00:00:00.000Z"),
  },
  {
    id: "fallback-look-8",
    slug: "atelier-look-3",
    name: "Private Order Look",
    category: "Custom Piece",
    image: images.shop[7],
    type: "look",
    createdAt: new Date("2026-01-08T00:00:00.000Z"),
  },
];

export const fallbackBeautyItems: ShopItem[] = [
  {
    id: "fallback-beauty-1",
    slug: "leave-in-creme-conditioner-300ml",
    name: "Leave-in Creme Conditioner 300ml",
    category: "Hair Care",
    image: images.beauty[0],
    type: "beauty",
    createdAt: new Date("2026-01-09T00:00:00.000Z"),
  },
  {
    id: "fallback-beauty-2",
    slug: "leave-in-creme-conditioner-pump-300ml",
    name: "Leave-in Creme Conditioner Pump 300ml",
    category: "Hair Care",
    image: images.beauty[1],
    type: "beauty",
    createdAt: new Date("2026-01-10T00:00:00.000Z"),
  },
  {
    id: "fallback-beauty-3",
    slug: "hair-couture-set",
    name: "Hair Couture Set",
    category: "Hair Care Set",
    image: images.beauty[2],
    type: "beauty",
    createdAt: new Date("2026-01-11T00:00:00.000Z"),
  },
  {
    id: "fallback-beauty-4",
    slug: "leave-in-creme-conditioner-200ml",
    name: "Leave-in Creme Conditioner 200ml",
    category: "Hair Care",
    image: images.beauty[3],
    type: "beauty",
    createdAt: new Date("2026-01-12T00:00:00.000Z"),
  },
];
