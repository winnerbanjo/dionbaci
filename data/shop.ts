export type ShopItem = {
  id: string;
  slug: string;
  name: string;
  category: string;
  image: string;
  type: string;
  price: number | null;
  description: string | null;
  createdAt: Date;
};
