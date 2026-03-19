import Image from "next/image";
import Link from "next/link";

import { ShopItem } from "@/data/shop";

type LookPreviewProps = {
  item: ShopItem;
};

export function LookPreview({ item }: LookPreviewProps) {
  const safeImage = item.image || "/images/fallback.jpg";

  return (
    <section className="section-space border-b border-line">
      <div className="page-shell grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-center">
        <div className="relative aspect-[4/5] overflow-hidden bg-[#f7f7f5]">
          <Image src={safeImage} alt={item.name} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 40vw" />
        </div>
        <div className="max-w-2xl space-y-6">
          <p className="eyebrow">{item.category}</p>
          <h2 className="text-4xl leading-tight sm:text-5xl">{item.name}</h2>
          <p className="text-base leading-8 text-mist sm:text-lg">
            You are requesting this look. Complete your consultation to proceed.
          </p>
          <Link href="/shop" className="luxury-button luxury-button--ghost">
            Return to Shop
          </Link>
        </div>
      </div>
    </section>
  );
}
