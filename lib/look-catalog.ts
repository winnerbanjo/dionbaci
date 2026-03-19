export const curatedLookCatalog = [
  {
    slug: "ivory-ceremony-dress",
    name: "Ivory Ceremony Dress",
    category: "Bridal",
    image: "/images/shop/shop-look-01.PNG",
  },
  {
    slug: "structured-bridal-form",
    name: "Structured Bridal Form",
    category: "Custom Piece",
    image: "/images/shop/shop-look-02.PNG",
  },
  {
    slug: "soft-veil-silhouette",
    name: "Soft Veil Silhouette",
    category: "Bridal",
    image: "/images/shop/shop-look-03.PNG",
  },
  {
    slug: "editorial-occasion-set",
    name: "Editorial Occasion Set",
    category: "Collection",
    image: "/images/shop/shop-look-04.PNG",
  },
  {
    slug: "seasonless-wrap-edit",
    name: "Seasonless Wrap Edit",
    category: "Custom Piece",
    image: "/images/shop/shop-look-05.PNG",
  },
  {
    slug: "atelier-woman-no-1",
    name: "Atelier Woman No. 1",
    category: "Atelier",
    image: "/images/shop/shop-look-06.PNG",
  },
  {
    slug: "atelier-bespoke-form",
    name: "Atelier Bespoke Form",
    category: "Bespoke",
    image: "/images/shop/shop-look-07.PNG",
  },
  {
    slug: "private-order-look",
    name: "Private Order Look",
    category: "Custom Piece",
    image: "/images/shop/shop-look-08.PNG",
  },
] as const;

export const curatedLookImageSet = new Set<string>(curatedLookCatalog.map((item) => item.image));
export const curatedLookByImage = new Map<string, (typeof curatedLookCatalog)[number]>(
  curatedLookCatalog.map((item) => [item.image, item])
);
