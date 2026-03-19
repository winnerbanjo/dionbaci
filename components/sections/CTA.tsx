import Link from "next/link";

import { FadeIn } from "@/components/fade-in";

export function CTASection() {
  return (
    <section className="section-space">
      <div className="page-shell">
        <FadeIn className="border border-line px-6 py-12 sm:px-10 lg:px-14 lg:py-16">
          <div className="max-w-3xl space-y-6">
            <p className="eyebrow">Book Consultation</p>
            <h2 className="text-4xl leading-tight sm:text-5xl lg:text-6xl">
              Reserve a private appointment with the atelier.
            </h2>
            <p className="max-w-2xl text-base leading-8 text-mist sm:text-lg">
              Bridal, bespoke occasion, and custom appointments are available on selected Tuesdays and
              Thursdays in person or virtually.
            </p>
            <Link href="/book-consultation" className="luxury-button">
              Book Consultation
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
