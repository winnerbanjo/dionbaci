import { PageHero } from "@/components/page-hero";
import { AtelierSection } from "@/components/sections/Atelier";
import { FadeIn } from "@/components/fade-in";
import Link from "next/link";

export default function AtelierPage() {
  return (
    <>
      <PageHero
        eyebrow="Atelier"
        title="The atelier world of women and bespoke work."
        description="A unified couture-facing destination for womenswear and private commissions shaped with the same editorial restraint."
        primaryCta={{ label: "Book Consultation", href: "/book-consultation" }}
      />
      <AtelierSection />
      <section className="section-space">
        <div className="page-shell">
          <FadeIn className="grid gap-px bg-line md:grid-cols-3">
            {[
              "Women’s pieces with sculpted elegance.",
              "Bespoke development through consultation and fittings.",
              "Every atelier journey leads to a private appointment.",
            ].map((item, index) => (
              <div key={item} className="min-h-[220px] bg-paper p-8 sm:p-10">
                <p className="eyebrow">Atelier 0{index + 1}</p>
                <p className="mt-8 text-3xl leading-tight">{item}</p>
              </div>
            ))}
          </FadeIn>
          <FadeIn className="mt-12">
            <Link href="/book-consultation" className="luxury-button">
              Book Consultation
            </Link>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
