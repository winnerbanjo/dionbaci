import { PageHero } from "@/components/page-hero";

const policyItems = [
  "No refunds for custom orders.",
  "Alterations are only available if the error is from the brand.",
  "Notification window: 48–72 hours for Nigeria orders.",
  "Notification window: 7 days for international orders.",
  "Off-the-rack items qualify for store credit only and must be unused.",
  "Shipping fees are not refundable.",
  "Client measurement errors are not covered.",
];

export default function ReturnPolicyPage() {
  return (
    <>
      <PageHero
        eyebrow="Return Policy"
        title="A clear policy for custom, ready-to-wear, and shipping matters."
        description="Please review the following conditions before making a purchase or requesting an alteration."
      />
      <section className="section-space">
        <div className="page-shell grid gap-px bg-line md:grid-cols-2">
          {policyItems.map((item) => (
            <div key={item} className="min-h-[220px] bg-paper p-8 sm:p-10">
              <p className="text-2xl leading-tight">{item}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
