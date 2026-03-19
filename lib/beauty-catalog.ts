export const curatedBeautyCatalog = [
  {
    slug: "leave-in-creme-conditioner-200ml",
    name: "Leave-In Crème Conditioner (200ml)",
    category: "Hair Care",
    image: "/images/beauty/leave-in-creme-conditioner-200ml.PNG",
  },
  {
    slug: "leave-in-creme-conditioner-300ml-pump",
    name: "Leave-In Crème Conditioner (300ml Pump)",
    category: "Hair Care",
    image: "/images/beauty/leave-in-creme-conditioner-300ml-pump.PNG",
  },
  {
    slug: "leave-in-creme-conditioner-300ml-tube",
    name: "Leave-In Crème Conditioner (300ml Tube)",
    category: "Hair Care",
    image: "/images/beauty/leave-in-creme-conditioner-300ml-tube.PNG",
  },
  {
    slug: "hair-couture-treatment",
    name: "Hair Couture Treatment",
    category: "Treatment",
    image: "/images/beauty/IMG_9798.PNG",
  },
  {
    slug: "hair-couture-set",
    name: "Hair Couture Set",
    category: "Hair Care Set",
    image: "/images/beauty/IMG_9799.PNG",
  },
  {
    slug: "hair-nourishing-collection",
    name: "Hair Nourishing Collection",
    category: "Hair Ritual",
    image: "/images/beauty/IMG_9805.PNG",
  },
  {
    slug: "hair-couture-ritual-set",
    name: "Hair Couture Ritual Set",
    category: "Hair Care Set",
    image: "/images/beauty/hair-couture-set.PNG",
  },
] as const;

export const curatedBeautyImageSet = new Set<string>(curatedBeautyCatalog.map((item) => item.image));
export const curatedBeautyByImage = new Map<string, (typeof curatedBeautyCatalog)[number]>(
  curatedBeautyCatalog.map((item) => [item.image, item])
);
