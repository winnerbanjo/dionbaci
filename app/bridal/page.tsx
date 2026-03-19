import Link from "next/link";

import { FadeIn } from "@/components/fade-in";
import { PageHero } from "@/components/page-hero";
import { AnimatedImage } from "@/components/ui/AnimatedImage";
import { Section } from "@/components/ui/Section";
import { images } from "@/lib/images";

export default function BridalPage() {
  return (
    <>
      <PageHero
        eyebrow="Bridal"
        title="Bridal couture shaped for lasting memory."
        description="The bridal atelier focuses on refined fittings, sculpted elegance, and considered detailing for ceremonies of significance."
        primaryCta={{ label: "Book Bridal Consultation", href: "/book-consultation" }}
        secondaryCta={{ label: "Book Consultation", href: "/book-consultation" }}
      />
      <Section
        eyebrow="Selected Bridal"
        title="A gallery of ceremony, proportion, and detail."
        description={<p>Each bridal piece is approached as a personal commission, crafted to reflect individual grace with exacting finish.</p>}
        border={false}
      >
        <div className="grid gap-px bg-line md:grid-cols-2 xl:grid-cols-3">
          {images.bridal.map((src, index) => (
            <FadeIn key={src} className="bg-paper p-6 sm:p-8">
              <AnimatedImage src={src} alt={`Bridal gallery look ${index + 1}`} />
            </FadeIn>
          ))}
        </div>
        <FadeIn className="flex justify-start">
          <Link href="/book-consultation" className="luxury-button">
            Book Consultation
          </Link>
        </FadeIn>
      </Section>
    </>
  );
}
