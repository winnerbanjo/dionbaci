import { PageHero } from "@/components/page-hero";

const sections = [
  "Dion Baci collects only the personal information required to manage consultations, communication, orders, and client care.",
  "Details shared with the atelier may be used to arrange appointments, confirm production requirements, coordinate delivery, and provide post-purchase support.",
  "Client information is not sold to third parties. It may be shared only with trusted service providers involved in payment, delivery, or website operations.",
  "By using this website or booking a consultation, you consent to the handling of your information as described in this privacy policy.",
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero
        eyebrow="Privacy"
        title="Privacy Policy"
        description="This policy explains how Dion Baci handles personal information across consultations, communications, and orders."
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
