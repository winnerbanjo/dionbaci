import Link from "next/link";

import { FadeIn } from "@/components/fade-in";
import { AnimatedImage } from "@/components/ui/AnimatedImage";
import { Section } from "@/components/ui/Section";
import { images } from "@/lib/images";

export function BridalSection() {
  return (
    <Section
      id="bridal"
      eyebrow="Bridal"
      title="Ceremony couture, handled with restraint."
      description={
        <p>
          The bridal atelier centers on refined fittings, sculpted silhouettes, and an exacting calm that
          lets craftsmanship carry the emotion.
        </p>
      }
    >
      <div className="grid gap-px bg-line md:grid-cols-2">
        {images.bridal.slice(0, 2).map((src, index) => (
          <FadeIn key={src} className="bg-paper p-6 sm:p-8 lg:p-10">
            <div className="space-y-5">
              <AnimatedImage src={src} alt={`Bridal couture look ${index + 1}`} />
            </div>
          </FadeIn>
        ))}
      </div>
      <FadeIn className="flex justify-start">
        <Link href="/bridal" className="luxury-button">
          Discover Bridal
        </Link>
      </FadeIn>
      <FadeIn className="flex justify-start">
        <Link href="/book-consultation" className="luxury-button luxury-button--ghost">
          Book Consultation
        </Link>
      </FadeIn>
    </Section>
  );
}
