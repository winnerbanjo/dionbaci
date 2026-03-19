import { PageHero } from "@/components/page-hero";

const terms = [
  "All orders are subject to confirmation and production timelines communicated by the brand.",
  "Consultation bookings are secured only after payment and are governed by the non-refundable consultation policy.",
  "Custom, made-to-order, and bespoke orders require accurate client information and measurements.",
  "Colours, fabrics, and finishes may vary slightly due to sourcing and display conditions.",
  "By placing an order, the client agrees to the brand’s production, shipping, and returns terms.",
];

export default function TermsAndConditionsPage() {
  return (
    <>
      <PageHero
        eyebrow="Terms"
        title="Terms & Conditions"
        description="These terms guide bookings, purchases, custom work, and the overall Dion Baci client experience."
      />
      <section className="section-space">
        <div className="page-shell space-y-6">
          {terms.map((term, index) => (
            <div key={term} className="border border-line p-8 sm:p-10">
              <p className="eyebrow">Clause {index + 1}</p>
              <p className="mt-5 max-w-4xl text-lg leading-8 text-mist">{term}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
