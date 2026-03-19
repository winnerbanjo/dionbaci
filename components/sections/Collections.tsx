import Link from "next/link";

import { FadeIn } from "@/components/fade-in";
import { AnimatedImage } from "@/components/ui/AnimatedImage";
import { Section } from "@/components/ui/Section";
import { images } from "@/lib/images";

const collectionCopy = [
  {
    title: "Ceremony",
    text: "Tailored occasion pieces shaped to feel timeless rather than seasonal.",
  },
  {
    title: "Ready-to-Wear",
    text: "A disciplined wardrobe of structure, fluidity, and quiet confidence.",
  },
  {
    title: "Private Orders",
    text: "Personal commissions developed with considered fittings and finish.",
  },
];

export function CollectionsSection() {
  return (
    <Section
      id="collections"
      eyebrow="Collections"
      title="A curated view of ceremony, wardrobe, and special order."
      description={<p>Collection stories are presented with clarity, allowing silhouette, finish, and proportion to lead.</p>}
    >
      <div className="grid gap-px bg-line xl:grid-cols-3">
        {images.collections.map((src, index) => (
          <FadeIn key={src} className="bg-paper p-6 sm:p-8">
            <div className="space-y-6">
              <AnimatedImage src={src} alt={collectionCopy[index].title} />
              <div className="space-y-3">
                <p className="eyebrow">{collectionCopy[index].title}</p>
                <h3 className="text-3xl">{collectionCopy[index].title}</h3>
                <p className="text-sm leading-7 text-mist">{collectionCopy[index].text}</p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
      <FadeIn className="flex justify-start">
        <Link href="/collections" className="luxury-button">
          View Collections
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
