import Link from "next/link";

import { PageHero } from "@/components/page-hero";
import { ShopGrid } from "@/components/shop-grid";
import { Section } from "@/components/ui/Section";
import { getItemsByType } from "@/lib/looks";

export default async function BeautyPage() {
  const products = await getItemsByType("beauty");

  return (
    <>
      <PageHero
        eyebrow="Beauty"
        title="Beauty rituals shaped with the same restraint as the atelier."
        description="Discover a considered edit of beauty essentials curated to extend the Dion Baci world beyond fashion."
        primaryCta={{ label: "Book Consultation", href: "/book-consultation" }}
      />
      <Section
        eyebrow="Beauty Edit"
        title="Admin-controlled beauty products, presented with the same editorial calm."
        description={<p>Every product detail remains minimal, deliberate, and aligned with the brand universe.</p>}
        border={false}
      >
        <ShopGrid items={products} />
        <Link href="/book-consultation" className="luxury-button">
          Book Consultation
        </Link>
      </Section>
    </>
  );
}
