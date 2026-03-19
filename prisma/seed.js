const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const defaultItems = [
  {
    slug: "bridal-look-1",
    name: "Ivory Ceremony Dress",
    category: "Bridal",
    type: "look",
    image: "/images/shop/shop-look-01.PNG",
  },
  {
    slug: "bridal-look-2",
    name: "Structured Bridal Form",
    category: "Custom Piece",
    type: "look",
    image: "/images/shop/shop-look-02.PNG",
  },
  {
    slug: "bridal-look-3",
    name: "Soft Veil Silhouette",
    category: "Bridal",
    type: "look",
    image: "/images/shop/shop-look-03.PNG",
  },
  {
    slug: "collection-look-1",
    name: "Editorial Occasion Set",
    category: "Collection",
    type: "look",
    image: "/images/shop/shop-look-04.PNG",
  },
  {
    slug: "collection-look-2",
    name: "Seasonless Wrap Edit",
    category: "Custom Piece",
    type: "look",
    image: "/images/shop/shop-look-05.PNG",
  },
  {
    slug: "atelier-look-1",
    name: "Atelier Woman No. 1",
    category: "Atelier",
    type: "look",
    image: "/images/shop/shop-look-06.PNG",
  },
  {
    slug: "atelier-look-2",
    name: "Atelier Bespoke Form",
    category: "Bespoke",
    type: "look",
    image: "/images/shop/shop-look-07.PNG",
  },
  {
    slug: "atelier-look-3",
    name: "Private Order Look",
    category: "Custom Piece",
    type: "look",
    image: "/images/shop/shop-look-08.PNG",
  },
];

async function main() {
  for (const item of defaultItems) {
    await prisma.item.upsert({
      where: { slug: item.slug },
      update: item,
      create: item,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
