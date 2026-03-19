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
        description="A focused bridal gallery shaped around ceremony, silhouette, and restraint."
        primaryCta={{ label: "DISCOVER BRIDAL", href: "/bridal" }}
      />
      <Section
        eyebrow="Selected Bridal"
        title="A curated bridal study in proportion, texture, and ceremony."
        description={<p>The bridal page is reserved for a dedicated visual edit and nothing else.</p>}
        align="center"
        border={false}
      >
        <div className="grid gap-px bg-line md:grid-cols-2">
          {images.bridal.map((src, index) => (
            <FadeIn key={src} className="bg-paper p-6 sm:p-8">
              <AnimatedImage src={src} alt={`Bridal gallery look ${index + 1}`} className="bg-[#f6f3ee]" />
            </FadeIn>
          ))}
        </div>
        <FadeIn className="flex justify-center">
          <Link href="/bridal" className="luxury-button min-w-[220px] justify-center">
            DISCOVER BRIDAL
          </Link>
        </FadeIn>
      </Section>
    </>
  );
}
