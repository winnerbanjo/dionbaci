export const dynamic = "force-dynamic";
export const revalidate = 0;

import { BeautyGrid } from "@/components/beauty-grid";
import { PageHero } from "@/components/page-hero";
import { Section } from "@/components/ui/Section";
import { getItemsByType } from "@/lib/looks";

export default async function BeautyPage() {
  const products = await getItemsByType("beauty");

  if (!products || products.length === 0) {
    return (
      <>
        <PageHero
          eyebrow="Beauty"
          title="A considered beauty edit for modern ritual."
          description="Discover a refined collection of body and hair essentials presented with the same clarity, restraint, and premium finish as the house."
        />
        <div className="page-shell p-8 text-center">
          <p>No items available yet</p>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHero
        eyebrow="Beauty"
        title="A considered beauty edit for modern ritual."
        description="Discover a refined collection of body and hair essentials presented with the same clarity, restraint, and premium finish as the house."
      />
      <Section
        eyebrow="Beauty Edit"
        title="Body and hair essentials with a clean, deliberate point of view."
        description={<p>Each product is presented with clean naming, balanced spacing, and a direct path to order.</p>}
        border={false}
      >
        <BeautyGrid items={products} />
      </Section>
    </>
  );
}
