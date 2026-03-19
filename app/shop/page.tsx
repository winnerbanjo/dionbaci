import Link from "next/link";

import { PageHero } from "@/components/page-hero";
import { ShopGrid } from "@/components/shop-grid";
import { Section } from "@/components/ui/Section";
import { getItemsByType } from "@/lib/looks";

export default async function ShopPage() {
  const looks = await getItemsByType("look");

  if (!looks || looks.length === 0) {
    return (
      <>
        <PageHero
          eyebrow="Shop"
          title="An editorial shop experience without checkout."
          description="Browse signature looks, request the piece that speaks to you, and move directly into a private consultation."
          primaryCta={{ label: "Book Consultation", href: "/book-consultation" }}
        />
        <div className="page-shell p-10 text-center">
          <p>No items available yet</p>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHero
        eyebrow="Shop"
        title="An editorial shop experience without checkout."
        description="Browse signature looks, request the piece that speaks to you, and move directly into a private consultation."
        primaryCta={{ label: "Book Consultation", href: "/book-consultation" }}
      />
      <Section
        eyebrow="Selected Looks"
        title="Browse as you would a store. Proceed as you would a couture house."
        description={<p>Every item is an invitation to begin a consultation, not a cart.</p>}
        border={false}
      >
        <ShopGrid items={looks} />
        <Link href="/book-consultation" className="luxury-button">
          Book Consultation
        </Link>
      </Section>
    </>
  );
}
