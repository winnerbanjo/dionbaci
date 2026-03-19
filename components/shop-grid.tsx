import Link from "next/link";

import { FadeIn } from "@/components/fade-in";
import { AnimatedImage } from "@/components/ui/AnimatedImage";
import { ShopItem } from "@/data/shop";

type ShopGridProps = {
  items: ShopItem[];
};

export function ShopGrid({ items }: ShopGridProps) {
  if (!items || items.length === 0) {
    return (
      <div className="border border-line bg-paper p-10 text-center text-sm text-mist">
        No items available yet
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-px bg-line lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item, index) => (
        <FadeIn key={item.slug} delay={index * 0.04} className="bg-paper p-4 sm:p-5">
          <div className="space-y-4">
            <Link href={`/shop/${item.slug}`} className="block">
              <AnimatedImage src={item.image} alt={item.name} />
            </Link>
            <div className="space-y-3">
              <p className="eyebrow">{item.category}</p>
              <Link href={`/shop/${item.slug}`} className="block text-xl leading-tight sm:text-2xl">
                {item.name}
              </Link>
            </div>
            <Link href={`/book-consultation?look=${item.slug}`} className="luxury-button w-full justify-center px-4 text-center text-[10px] sm:text-xs">
              Book Consultation for this Look
            </Link>
          </div>
        </FadeIn>
      ))}
    </div>
  );
}
