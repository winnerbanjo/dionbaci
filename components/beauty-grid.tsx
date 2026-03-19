import Link from "next/link";

import { FadeIn } from "@/components/fade-in";
import { AnimatedImage } from "@/components/ui/AnimatedImage";
import { ShopItem } from "@/data/shop";

type BeautyGridProps = {
  items: ShopItem[];
};

function getOrderHref(productName: string) {
  const message = encodeURIComponent(`I want to order ${productName}`);
  return `https://wa.me/2347033947449?text=${message}`;
}

export function BeautyGrid({ items }: BeautyGridProps) {
  if (!items || items.length === 0) {
    return (
      <div className="border border-line bg-paper p-10 text-center text-sm text-mist">
        No items available yet
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-px bg-line lg:grid-cols-3 2xl:grid-cols-4">
      {items.map((item, index) => (
        <FadeIn key={item.slug} delay={index * 0.04} className="bg-paper p-4 sm:px-4 sm:py-6">
          <div className="flex h-full flex-col gap-y-3">
            <AnimatedImage src={item.image} alt={item.name} aspect="portrait" />
            <div className="flex min-h-[7rem] flex-1 flex-col justify-start gap-y-2">
              <h3 className="text-base leading-tight sm:text-xl">{item.name}</h3>
              <p className="text-[10px] uppercase tracking-[0.22em] text-mist sm:text-[11px]">
                {item.category}
              </p>
            </div>
            <Link
              href={getOrderHref(item.name)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 w-full items-center justify-center bg-black px-4 py-3 text-center text-[11px] uppercase tracking-[0.18em] text-white transition-all duration-500 ease-out hover:-translate-y-0.5 hover:opacity-90 sm:w-auto"
            >
              Order Now
            </Link>
          </div>
        </FadeIn>
      ))}
    </div>
  );
}
