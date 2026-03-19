import { PageHero } from "@/components/page-hero";
import { ProductGrid } from "@/components/product-grid";
import { accessoriesDescription, accessoriesDescriptionExtended, accessoriesProducts } from "@/data/site";

export default function AccessoriesPage() {
  return (
    <>
      <PageHero
        eyebrow="Accessories"
        title="Our Outstanding Accessories"
        description={`${accessoriesDescription} ${accessoriesDescriptionExtended}`}
      />
      <section className="section-space">
        <div className="page-shell">
          <ProductGrid items={accessoriesProducts} />
        </div>
      </section>
    </>
  );
}
