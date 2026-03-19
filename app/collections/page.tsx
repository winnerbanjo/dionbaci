import Link from "next/link";

import { PageHero } from "@/components/page-hero";
import { FadeIn } from "@/components/fade-in";
import { AnimatedImage } from "@/components/ui/AnimatedImage";
import { Section } from "@/components/ui/Section";
import { images } from "@/lib/images";

const collectionItems = [
  { title: "Ceremony", description: "Tailored occasion silhouettes with sculpted calm.", href: "/book-consultation" },
  { title: "Ready-to-Wear", description: "Refined wardrobe pieces built for permanence.", href: "/book-consultation" },
  { title: "Private Order", description: "Special commissions guided through consultation.", href: "/book-consultation" },
];

export default function CollectionsPage() {
  return (
    <>
      <PageHero
        eyebrow="Collections"
        title="Seasonless edits built around precision."
        description="Dion Baci collections balance couture sensibility with modern everyday dressing and private order refinement."
        primaryCta={{ label: "Book Consultation", href: "/book-consultation" }}
      />
      <Section
        eyebrow="Collection Edit"
        title="A clean overview of the current fashion house offering."
        description={<p>Each collection tile directs the client back into the private consultation journey.</p>}
        border={false}
      >
        <div className="grid gap-px bg-line md:grid-cols-2 xl:grid-cols-3">
          {images.collections.map((src, index) => (
            <FadeIn key={src} className="bg-paper p-6 sm:p-8">
              <Link href={collectionItems[index].href} className="block space-y-6">
                <AnimatedImage src={src} alt={collectionItems[index].title} />
                <div className="space-y-3">
                  <p className="eyebrow">{collectionItems[index].title}</p>
                  <h2 className="text-3xl">{collectionItems[index].title}</h2>
                  <p className="text-sm leading-7 text-mist">{collectionItems[index].description}</p>
                </div>
              </Link>
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
