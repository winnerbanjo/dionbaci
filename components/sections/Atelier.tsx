import Link from "next/link";

import { FadeIn } from "@/components/fade-in";
import { AnimatedImage } from "@/components/ui/AnimatedImage";
import { Section } from "@/components/ui/Section";
import { images } from "@/lib/images";

const atelierCards = [
  {
    title: "Women",
    text: "Refined occasion and wardrobe pieces designed with sculpted femininity.",
  },
  {
    title: "Bespoke",
    text: "Private work shaped through consultation, fittings, and couture discipline.",
  },
];

export function AtelierSection() {
  return (
    <Section
      id="atelier"
      eyebrow="ATELIER"
      title="Women and bespoke work under one atelier language."
      description={<p>The atelier combines tailored womenswear and private commissions into a single couture-focused destination.</p>}
    >
      <div className="grid gap-px bg-line md:grid-cols-2">
        {images.atelier.slice(0, 2).map((src, index) => (
          <FadeIn key={src} className="bg-paper p-6 sm:p-8">
            <div className="space-y-6">
              <AnimatedImage src={src} alt={atelierCards[index].title} />
              <div className="space-y-3">
                <p className="eyebrow">{atelierCards[index].title}</p>
                <h3 className="text-3xl">{atelierCards[index].title}</h3>
                <p className="text-sm leading-7 text-mist">{atelierCards[index].text}</p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
      <FadeIn className="flex flex-wrap items-center gap-3 sm:gap-4">
        <Link href="/atelier" className="luxury-button min-h-12 min-w-[200px] justify-center">
          Enter Atelier
        </Link>
        <Link
          href="/book-consultation"
          className="luxury-button luxury-button--ghost min-h-12 min-w-[200px] justify-center"
        >
          Book Consultation
        </Link>
      </FadeIn>
    </Section>
  );
}
