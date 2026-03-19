import { PageHero } from "@/components/page-hero";

const sections = [
  "Shipping timelines vary depending on whether a piece is ready-to-wear, made-to-order, or bespoke.",
  "Clients receive dispatch communication once an order is approved for shipping. Delivery fees are communicated separately where applicable.",
  "International shipment timing may vary due to customs processing, destination requirements, and local courier handling.",
  "Dion Baci is not responsible for delays caused by incorrect client information, customs procedures, or courier disruptions outside the brand’s control.",
];

export default function ShippingPolicyPage() {
  return (
    <>
      <PageHero
        eyebrow="Shipping"
        title="Shipping Policy"
        description="Please review the terms that apply to domestic and international delivery."
      />
      <section className="section-space">
        <div className="page-shell max-w-4xl space-y-6">
          {sections.map((section, index) => (
            <div key={section} className="border border-line p-8 sm:p-10">
              <p className="eyebrow">Section {index + 1}</p>
              <p className="mt-5 text-lg leading-8 text-mist">{section}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
